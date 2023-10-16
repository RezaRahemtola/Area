import base64
import json

from email.message import EmailMessage

import grpc
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

SCOPES = ['https://www.googleapis.com/auth/gmail.compose']
TARGET = "localhost:50050"

def create_draft():
    args = get_arguments({"auth", "to", "subject", "body", "workflowStepId"})

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
            'message': {
                'raw': encoded_message
            }
        }
        draft = service.users().drafts().create(userId="me",
                                                body=create_message).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "emailId": draft["id"]
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="gmail", identifier="google-create-draft-email", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
        draft = None
