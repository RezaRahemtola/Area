import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";
import { LaunchJobDto } from "./jobs.dto";
import { JobsType } from "../types/jobs";
import { JobParamsClasses, JobsParams } from "../types/jobParams";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class JobsService {
	constructor(private readonly grpcService: GrpcService) {}

	convertParams = async <TJobs extends JobsType>(
		job: JobsType,
		params: unknown,
	): Promise<JobsParams["mappings"][TJobs]> => {
		const data = plainToInstance<JobsParams["mappings"][TJobs], unknown>(JobParamsClasses[job], params);
		let errors = [];

		try {
			errors = await validate(data, {
				whitelist: true,
				always: true,
				forbidUnknownValues: true,
				forbidNonWhitelisted: true,
				stopAtFirstError: true,
			});
		} catch (e) {
			throw new BadRequestException("Invalid job parameters");
		}
		if (errors.length > 0) {
			const message = Object.values(errors[0].constraints)[0];
			throw new BadRequestException(`Invalid job parameters: ${message}`);
		}
		return data;
	};

	async launchJob(job: LaunchJobDto): Promise<void> {
		const params = await this.convertParams(job.job, job.params);
		const response = await this.grpcService.launchJob(job.job, params);

		if (response.error) {
			throw new HttpException(response.error.message, response.error.code);
		}
	}
}
