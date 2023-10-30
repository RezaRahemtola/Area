import json
import os
import sys
import gitlab
import grpc
from gitlab import GitlabAuthenticationError

from area_back_pb2 import JobError
from area_back_pb2_grpc import AreaBackServiceStub
from src.utils.parsing import get_arguments

GITLAB_URL = "https://gitlab.com"
TARGET = "localhost:50050"


def setup_webhook():
    args = get_arguments({"projectId", "identifier", "auth"})
    target = args["target"] if args.keys().__contains__("target") else TARGET

    try:
        credentials = json.loads(args["auth"])
        client = gitlab.Gitlab(GITLAB_URL, oauth_token=credentials["access_token"])
        client.auth()

        project = client.projects.get(args["projectId"])
        hooks = project.hooks.list()

        for hook in hooks:
            if hook.url == os.environ["GITLAB_WEBHOOK_URL"]:
                return

        webhook = project.hooks.create({
            'url': os.environ["GITLAB_WEBHOOK_URL"],
            'token': os.environ["GITLAB_WEBHOOK_SECRET"],
            'push_events': True,
            'issues_events': True,
            'merge_requests_events': True,
        })

        print(f"Webhook created. ID: {webhook.id}, URL: {webhook.url}")
        print(webhook)

    except GitlabAuthenticationError as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(e.error_message), isAuthError=True))
        raise e
    except Exception as e:
        with grpc.insecure_channel(target) as channel:
            AreaBackServiceStub(channel).OnError(
                JobError(identifier=args["identifier"], error=str(sys.exc_info()[0]), isAuthError=False))
        raise e
