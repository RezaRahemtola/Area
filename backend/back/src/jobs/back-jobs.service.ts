import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JobData } from "../grpc/grpc.dto";
import { JobsType } from "../types/jobs";
import { JobsService } from "./jobs.service";
import { WorkflowToggleParams } from "../types/jobParams";
import { WorkflowsService } from "../workflows/workflows.service";
import { GrpcService } from "../grpc/grpc.service";
import { JobsIdentifiers } from "../types/jobIds";

@Injectable()
export class BackJobsService {
	constructor(
		@Inject(forwardRef(() => GrpcService)) private readonly grpcService: GrpcService,
		@Inject(forwardRef(() => JobsService)) private readonly jobsService: JobsService,
		private readonly workflowsService: WorkflowsService,
	) {}

	async toggleWorkflow(params: WorkflowToggleParams, newState: boolean) {
		const jobName = `area-${newState ? "enable" : "disable"}-workflow`;
		const workflow = await this.workflowsService.getWorkflowIdByName(params.workflowName, params.ownerId);

		if (workflow.active === newState) return;
		try {
			await this.workflowsService.toggleWorkflow(workflow.id, newState, params.ownerId);
			await this.grpcService.onAction({
				name: jobName,
				identifier: `area-${newState ? "enable" : "disable"}-workflow-${params.ownerId}`,
				params: {},
			});
		} catch (e) {
			await this.grpcService.onError({
				identifier: JobsIdentifiers[jobName](params),
				error: e.message,
				isAuthError: false,
			});
		}
	}

	async executeBackJob(job: JobData) {
		const jobType: JobsType = job.name as JobsType;
		const params = await this.jobsService.convertParams(jobType, job.params);

		switch (jobType) {
			case "area-disable-workflow":
				await this.toggleWorkflow(params as WorkflowToggleParams, false);
				break;
			case "area-enable-workflow":
				await this.toggleWorkflow(params as WorkflowToggleParams, true);
				break;
		}
	}
}
