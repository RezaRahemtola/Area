import {
	AirtableDeleteRecordParams,
	FacebookPageParams,
	GithubCloseIssueParams,
	GithubCreateIssueParams,
	GithubReopenIssueParams,
	GithubRepositoryActionParams,
	GitlabRepositoryActionParams,
	GoogleAddFormYoutubeItemParams,
	GoogleChangeGmailLanguageParams,
	GoogleCreateContactParams,
	GoogleCreateCourseParams,
	GoogleCreateSlideOnPresentationParams,
	GoogleDuplicateDriveFileParams,
	GoogleEmailParams,
	GoogleEmailSignatureUpdateParams,
	GoogleFormConvertToQuizParams,
	GoogleFormUpdateDescriptionParams,
	GoogleFormUpdateSpreadsheetTitleParams,
	GoogleYoutubeCreateCommentParams,
	LinearCreateIssueParams,
	LinearWorkspaceParams,
	LinkedinCreatePostParams,
	MiroCreateBoardParams,
	NameParams,
	RiotActionsParams,
	TimerSecondIntervalParams,
	TitleParams,
	TodoistCreateTaskParams,
	YoutubeChannelParams,
} from "./jobParams";

export enum Jobs {
	"airtable-delete-record" = "airtable-delete-record",
	"facebook-on-status-create" = "facebook-on-status-create",
	"github-close-issue" = "github-close-issue",
	"github-create-issue" = "github-create-issue",
	"github-reopen-issue" = "github-reopen-issue",
	"github-on-commit" = "github-on-commit",
	"github-on-issue-close" = "github-on-issue-close",
	"github-on-issue-create" = "github-on-issue-create",
	"github-on-issue-reopen" = "github-on-issue-reopen",
	"github-on-pull-request-close" = "github-on-pull-request-close",
	"github-on-pull-request-create" = "github-on-pull-request-create",
	"github-on-pull-request-merge" = "github-on-pull-request-merge",
	"gitlab-on-commit" = "gitlab-on-commit",
	"gitlab-on-pull-request-close" = "gitlab-on-pull-request-close",
	"gitlab-on-pull-request-create" = "gitlab-on-pull-request-create",
	"gitlab-on-pull-request-merge" = "gitlab-on-pull-request-merge",
	"gitlab-on-pull-request-reopen" = "gitlab-on-pull-request-reopen",
	"google-create-comment-youtube" = "google-create-comment-youtube",
	"google-create-contact" = "google-create-contact",
	"google-create-course" = "google-create-course",
	"google-change-gmail-interface-language" = "google-change-gmail-interface-language",
	"google-create-calendar" = "google-create-calendar",
	"google-create-document-docs" = "google-create-document-docs",
	"google-create-draft-email" = "google-create-draft-email",
	"google-create-drive-folder" = "google-create-drive-folder",
	"google-create-form" = "google-create-form",
	"google-create-presentation" = "google-create-presentation",
	"google-create-shared-drive" = "google-create-shared-drive",
	"google-create-slide-on-presentation" = "google-create-slide-on-presentation",
	"google-create-spreadsheet" = "google-create-spreadsheet",
	"google-create-task-list" = "google-create-task-list",
	"google-duplicate-drive-file" = "google-duplicate-drive-file",
	"google-form-add-youtube-item" = "google-form-add-youtube-item",
	"google-form-convert-to-quiz" = "google-form-convert-to-quiz",
	"google-form-update-description" = "google-form-update-description",
	"google-on-new-video" = "google-on-new-video",
	"google-send-email" = "google-send-email",
	"google-update-spreadsheet-title" = "google-update-spreadsheet-title",
	"google-update-signature-email" = "google-update-signature-email",
	"linear-create-issue" = "linear-create-issue",
	"linear-on-issue-create" = "linear-on-issue-create",
	"linkedin-create-post" = "linkedin-create-post",
	"miro-create-board" = "miro-create-board",
	"riot-lol-on-game-end" = "riot-lol-on-game-end",
	"riot-lol-on-game-loss" = "riot-lol-on-game-loss",
	"riot-lol-on-game-win" = "riot-lol-on-game-win",
	"riot-lol-on-level-up" = "riot-lol-on-level-up",
	"timer-seconds-interval" = "timer-seconds-interval",
	"todoist-create-task" = "todoist-create-task",
}

