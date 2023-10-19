import base64
import json
import sys

from email.message import EmailMessage

import grpc
from google.auth.exceptions import RefreshError
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build

from area_back_pb2 import JobError
from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

SCOPES = ['https://www.googleapis.com/auth/gmail.send']
TARGET = "localhost:50050"


def send_email():
    args = get_arguments({"auth", "to", "subject", "body", "workflowStepId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('gmail', 'v1', credentials=creds)
        message = EmailMessage()
        message.set_content(args["body"])

        message['To'] = args["to"]
        message['Subject'] = args["subject"]

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {
            'raw': encoded_message
        }
        email = service.users().messages().send(userId="me", body=create_message).execute()

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "emailId": email["id"]
            })
            AreaBackServiceStub(channel).OnReaction(
                JobData(name="google-send-email", identifier=args["identifier"], params=params))

    except RefreshError as error:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(JobError(identifier=args["identifier"], error=str(error), isAuthError=True))
        exit(1)
    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
