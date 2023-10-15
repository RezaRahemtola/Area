import json

import grpc
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

SCOPES = ['https://www.googleapis.com/auth/gmail.settings.basic']
TARGET = "localhost:50050"

def update_signature():
    args = get_arguments({"auth", "signature", "workflowStepId"})

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('gmail', 'v1', credentials=creds)

        primary_alias = None

        aliases = service.users().settings().sendAs().list(userId='me')\
            .execute()
        for alias in aliases.get('sendAs'):
            if alias.get('isPrimary'):
                primary_alias = alias
                break

        send_as_configuration = {
            'displayName': primary_alias.get('sendAsEmail'),
            'signature': args["signature"]
        }

        result = service.users().settings().sendAs() \
            .patch(userId='me', sendAsEmail=primary_alias.get('sendAsEmail'),
                   body=send_as_configuration).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "displayName": result.get("displayName")
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="gmail", identifier="google-update-signature-email", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
        result = None
