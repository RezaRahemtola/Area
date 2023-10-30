import {
	GithubCloseIssueParams,
	GithubCreateIssueParams,
	GithubReopenIssueParams,
	GithubRepositoryActionParams,
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
	LinkedinCreatePostParams,
	NameParams,
	TimerSecondIntervalParams,
	TitleParams,
	YoutubeChannelParams,
} from "./jobParams";

export enum Jobs {
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
	"linkedin-create-post" = "linkedin-create-post",
	"timer-seconds-interval" = "timer-seconds-interval",
}

export type JobsType = keyof typeof Jobs;

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export const JobParamsClasses = {
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
	"linkedin-create-post": LinkedinCreatePostParams,
	"timer-seconds-interval": TimerSecondIntervalParams,
};

export type JobsParams = Mapper<{
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
	"linkedin-create-post": LinkedinCreatePostParams;
	"timer-seconds-interval": TimerSecondIntervalParams;
}>;
