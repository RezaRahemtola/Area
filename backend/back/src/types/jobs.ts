import {
	GoogleDocsCreateDocumentParams,
	GoogleEmailParams,
	GoogleEmailSignatureUpdateParams,
	GoogleYoutubeCreateCommentParams,
	TimerSecondIntervalParams,
} from "./jobParams";

export enum Jobs {
	"timer-seconds-interval" = "timer-seconds-interval",
	"google-send-email" = "google-send-email",
	"google-create-draft-email" = "google-create-draft-email",
	"google-update-signature-email" = "google-update-signature-email",
	"google-create-comment-youtube" = "google-create-comment-youtube",
	"google-create-document-docs" = "google-create-document-docs",
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
	"google-create-document-docs": GoogleDocsCreateDocumentParams,
};

export type JobsParams = Mapper<{
	"timer-seconds-interval": TimerSecondIntervalParams;
	"google-send-email": GoogleEmailParams;
	"google-create-draft-email": GoogleEmailParams;
	"google-update-signature-email": GoogleEmailSignatureUpdateParams;
	"google-create-comment-youtube": GoogleYoutubeCreateCommentParams;
	"google-create-document-docs": GoogleDocsCreateDocumentParams;
}>;
