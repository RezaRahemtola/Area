import json
import requests

import grpc
from google.protobuf.struct_pb2 import Struct

from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub
from area_types_pb2 import JobData

TARGET = "localhost:50050"


def create_post():
    args = get_arguments({"auth", "content", "workflowStepId", "identifier"})

    try:
        credentials = json.loads(args["auth"])
        # TODO Reza: remove debug auth
        print(credentials)
        user_data = requests.get("https://api.linkedin.com/v2/userinfo",
                                 headers={"Authorization": f"Bearer {credentials['access_token']}"}).json()

        response = requests.post(
            "https://api.linkedin.com/v2/ugcPosts", json.dumps({
                "author": f"urn:li:person:{user_data['sub']}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    'com.linkedin.ugc.ShareContent': {
                        'shareCommentary': {
                            'text': args["content"],
                        },
                        'shareMediaCategory': 'ARTICLE',
                        'media': [
                            {
                                'status': 'READY',
                                'description': {
                                    'text': 'Read our latest blog post about LinkedIn API!',
                                },
                                'originalUrl': 'https://area.rezar.fr',
                            },
                        ],
                    },
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            })

            , headers={
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                "Authorization": f"Bearer {credentials['access_token']}"})

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="linkedin-create-post", identifier=args["identifier"], params=params))

    except RefreshError as error:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(JobError(identifier=args["identifier"], error=str(error), isAuthError=True))
        exit(1)
    except:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        exit(1)