export type JobsType = keyof typeof Jobs;

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export const JobParamsClasses = {
	"airtable-delete-record": AirtableDeleteRecordParams,
	"facebook-on-status-create": FacebookPageParams,
	"github-close-issue": GithubCloseIssueParams,
	"github-create-issue": GithubCreateIssueParams,
	"github-reopen-issue": GithubReopenIssueParams,
	"github-on-commit": GithubRepositoryActionParams,
	"github-on-issue-close": GithubRepositoryActionParams,
	"github-on-issue-create": GithubRepositoryActionParams,
	"github-on-issue-reopen": GithubRepositoryActionParams,
	"github-on-pull-request-close": GithubRepositoryActionParams,
	"github-on-pull-request-create": GithubRepositoryActionParams,
	"github-on-pull-request-merge": GithubRepositoryActionParams,
	"gitlab-on-commit": GitlabRepositoryActionParams,
	"gitlab-on-pull-request-close": GitlabRepositoryActionParams,
	"gitlab-on-pull-request-create": GitlabRepositoryActionParams,
	"gitlab-on-pull-request-merge": GitlabRepositoryActionParams,
	"gitlab-on-pull-request-reopen": GitlabRepositoryActionParams,
	"google-change-gmail-interface-language": GoogleChangeGmailLanguageParams,
	"google-create-calendar": TitleParams,
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams,
	"google-create-contact": GoogleCreateContactParams,
	"google-create-course": GoogleCreateCourseParams,
	"google-create-document-docs": NameParams,
	"google-create-draft-email": GoogleEmailParams,
	"google-create-drive-folder": NameParams,
	"google-create-form": NameParams,
	"google-create-presentation": NameParams,
	"google-create-shared-drive": NameParams,
	"google-create-slide-on-presentation": GoogleCreateSlideOnPresentationParams,
	"google-create-spreadsheet": NameParams,
	"google-create-task-list": TitleParams,
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams,
	"google-form-convert-to-quiz": GoogleFormConvertToQuizParams,
	"google-form-update-description": GoogleFormUpdateDescriptionParams,
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams,
	"google-on-new-video": YoutubeChannelParams,
	"google-send-email": GoogleEmailParams,
	"google-update-spreadsheet-title": GoogleFormUpdateSpreadsheetTitleParams,
	"google-update-signature-email": GoogleEmailSignatureUpdateParams,
	"linear-create-issue": LinearCreateIssueParams,
	"linear-on-issue-create": LinearWorkspaceParams,
	"linkedin-create-post": LinkedinCreatePostParams,
	"miro-create-board": MiroCreateBoardParams,
	"riot-lol-on-game-end": RiotActionsParams,
	"riot-lol-on-game-loss": RiotActionsParams,
	"riot-lol-on-game-win": RiotActionsParams,
	"riot-lol-on-level-up": RiotActionsParams,
	"timer-seconds-interval": TimerSecondIntervalParams,
	"todoist-create-task": TodoistCreateTaskParams,
};

export type JobsParams = Mapper<{
	"airtable-delete-record": AirtableDeleteRecordParams;
	"facebook-on-status-create": FacebookPageParams;
	"github-close-issue": GithubCloseIssueParams;
	"github-create-issue": GithubCreateIssueParams;
	"github-reopen-issue": GithubReopenIssueParams;
	"github-on-commit": GithubRepositoryActionParams;
	"github-on-issue-close": GithubRepositoryActionParams;
	"github-on-issue-create": GithubRepositoryActionParams;
	"github-on-issue-reopen": GithubRepositoryActionParams;
	"github-on-pull-request-close": GithubRepositoryActionParams;
	"github-on-pull-request-create": GithubRepositoryActionParams;
	"github-on-pull-request-merge": GithubRepositoryActionParams;
	"gitlab-on-commit": GitlabRepositoryActionParams;
	"gitlab-on-pull-request-close": GitlabRepositoryActionParams;
	"gitlab-on-pull-request-create": GitlabRepositoryActionParams;
	"gitlab-on-pull-request-merge": GitlabRepositoryActionParams;
	"gitlab-on-pull-request-reopen": GitlabRepositoryActionParams;
	"google-change-gmail-interface-language": GoogleChangeGmailLanguageParams;
	"google-create-calendar": TitleParams;
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams;
	"google-create-contact": GoogleCreateContactParams;
	"google-create-course": GoogleCreateCourseParams;
	"google-create-document-docs": NameParams;
	"google-create-draft-email": GoogleEmailParams;
	"google-create-drive-folder": NameParams;
	"google-create-form": NameParams;
	"google-create-presentation": NameParams;
	"google-create-shared-drive": NameParams;
	"google-create-slide-on-presentation": GoogleCreateSlideOnPresentationParams;
	"google-create-spreadsheet": NameParams;
	"google-create-task-list": TitleParams;
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams;
	"google-form-convert-to-quiz": GoogleFormConvertToQuizParams;
	"google-form-update-description": GoogleFormUpdateDescriptionParams;
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams;
	"google-on-new-video": YoutubeChannelParams;
	"google-send-email": GoogleEmailParams;
	"google-update-spreadsheet-title": GoogleFormUpdateSpreadsheetTitleParams;
	"google-update-signature-email": GoogleEmailSignatureUpdateParams;
	"linear-create-issue": LinearCreateIssueParams;
	"linear-on-issue-create": LinearWorkspaceParams;
	"linkedin-create-post": LinkedinCreatePostParams;
	"miro-create-board": MiroCreateBoardParams;
	"riot-lol-on-game-end": RiotActionsParams;
	"riot-lol-on-game-loss": RiotActionsParams;
	"riot-lol-on-game-win": RiotActionsParams;
	"riot-lol-on-level-up": RiotActionsParams;
	"timer-seconds-interval": TimerSecondIntervalParams;
	"todoist-create-task": TodoistCreateTaskParams;
}>;
