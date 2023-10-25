import json
import sys

import grpc
from google.auth.exceptions import RefreshError
from google.protobuf.struct_pb2 import Struct
from googleapiclient.discovery import build
from time import sleep

from area_back_pb2 import JobError
from area_types_pb2 import JobData
from src.utils.auth import forge_credentials
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub

SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
TARGET = "localhost:50050"
SEARCH_TIMEOUT = 10

def search_last_video(service, channelId):
    return service.search().list(
        part="snippet",
        channelId=channelId,
        maxResults=1,
        order="date",
        type="video"
    ).execute()


def is_new_video(first_video, last_video):
    if len(first_video["items"]) == 0:
        return len(last_video["items"]) > 0
    elif len(last_video["items"]) == 0:
        return False
    return first_video["items"][0]["id"]["videoId"] != last_video["items"][0]["id"]["videoId"]


def on_video():
    args = get_arguments({"auth", "channelId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    credentials = json.loads(args["auth"])
    creds = forge_credentials(credentials["refresh_token"], SCOPES)

    try:
        service = build('youtube', 'v3', credentials=creds)
        first_video = search_last_video(service, args["channelId"])

        while True:
            sleep(SEARCH_TIMEOUT)
            last_video = search_last_video(service, args["channelId"])
            if is_new_video(first_video, last_video):
                video = last_video["items"][0]
                with grpc.insecure_channel(target) as channel:
                    params = Struct()
                    params.update({
                        "channelId": args["channelId"],
                        "videoId": video["id"]["videoId"],
                        "title": video["snippet"]["title"],
                        "description": video["snippet"]["description"],
                        "createdAt": video["snippet"]["publishedAt"],
                        "thumbnail": video["snippet"]["thumbnails"]["default"]["url"]
                    })
                    AreaBackServiceStub(channel).OnReaction(
                        JobData(name="google-on-new-video", identifier=args["identifier"], params=params))
                first_video = last_video

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
