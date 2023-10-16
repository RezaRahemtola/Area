import dotenv
import sys

from src.gmail.send_email import send_email
from src.gmail.create_draft import create_draft
from src.gmail.update_signature import update_signature

from src.youtube.create_comment import create_comment

from src.docs.create_document import create_document


dotenv.load_dotenv()

def main():
    if len(sys.argv) < 2:
        print("Error: No job specified")
        exit(1)

    match sys.argv[1]:
        # GMail
        case "send-email":
            send_email()
        case "create-draft-email":
            create_draft()
        case "update-signature-email":
            update_signature()

        # YouTube
        case "create-comment-youtube":
            create_comment()

        # Docs
        case "create-document-docs":
            create_document()

        case _:
            print("Error: Invalid job")
            exit(1)

if __name__ == '__main__':
    main()
