import { GoogleSendEmailParams, SecondIntervalParams } from "./jobParams";

export enum Jobs {
	"seconds-interval" = "seconds-interval",
	"google-send-email" = "google-send-email",
}
export type JobsType = keyof typeof Jobs;

interface Mapper<TMappings extends Record<JobsType, object>> {
	mappings: TMappings;
}

export const JobParamsClasses = {
	"seconds-interval": SecondIntervalParams,
	"google-send-email": GoogleSendEmailParams,
};

export type JobsParams = Mapper<{
	"seconds-interval": SecondIntervalParams;
	"google-send-email": GoogleSendEmailParams;
}>;
