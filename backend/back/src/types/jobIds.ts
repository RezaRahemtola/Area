import { JobsParams, JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams["mappings"][key]) => string;
};

export const JobsIdentifiers: JobsIdentifiers = {
	"timer-seconds-interval": ({ workflowStepId }) => `timer-seconds-interval-${workflowStepId}`,
	"google-send-email": ({ workflowStepId }) => `google-send-email-${workflowStepId}`,
	"google-create-draft-email": ({ workflowStepId }) => `google-create-draft-email-${workflowStepId}`,
	"google-update-signature-email": ({ workflowStepId }) => `google-update-signature-email-${workflowStepId}`,
	"google-create-comment-youtube": ({ workflowStepId }) => `google-create-comment-youtube-${workflowStepId}`,
	"google-create-document-docs": ({ workflowStepId }) => `google-create-document-docs-${workflowStepId}`,
	"google-create-presentation-slides": ({ workflowStepId }) => `google-create-presentation-slides-${workflowStepId}`,
	"google-create-spreadsheet": ({ workflowStepId }) => `google-create-spreadsheet-${workflowStepId}`,
};
