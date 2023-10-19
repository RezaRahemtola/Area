import {
	GoogleCreateContactParams,
	GoogleCreateDocumentParams,
	GoogleEmailParams,
	GoogleEmailSignatureUpdateParams,
	GoogleYoutubeCreateCommentParams,
	LinkedinCreatePostParams,
	TimerSecondIntervalParams,
} from "./jobParams";

export enum Jobs {
	"timer-seconds-interval" = "timer-seconds-interval",
	"google-send-email" = "google-send-email",
	"google-create-draft-email" = "google-create-draft-email",
	"google-update-signature-email" = "google-update-signature-email",
	"google-create-comment-youtube" = "google-create-comment-youtube",
	"google-create-document-docs" = "google-create-document-docs",
	"google-create-presentation-slides" = "google-create-presentation-slides",
	"google-create-spreadsheet" = "google-create-spreadsheet",
	"google-create-form" = "google-create-form",
	"google-create-contact" = "google-create-contact",
	"linkedin-create-post" = "linkedin-create-post",
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
	"google-create-document-docs": GoogleCreateDocumentParams,
	"google-create-presentation-slides": GoogleCreateDocumentParams,
	"google-create-spreadsheet": GoogleCreateDocumentParams,
	"google-create-form": GoogleCreateDocumentParams,
	"google-create-contact": GoogleCreateContactParams,
	"linkedin-create-post": LinkedinCreatePostParams,
};

export type JobsParams = Mapper<{
	"timer-seconds-interval": TimerSecondIntervalParams;
	"google-send-email": GoogleEmailParams;
	"google-create-draft-email": GoogleEmailParams;
	"google-update-signature-email": GoogleEmailSignatureUpdateParams;
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams;
	"google-create-document-docs": GoogleCreateDocumentParams;
	"google-create-presentation-slides": GoogleCreateDocumentParams;
	"google-create-spreadsheet": GoogleCreateDocumentParams;
	"google-create-form": GoogleCreateDocumentParams;
	"google-create-contact": GoogleCreateContactParams;
	"linkedin-create-post": LinkedinCreatePostParams;
}>;
