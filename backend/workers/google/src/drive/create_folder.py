import json
import sys

import grpc
from google.auth.exceptions import RefreshError
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build

from area_back_pb2 import JobError
from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData


SCOPES = ['https://www.googleapis.com/auth/drive']
TARGET = "localhost:50050"

def create_drive_folder():
    args = get_arguments({"auth", "name", "workflowStepId", "identifier"})

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('drive', 'v3', credentials=creds)

        body = {
            'name': args["name"],
            'mimeType': 'application/vnd.google-apps.folder'
        }

        folder = service.files().create(body=body, fields='id').execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "folderId": folder.get("id")
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="google-create-drive-folder", identifier=args["identifier"], params=params))

    except RefreshError as error:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(JobError(identifier=args["identifier"], error=str(error), isAuthError=True))
        exit(1)
    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
