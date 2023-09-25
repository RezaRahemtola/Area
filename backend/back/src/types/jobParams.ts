import { JobsType } from "./jobs";

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export type JobsParams = Mapper<{
	"seconds-interval": SecondIntervalParams;
}>;

export type UniqueJobParams = {
	workflowStepId: string;
};

export type SecondIntervalParams = UniqueJobParams & {
	seconds: number;
};
