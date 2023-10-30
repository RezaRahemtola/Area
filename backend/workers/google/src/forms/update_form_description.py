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

SCOPES = ['https://www.googleapis.com/auth/forms.body']
TARGET = "localhost:50050"


def update_form_description():
    args = get_arguments({"auth", "formId", "description", "workflowStepId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('forms', 'v1', credentials=creds)

        body = {
            "requests": [{
                "updateFormInfo": {
                    "info": {
                        "description": args["description"]
                    },
                    "updateMask": "description"
                }
            }]
        }
        service.forms().forms().batchUpdate(formId=args["formId"], body=body).execute()

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(
                JobData(name="google-form-update-description", identifier=args["identifier"], params=params))

    except RefreshError as error:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(error), isAuthError=True))
        exit(1)
    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
