import dotenv
import sys

from src.calendar.create_calendar import create_calendar
from src.classrooms.create_course import create_course
from src.contacts.create_contact import create_contact
from src.forms.create_form import create_form
from src.gmail.send_email import send_email
from src.gmail.create_draft import create_draft
from src.gmail.update_signature import update_signature
from src.tasks.create_task_list import create_task_list
from src.youtube.create_comment import create_comment
from src.docs.create_document import create_document
from src.slides.create_slide import create_slide
from src.spreadsheets.create_spreadsheet import create_spreadsheet


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

        # Slides
        case "create-presentation-slides":
            create_slide()

        # Spreadsheets
        case "create-spreadsheet":
            create_spreadsheet()

        # Forms
        case "create-form":
            create_form()

        # Contacts
        case "create-contact":
            create_contact()

        # Tasks
        case "create-task-list":
            create_task_list()

        # Classrooms
        case "create-course":
            create_course()

        # Calendar
        case "create-calendar":
            create_calendar()

        case _:
            print("Error: Invalid job")
            exit(1)

if __name__ == '__main__':
    main()
