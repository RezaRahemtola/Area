import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import ActivityLog, { ActivityLogType } from "./entities/activity-log.entity";
import { MoreThan, Repository } from "typeorm";
import Workflow from "../workflows/entities/workflow.entity";
import WorkflowArea from "../workflows/entities/workflow-area.entity";
import ActivityLogGetterParamsDto from "./dto/activity-log-getter-params.dto";

@Injectable()
export class ActivityService {
	private readonly logger = new Logger(ActivityService.name);

	constructor(
		@InjectRepository(ActivityLog)
		private readonly activityLogRepository: Repository<ActivityLog>,
	) {}

	async createActivityLog(type: ActivityLogType, workflow: Workflow, workflowArea: WorkflowArea): Promise<ActivityLog> {
		return this.activityLogRepository.save({ type, workflow, workflowArea });
	}

	async getActivityLogs({ since, page, itemsPerPage, type }: ActivityLogGetterParamsDto, ownerId: string) {
		const logs = await this.activityLogRepository.find({
			where: { createdAt: since && MoreThan(since), type, workflow: { owner: { id: ownerId } } },
			take: page !== undefined ? itemsPerPage ?? 10 : undefined,
			skip: (page ?? 0) * (itemsPerPage ?? 10),
			relations: {
				workflowArea: { area: true },
				workflow: true,
			},
			select: {
				id: true,
				type: true,
				createdAt: true,
				workflow: { id: true, name: true },
			},
		});
		return logs.map(
			({
				workflowArea: {
					id: workflowAreaId,
					area: { serviceId: workflowAreaServiceId, id: workflowAreaAreaId },
				},
				workflow: { name: workflowName, id: workflowId },
				...log
			}) => ({
				...log,
				workflowArea: { id: workflowAreaId, area: { id: workflowAreaAreaId, serviceId: workflowAreaServiceId } },
				workflow: { id: workflowId, name: workflowName },
			}),
		);
	}
}
