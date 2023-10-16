import json

import grpc
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData


SCOPES = ['https://www.googleapis.com/auth/documents']
TARGET = "localhost:50050"

def create_document():
    args = get_arguments({"auth", "name", "workflowStepId"})

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('docs', 'v1', credentials=creds)

        body = {
            'title': args["name"]
        }
        document = service.documents() \
            .create(body=body).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "docTitle": document.get('title')
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="docs", identifier="google-create-document-docs", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
