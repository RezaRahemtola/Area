import dotenv
import sys

from src.send_email import send_email

dotenv.load_dotenv()


def main():
    if len(sys.argv) < 1:
        print("Error: No job specified")
        exit(1)

    match sys.argv[1]:
        case "send-email":
            send_email()
        case _:
            print("Error: Invalid job")
            exit(1)

if __name__ == '__main__':
    main()
