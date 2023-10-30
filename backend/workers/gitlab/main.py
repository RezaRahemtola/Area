import dotenv
import sys

from src.webhooks.setup import setup_webhook

dotenv.load_dotenv()


def main():
    if len(sys.argv) < 2:
        print("Error: No job specified")
        exit(1)
    match sys.argv[1]:
        case "setup-webhook":
            setup_webhook()

        case _:
            print("Error: Invalid job")
            exit(1)


if __name__ == '__main__':
    main()
