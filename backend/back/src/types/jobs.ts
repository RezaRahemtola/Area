import {
	AirtableDeleteRecordParams,
	EmailParams,
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
	OwnerJobParams,
	RiotActionsParams,
	SlackCreateMessageParams,
	TimerSecondIntervalParams,
	TitleParams,
	TodoistCreateTaskParams,
	TodoistTaskParams,
	TodoistUpdateTaskParams,
	TwitterCreateTweetParams,
	UniqueJobParams,
	WorkflowToggleParams,
	YoutubeChannelParams,
} from "./jobParams";

export const JobParamsClasses = {
	"airtable-delete-record": AirtableDeleteRecordParams,
	"area-disable-workflow": WorkflowToggleParams,
	"area-enable-workflow": WorkflowToggleParams,
	"area-on-account-connect": OwnerJobParams,
	"area-on-action": OwnerJobParams,
	"area-on-workflow-create": OwnerJobParams,
	"area-on-workflow-toggle": OwnerJobParams,
	"discord-on-guild-join": UniqueJobParams,
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
	"google-create-draft-email": EmailParams,
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
	"google-send-email": EmailParams,
	"google-update-spreadsheet-title": GoogleFormUpdateSpreadsheetTitleParams,
	"google-update-signature-email": GoogleEmailSignatureUpdateParams,
	"linear-create-issue": LinearCreateIssueParams,
	"linear-on-issue-create": LinearWorkspaceParams,
	"linkedin-create-post": LinkedinCreatePostParams,
	"microsoft-outlook-send-email": EmailParams,
	"miro-create-board": MiroCreateBoardParams,
	"riot-lol-on-game-end": RiotActionsParams,
	"riot-lol-on-game-loss": RiotActionsParams,
	"riot-lol-on-game-win": RiotActionsParams,
	"riot-lol-on-level-up": RiotActionsParams,
	"slack-create-message": SlackCreateMessageParams,
	"timer-seconds-interval": TimerSecondIntervalParams,
	"todoist-close-task": TodoistTaskParams,
	"todoist-create-task": TodoistCreateTaskParams,
	"todoist-delete-task": TodoistTaskParams,
	"todoist-reopen-task": TodoistTaskParams,
	"todoist-update-task": TodoistUpdateTaskParams,
	"twitter-create-tweet": TwitterCreateTweetParams,
};

type JobParamsClassesType = typeof JobParamsClasses;
export type JobsParams = {
	[key in keyof JobParamsClassesType]: InstanceType<JobParamsClassesType[key]>;
};
export type JobsType = keyof JobsParams;
