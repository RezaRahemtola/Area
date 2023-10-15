import dotenv
import sys

from src.create_comment import create_comment

dotenv.load_dotenv()


def main():
    if len(sys.argv) < 2:
        print("Error: No job specified")
        exit(1)

    match sys.argv[1]:
        case "create-comment-youtube":
            create_comment()
        case _:
            print("Error: Invalid job")
            exit(1)

if __name__ == '__main__':
    main()
