import os

from google.oauth2.credentials import Credentials


def forge_credentials(refresh_token: str, scopes: list[str]):
    creds = Credentials.from_authorized_user_info(info={
        "refresh_token": refresh_token,
        "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
    }, scopes=scopes)
    return creds
