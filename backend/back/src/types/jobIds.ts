import { JobsParams } from "./jobParams";
import { JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams["mappings"][key]) => string;
};

export const JobsIdentifiers: JobsIdentifiers = {
	"seconds-interval": ({ workflowStepId }) => `seconds-interval-${workflowStepId}`,
};
