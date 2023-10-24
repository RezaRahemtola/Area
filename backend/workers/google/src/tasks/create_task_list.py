import json
import requests
import sys

import grpc
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData
from area_back_pb2 import JobError

SCOPES = ['https://www.googleapis.com/auth/tasks']
TARGET = "localhost:50050"


def create_task_list():
    args = get_arguments({"auth", "title", "workflowStepId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    try:
        credentials = json.loads(args["auth"])
        creds = forge_credentials(credentials["refresh_token"], SCOPES)

        service = build('tasks', 'v1', credentials=creds)

        body = {
            "kind": "tasks#taskList",
            "title": args["title"],
        }
        service.tasklists().insert(body=body).execute()

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(
                JobData(name="google-create-task-list", identifier=args["identifier"], params=params))

    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
