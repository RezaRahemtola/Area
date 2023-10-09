import base64
import os
import sys

from email.message import EmailMessage

import grpc
from google.oauth2.credentials import Credentials
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

SCOPES = ['https://www.googleapis.com/auth/gmail.send']
TARGET = "localhost:50050"

def send_email():
    args = {}
    for i in range(2, len(sys.argv)):
        if sys.argv[i].startswith("--"):
            if not sys.argv[i + 1]:
                print(F"Error: No value specified for {sys.argv[i]}")
                exit(1)
            args[sys.argv[i][2:]] = sys.argv[i + 1]
            i += 1

    keys_needed = {"refreshToken", "to", "subject", "content", "workflowStepId"}
    missing = keys_needed.difference(args.keys())
    if missing:
        print(F"Error: Missing required keys: {missing}")
        exit(1)

    creds = Credentials.from_authorized_user_info(info={
        "refresh_token": args["refreshToken"],
        "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
    }, scopes=SCOPES)

    try:
        service = build('gmail', 'v1', credentials=creds)
        message = EmailMessage()
        message.set_content(args["content"])

        message['To'] = args["to"]
        message['Subject'] = args["subject"]

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {
            'raw': encoded_message
        }
        email = service.users().messages().send(userId="me", body=create_message).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "emailId": email["id"]
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="gmail", identifier="google-send-email", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
        exit(1)
