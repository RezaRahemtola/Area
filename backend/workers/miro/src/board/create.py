import json

import grpc
import requests
from google.protobuf.struct_pb2 import Struct

from area_back_pb2 import JobError
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

URL = 'https://api.miro.com/v1/boards'
TARGET = "localhost:50050"


def create_board():
    args = get_arguments({"auth", "name", "description", "workflowStepId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET
    credentials = json.loads(args["auth"])

    headers = {
        'Authorization': f'Bearer {credentials["access_token"]}',
        'Content-Type': 'application/json'
    }
    board_data = {
        "name": args["name"],
        "description": args["description"],
        "teamId": credentials["team_id"],
    }

    response = requests.post(URL, headers=headers, json=board_data)

    if response.status_code == 201:
        created_board = response.json()
        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "url": created_board["viewLink"],
                "createdAt": created_board["createdAt"],
            })
            AreaBackServiceStub(channel).OnReaction(
                JobData(name="miro-create-board", identifier=args["identifier"], params=params))

    else:
        error = response.json()
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=error["message"], isAuthError=(response.status_code == 401 or response.status_code == 403)))
