const translations = {
	auth: {
		login: {
			title: "Login",
			action: "Login",
			switchMethodCta: "Don't have an account yet? ",
			switchMethodAction: "Create one",
		},
		register: {
			title: "Register",
			action: "Register",
			switchMethodCta: "Already have an account? ",
			switchMethodAction: "Login",
			errors: {
				passwordsNotMatching: "Passwords don't match",
			},
		},
		fields: {
			email: "Email",
			password: "Password",
			passwordPlaceholder: "Enter password",
		},
		callbackOAuth: "Authentication successful, you can now close this page!",
	},
	dashboard: {
		title: "Dashboard",
		menu: {
			editor: "Create workflow",
			dashboard: "Dashboard",
			library: "Library",
			services: "Services",
		},
	},
	editor: {
		action: {
			title: "Action",
			description: "An event that starts your workflow",
		},
		reaction: {
			title: "Reaction",
			description: "An event a workflow performs after it start",
		},
		chooseEvent: "Choose an event",
		noAccountToConnect: "No account to connect",
		accountAlreadyConnected: "Account already connected",
		parameters: "Parameters",
		connectAccount: "Connect your account",
		back: "Back",
		next: "Next",
		returnParameters: "The following data is returned by this area and can be used in the next one:",
	},
	library: {
		title: "My workflows",
		emptyState: {
			title: "You don't have any workflow",
			action: "Create one",
		},
		actions: {
			rename: {
				title: "Rename workflow",
				newName: "New name",
				successMessage: "Workflow successfully renamed!",
			},
		},
	},
	user: {
		settings: {
			title: "User settings",
			email: "Email",
			theme: "Theme",
			language: "Language",
			updateSuccessMessage: "Settings successfully updated!",
		},
		menu: {
			settings: "Settings",
			logout: "Logout",
		},
	},
	services: {
		title: "Services",
		actions: "Actions",
		reactions: "Reactions",
		noArea: "This service doesn't have any action or reaction",
	},
	landing: {
		actions: {
			downloadApk: " Download APK",
		},
	},
	actions: {
		rename: "Rename",
		delete: "Delete",
		save: "Save",
		close: "Close",
		edit: "Edit",
		duplicate: "Duplicate",
		copy: "Copy",
	},
	areaTranslations: {
		on_new_video: "On new video",
    on_new_video_sub: "Triggers when an video is uploaded on a Youtube channel",

    create_draft_email: "create draft email",
    update_signature_email: "update signature email",
    create_comment_youtube: "create comment youtube",
    create_document_docs: "create document docs",
    create_presentation: "create presentation",
    create_spreadsheet: "create spreadsheet",
    create_form: "create form",
    create_contact: "create contact",
    create_task_list: "create task list",
    create_course: "create course",
    create_calendar: "create calendar",
    create_drive_folder: "create drive folder",
    duplicate_drive_file: "duplicate drive file",
    form_add_youtube_item: "form add youtube item",
    create_slide_on_presentation: "create slide on presentation",
    create_shared_drive: "create shared drive",
    change_gmail_interface_language: "change gmail interface language",
    form_update_description: "form update description",
    form_convert_to_quiz: "form convert to quiz",
    update_spreadsheet_title: "update spreadsheet title",

    create_draft_email_sub: "Create a draft email with Gmail",
    update_signature_email_sub: "Update the signature of your Gmail account",
    create_comment_youtube_sub: "Post a comment on a YouTube video",
    create_document_docs_sub: "Create a new Google Docs",
    create_presentation_sub: "Create a new Google Slides",
    create_spreadsheet_sub: "Create a new Google Spreadsheet",
    create_form_sub: "Create a new Google Forms",
    create_contact_sub: "Create a new Google Contact",
    create_task_list_sub: "Create a new Google Task list",
    create_course_sub: "Create a new Google Classroom course",
    create_calendar_sub: "Create a new Google Calendar",
    create_drive_folder_sub: "Create a new Google Drive folder",
    duplicate_drive_file_sub: "Duplicate a file in Google Drive",
    form_add_youtube_item_sub: "Add a YouTube item in a Google Form",
    create_slide_on_presentation_sub: "Add a slide on a Google presentation",
    create_shared_drive_sub: "Create a Google shared drive",
    change_gmail_interface_language_sub: "Change the language of the GMail interface",
    form_update_description_sub: "Update the description of a Google Form",
    form_convert_to_quiz_sub: "Convert a Google Form to a graded quiz",
    update_spreadsheet_title_sub: "Update a Google Spreadsheet title",

    create_post: "Creates a post",
    create_post_sub: "Creates a new LinkedIn post",


    on_issue_reopen: "on issue reopen",
    on_issue_reopen_sub: "Triggers when an issue is reopened on a Github repository",
    on_issue_close: "on issue close",
    on_issue_close_sub: "Triggers when an issue is closed on a Github repository",

    create_issue: "create issue",
    create_issue_sub: "Creates an issue on a project",
    reopen_issue: "reopen issue",
    reopen_issue_sub: "Reopen an issue on a Github repository",
    close_issue: "close issue",
    close_issue_sub: "Close an issue on a Github repository",

    seconds_interval: "Seconds interval",
    seconds_interval_sub: "Trigger every X seconds",

    on_issue_create: "On issue create",
    on_issue_create_sub: "Triggers when an issue is created on a project",

    on_commit: "on commit",
    on_commit_sub: "Triggers when an commit is pushed on a project",
    on_pull_request_close: "on pull request close",
    on_pull_request_close_sub: "Triggers when a merge request is closed on a project",
    on_pull_request_create: "on pull request create",
    on_pull_request_create_sub: "Triggers when a merge request is created on a project",
    on_pull_request_merge: "on pull request merge",
    on_pull_request_merge_sub: "Triggers when a merge request is merged on a project",
    on_pull_request_reopen: "on pull request reopen",
    on_pull_request_reopen_sub: "Triggers when a merge request is merged on a project",

    on_status_create: "On status created",
    on_status_create_sub: "Triggers when the status of a Facebook page is updated",

    create_board: "Create a board",
    create_board_sub: "Creates a new board",
    
    lol_on_game_end: "On game end",
    lol_on_game_end_sub: "Triggers when a player ends a LoL match",
    lol_on_game_loss: "On game loss",
    lol_on_game_loss_sub: "Triggers when a player lost a LoL match",
    lol_on_game_win: "On game win",
    lol_on_game_win_sub: "Triggers when a player won a LoL match",
    lol_on_level_up: "On level up",
    lol_on_level_up_sub: "Triggers when a LoL summoner levels up",

    create_task: "create task",
    create_task_sub: "Create a task on Todoist",
    reopen_task: "reopen task",
    reopen_task_sub: "Reopen a task on Todoist",
    close_task: "close task",
    close_task_sub: "Close a task on Todoist",
    update_task: "update task",
    update_task_sub: "Update a task on Todoist",
    delete_task: "delete task",
    delete_task_sub: "Delete a task on Todoist",

    delete_record: "Delete record",
    delete_record_sub: "Delete a record from an Airtable base table",

    create_tweet: "Post a tweet",
    create_tweet_sub: "Post a tweet on Twitter (X)",

    send_email: "Send email",
    send_email_sub: "Send an email",

    create_message: "Post message",
    create_message_sub: "Post a message on a Slack channel",

    on_guild_join: "On guild join",
    on_guild_join_sub: "Fired when the user join a guild on discord.",

    on_action: "on action",
    on_action_sub: "Triggers when a workflow's action is triggered",
    on_account_connect: "on account connect",
    on_account_connect_sub: "Triggers when a new OAuth account is connected",
    on_workflow_create: "on workflow create",
    on_workflow_create_sub: "Triggers when a new workflow is created",
    on_workflow_toggle: "on workflow toggle",
    on_workflow_toggle_sub: "Triggers when a workflow is enabled",
    disable_workflow: "disable workflow",
    disable_workflow_sub: "Disable a workflow",
    enable_workflow: "enable workflow",
    enable_workflow_sub: "Enable a workflow"
	},
};

export default translations;
