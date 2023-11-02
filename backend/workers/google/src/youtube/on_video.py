import sys
import urllib3

import grpc
import xml.etree.ElementTree as ET
from google.protobuf.struct_pb2 import Struct
from time import sleep

from area_back_pb2 import JobError
from area_types_pb2 import JobData
from src.utils.parsing import get_arguments

from area_back_pb2_grpc import AreaBackServiceStub

TARGET = "localhost:50050"
SEARCH_TIMEOUT = 60
PROPERTIES = {
    "{http://www.youtube.com/xml/schemas/2015}videoId": "videoId",
    "{http://www.youtube.com/xml/schemas/2015}channelId": "channelId",
    "{http://www.w3.org/2005/Atom}title": "title",
    "{http://search.yahoo.com/mrss/}description": "description",
    "{http://www.w3.org/2005/Atom}published": "createdAt",
}
FETCH_URL = "https://www.youtube.com/feeds/videos.xml?channel_id="
WATCH_URL = "https://www.youtube.com/watch?v="


def search_last_video(channel_id: str):
    video = None
    res = urllib3.request("GET", FETCH_URL + channel_id)
    xml = ET.fromstring(res.data.decode("utf-8"))
    for child in xml:
        if child.tag == "{http://www.w3.org/2005/Atom}entry":
            video = {}
            for i in child.iter():
                if i.tag in PROPERTIES.keys():
                    video[PROPERTIES[i.tag]] = i.text
            video["url"] = WATCH_URL + video["videoId"]
            break
    return video


def is_new_video(first_video, last_video):
    if first_video is None:
        return last_video is not None
    if last_video is None:
        return False
    return first_video["videoId"] != last_video["videoId"]


def on_video():
    args = get_arguments({"channelId", "identifier"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    try:
        first_video = search_last_video(args["channelId"])

        while True:
            sleep(SEARCH_TIMEOUT)
            last_video = search_last_video(args["channelId"])
            if is_new_video(first_video, last_video):
                with grpc.insecure_channel(target) as channel:
                    params = Struct()
                    params.update({
                        "title": last_video["title"],
                        "description": last_video["description"],
                        "createdAt": last_video["createdAt"],
                        "url": last_video["url"]
                    })
                    AreaBackServiceStub(channel).OnReaction(JobData(name="google-on-new-video", identifier=args["identifier"], params=params))
                first_video = last_video

    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
