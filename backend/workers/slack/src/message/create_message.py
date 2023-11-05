import json
import sys

import grpc
from google.protobuf.struct_pb2 import Struct
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from area_back_pb2 import JobError
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

TARGET = "localhost:50050"


def create_message():
    args = get_arguments({"auth", "channelId", "text", "workflowStepId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET
    credentials = json.loads(args["auth"])

    try:
        client = WebClient(token=credentials["authed_user"]["access_token"])
        response = client.chat_postMessage(channel=args["channelId"], text=args["text"])

        print(response)

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(
                JobData(name="slack-create-message", identifier=args["identifier"], params=params))

    except SlackApiError as error:
        message = error.response["error"]
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=message, isAuthError=(message == "invalid_auth")))
        exit(1)
    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
