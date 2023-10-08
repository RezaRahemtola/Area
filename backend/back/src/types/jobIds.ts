import { JobsParams, JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams["mappings"][key]) => string;
};

export const JobsIdentifiers: JobsIdentifiers = {
	"seconds-interval": ({ workflowStepId }) => `seconds-interval-${workflowStepId}`,
	"google-send-email": ({ workflowStepId }) => `google-send-email-${workflowStepId}`,
	"github-on-push": ({ workflowStepId }) => `github-on-push-${workflowStepId}`,
	"github-commit": ({ workflowStepId }) => `github-commit-${workflowStepId}`,
};
