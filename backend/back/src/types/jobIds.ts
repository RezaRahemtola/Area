import { JobsParams, JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams["mappings"][key]) => string;
};

export const JobsIdentifiers: JobsIdentifiers = {
	"timer-seconds-interval": ({ workflowStepId }) => `timer-seconds-interval-${workflowStepId}`,
	"google-send-email": ({ workflowStepId }) => `google-send-email-${workflowStepId}`,
};
