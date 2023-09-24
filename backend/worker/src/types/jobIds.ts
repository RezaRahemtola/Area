import { JobsParams } from "./jobParams";
import { Jobs } from "./jobs";

type JobsIdentifiers = {
	[key in Jobs]: JobsParams["mappings"][key] extends object
		? (obj: JobsParams["mappings"][key]) => string
		: never
}

export const JobsIdentifiers: JobsIdentifiers = {
	"seconds-timeout": null,
	"seconds-interval": null,
}
