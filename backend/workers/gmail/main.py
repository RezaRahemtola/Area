import dotenv
import sys

from src.send_email import send_email
from src.create_draft import create_draft

dotenv.load_dotenv()


def main():
    if len(sys.argv) < 2:
        print("Error: No job specified")
        exit(1)

    match sys.argv[1]:
        case "send-email":
            send_email()
        case "create-draft-email":
            create_draft()
        case _:
            print("Error: Invalid job")
            exit(1)

if __name__ == '__main__':
    main()
