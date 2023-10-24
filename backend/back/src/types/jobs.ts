import {
	GithubCreateIssueParams,
	GoogleAddFormYoutubeItemParams,
	GoogleCreateContactParams,
	GoogleCreateCourseParams,
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
	"timer-seconds-interval" = "timer-seconds-interval",
	"google-send-email" = "google-send-email",
	"google-create-draft-email" = "google-create-draft-email",
	"google-update-signature-email" = "google-update-signature-email",
	"google-create-comment-youtube" = "google-create-comment-youtube",
	"google-create-document-docs" = "google-create-document-docs",
	"google-create-presentation" = "google-create-presentation",
	"google-create-spreadsheet" = "google-create-spreadsheet",
	"google-create-form" = "google-create-form",
	"google-create-contact" = "google-create-contact",
	"linkedin-create-post" = "linkedin-create-post",
	"google-create-task-list" = "google-create-task-list",
	"google-create-course" = "google-create-course",
	"google-create-calendar" = "google-create-calendar",
	"google-create-drive-folder" = "google-create-drive-folder",
	"google-duplicate-drive-file" = "google-duplicate-drive-file",
	"google-form-add-youtube-item" = "google-form-add-youtube-item",
	"github-create-issue" = "github-create-issue",
}

export type JobsType = keyof typeof Jobs;

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export const JobParamsClasses = {
	"timer-seconds-interval": TimerSecondIntervalParams,
	"google-send-email": GoogleEmailParams,
	"google-create-draft-email": GoogleEmailParams,
	"google-update-signature-email": GoogleEmailSignatureUpdateParams,
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams,
	"google-create-document-docs": NameParams,
	"google-create-presentation": NameParams,
	"google-create-spreadsheet": NameParams,
	"google-create-form": NameParams,
	"google-create-contact": GoogleCreateContactParams,
	"linkedin-create-post": LinkedinCreatePostParams,
	"google-create-task-list": TitleParams,
	"google-create-course": GoogleCreateCourseParams,
	"google-create-calendar": TitleParams,
	"google-create-drive-folder": NameParams,
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams,
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams,
	"github-create-issue": GithubCreateIssueParams,
};

export type JobsParams = Mapper<{
	"timer-seconds-interval": TimerSecondIntervalParams;
	"google-send-email": GoogleEmailParams;
	"google-create-draft-email": GoogleEmailParams;
	"google-update-signature-email": GoogleEmailSignatureUpdateParams;
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams;
	"google-create-document-docs": NameParams;
	"google-create-presentation": NameParams;
	"google-create-spreadsheet": NameParams;
	"google-create-form": NameParams;
	"google-create-contact": GoogleCreateContactParams;
	"linkedin-create-post": LinkedinCreatePostParams;
	"google-create-task-list": TitleParams;
	"google-create-course": GoogleCreateCourseParams;
	"google-create-calendar": TitleParams;
	"google-create-drive-folder": NameParams;
	"google-duplicate-drive-file": GoogleDuplicateDriveFileParams;
	"google-form-add-youtube-item": GoogleAddFormYoutubeItemParams;
	"github-create-issue": GithubCreateIssueParams;
}>;
