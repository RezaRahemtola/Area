from __future__ import print_function

import base64
from email.message import EmailMessage

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/gmail.compose']
TARGET = "localhost:50050"

def create_draft():
    args = {}
    for i in range(2, len(sys.argv)):
        if sys.argv[i].startswith("--"):
            if not sys.argv[i + 1]:
                print(F"Error: No value specified for {sys.argv[i]}")
                exit(1)
            args[sys.argv[i][2:]] = sys.argv[i + 1]
            i += 1

    keys_needed = {"auth", "to", "subject", "body", "workflowStepId"}
    missing = keys_needed.difference(args.keys())
    if missing:
        print(F"Error: Missing required keys: {missing}")
        exit(1)

    credentials = json.loads(args["auth"])

    creds = Credentials.from_authorized_user_info(info={
        "refresh_token": credentials["refresh_token"],
        "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
    }, scopes=SCOPES)

     try:
        service = build('gmail', 'v1', credentials=creds)
        message = EmailMessage()
        message.set_content(args["body"])

        message['To'] = args["to"]
        message['Subject'] = args["subject"]

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {
            'raw': encoded_message
        }
        draft = service.users().drafts().create(userId="me",
                                                body=create_message).execute()

        target = args["target"] if args.keys().__contains__("target") else TARGET

        with grpc.insecure_channel(target) as channel:
            params = Struct()
            params.update({
                "workflowStepId": args["workflowStepId"],
                "emailId": draft["id"]
            })
            AreaBackServiceStub(channel).OnReaction(JobData(name="gmail", identifier="google-create-draft-email", params=params))

    except HttpError as error:
        print(F'An error occurred: {error}')
        draft = None
