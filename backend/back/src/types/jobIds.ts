import { JobsParams } from "./jobParams";
import { Jobs } from "./jobs";

type JobsIdentifiers = {
	[key in Jobs]: (obj: JobsParams["mappings"][key], workflowId: string) => string;
};

export const JobsIdentifiers: JobsIdentifiers = {
	"seconds-interval": (_, workflowId) => `seconds-interval-${workflowId}`,
};
