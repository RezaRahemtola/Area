import json
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


SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
TARGET = "localhost:50050"

def create_comment():
    args = {}
    for i in range(2, len(sys.argv)):
        if sys.argv[i].startswith("--"):
            if not sys.argv[i + 1]:
                print(F"Error: No value specified for {sys.argv[i]}")
                exit(1)
            args[sys.argv[i][2:]] = sys.argv[i + 1]
            i += 1

    keys_needed = {"auth", "videoId", "content", "workflowStepId"}
    missing = keys_needed.difference(args.keys())
    if missing:
        print(F"Error: Missing required keys: {missing}")
        exit(1)

    credentials = json.loads(args["auth"])

    creds = Credentials.from_authorized_user_info(info={
        "refresh_token": credentials["refresh_token"],
        "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
    }, scopes=SCOPES)

    try:
        service = build('youtube', 'v3', credentials=creds)

        service.commentThreads().insert(
            part="snippet",
            body={
                "snippet": {
                    "videoId": args["videoId"],
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": args["content"]
                        }
                    }
                }
            }
        ).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="youtube", identifier="google-create-comment-youtube", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
