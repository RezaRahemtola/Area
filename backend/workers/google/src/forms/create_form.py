import json

import grpc
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData


SCOPES = ['https://www.googleapis.com/auth/forms.body']
TARGET = "localhost:50050"

def create_form():
    args = get_arguments({"auth", "name", "workflowStepId"})

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('forms', 'v1', credentials=creds)

        body = {
            "info": {
                "documentTitle": args["name"],
                "title": args["name"]
            },
        }
        service.forms().create(body=body).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="forms", identifier="google-create-form", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
