import { Jobs } from "./jobs";

interface Mapper<TMappings extends Record<Jobs, object>> {
	mappings: TMappings;
}

export type JobsParams = Mapper<{
	"seconds-interval": TimedJobParams;
}>;

export type TimedJobParams = {
	seconds: number;
};
