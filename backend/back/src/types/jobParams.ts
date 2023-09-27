import { JobsType } from "./jobs";
import { IsNumber, IsUUID } from "class-validator";

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export class UniqueJobParams {
	@IsUUID(4)
	workflowStepId: string;
}

export class SecondIntervalParams extends UniqueJobParams {
	@IsNumber()
	seconds: number;
}

export const JobParamsClasses = {
	"seconds-interval": SecondIntervalParams,
};

export type JobsParams = Mapper<{
	"seconds-interval": SecondIntervalParams;
}>;
