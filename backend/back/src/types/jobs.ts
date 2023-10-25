import {
	GithubCreateIssueParams,
	GithubRepositoryActionParams,
	GoogleAddFormYoutubeItemParams,
	GoogleCreateContactParams,
	GoogleCreateCourseParams,
	GoogleCreateSlideOnPresentationParams,
	GoogleDuplicateDriveFileParams,
	GoogleEmailParams,
	GoogleEmailSignatureUpdateParams,
	GoogleYoutubeCreateCommentParams,
	LinkedinCreatePostParams,
	NameParams,
	TimerSecondIntervalParams,
	TitleParams,
} from "./jobParams";

export enum Jobs {
	"github-create-issue" = "github-create-issue",
	"github-on-issue-create" = "github-on-issue-create",
	"google-create-comment-youtube" = "google-create-comment-youtube",
	"google-create-contact" = "google-create-contact",
	"google-create-course" = "google-create-course",
	"google-create-calendar" = "google-create-calendar",
	"google-create-document-docs" = "google-create-document-docs",
	"google-create-draft-email" = "google-create-draft-email",
	"google-create-drive-folder" = "google-create-drive-folder",
	"google-create-form" = "google-create-form",
	"google-create-presentation" = "google-create-presentation",
	"google-create-slide-on-presentation" = "google-create-slide-on-presentation",
	"google-create-spreadsheet" = "google-create-spreadsheet",
	"google-create-task-list" = "google-create-task-list",
	"google-duplicate-drive-file" = "google-duplicate-drive-file",
	"google-form-add-youtube-item" = "google-form-add-youtube-item",
	"google-send-email" = "google-send-email",
	"google-update-signature-email" = "google-update-signature-email",
	"linkedin-create-post" = "linkedin-create-post",
	"timer-seconds-interval" = "timer-seconds-interval",
}

export type JobsType = keyof typeof Jobs;

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export const JobParamsClasses = {
	"github-create-issue": GithubCreateIssueParams,
	"github-on-issue-create": GithubRepositoryActionParams,
	"google-create-calendar": TitleParams,
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams,
	"google-create-contact": GoogleCreateContactParams,
	"google-create-course": GoogleCreateCourseParams,
	"google-create-document-docs": NameParams,
	"google-create-draft-email": GoogleEmailParams,
	"google-create-drive-folder": NameParams,
	"google-create-form": NameParams,
	"google-create-presentation": NameParams,
	"google-create-slide-on-presentation": GoogleCreateSlideOnPresentationParams,
	"google-create-spreadsheet": NameParams,
	"google-create-task-list": TitleParams,
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams,
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams,
	"google-send-email": GoogleEmailParams,
	"google-update-signature-email": GoogleEmailSignatureUpdateParams,
	"linkedin-create-post": LinkedinCreatePostParams,
	"timer-seconds-interval": TimerSecondIntervalParams,
};

export type JobsParams = Mapper<{
	"google-create-calendar": TitleParams;
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams;
	"google-create-contact": GoogleCreateContactParams;
	"google-create-course": GoogleCreateCourseParams;
	"google-create-document-docs": NameParams;
	"google-create-draft-email": GoogleEmailParams;
	"google-create-drive-folder": NameParams;
	"google-create-form": NameParams;
	"google-create-presentation": NameParams;
	"google-create-slide-on-presentation": GoogleCreateSlideOnPresentationParams;
	"google-create-spreadsheet": NameParams;
	"google-create-task-list": TitleParams;
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams;
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams;
	"google-send-email": GoogleEmailParams;
	"google-update-signature-email": GoogleEmailSignatureUpdateParams;
	"github-create-issue": GithubCreateIssueParams;
	"github-on-issue-create": GithubRepositoryActionParams;
	"linkedin-create-post": LinkedinCreatePostParams;
	"timer-seconds-interval": TimerSecondIntervalParams;
}>;
