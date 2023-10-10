import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import { In, QueryRunner, Repository } from "typeorm";
import WorkflowArea from "./entities/workflow-area.entity";
import WorkflowReactionDto, { WorkflowActionDto } from "./dto/workflow-reaction.dto";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";
import UpdateWorkflowDto from "./dto/update-workflow.dto";
import UserConnection from "../connections/entities/user-connection.entity";
import { JobsIdentifiers } from "../types/jobIds";
import { JobsService } from "../jobs/jobs.service";
import { JobsType } from "../types/jobs";
import Service from "../services/entities/service.entity";
import { ConnectionsService } from "../connections/connections.service";

@Injectable()
export class WorkflowsService {
	constructor(
		@InjectRepository(Workflow)
		private readonly workflowRepository: Repository<Workflow>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
		@Inject(forwardRef(() => JobsService))
		private readonly jobsService: JobsService,
		private readonly connectionsService: ConnectionsService,
	) {}

	async getWorkflowWithAreas(id: string, ownerId?: string, isActive?: boolean) {
		const workflow = await this.workflowRepository.findOne({
			where: { id, ownerId, active: isActive },
			relations: { action: { area: true }, reactions: { previousWorkflowArea: true, area: true } },
		});
		if (!workflow) throw new NotFoundException(`Workflow ${id} not found.`);
		const {
			name,
			active,
			reactions,
			action: {
				id: actionId,
				parameters: actionParameters,
				area: { id: actionAreaId, serviceId: actionAreaServiceId },
				jobId,
			},
		} = workflow;
		return {
			id,
			name,
			active,
			action: {
				id: actionId,
				areaId: actionAreaId,
				areaServiceId: actionAreaServiceId,
				parameters: actionParameters,
				jobId,
			},
			reactions: reactions.map(
				({
					id,
					parameters,
					previousWorkflowArea: { id: previousWorkflowAreaId },
					area: { id: areaId, serviceId: areaServiceId },
					jobId,
				}) => ({
					id,
					previousWorkflowAreaId,
					areaId,
					areaServiceId,
					jobId,
					parameters,
				}),
			),
		};
	}

	async getWorkflowsWithAreas(ownerId?: string, active?: boolean) {
		const workflows = await this.workflowRepository.find({
			where: { ownerId, active },
			relations: { action: { area: true }, reactions: { previousWorkflowArea: true, area: true } },
		});
		return workflows.map(
			({
				id,
				name,
				active,
				action: {
					id: actionId,
					parameters: actionParamaters,
					area: { id: areaId, serviceId: areaServiceId },
					jobId,
				},
				reactions,
			}) => ({
				id,
				name,
				active,
				action: {
					id: actionId,
					areaId,
					areaServiceId,
					parameters: actionParamaters,
					jobId,
				},
				reactions: reactions.map(
					({
						id,
						parameters,
						previousWorkflowArea: { id: previousWorkflowAreaId },
						area: { id: areaId, serviceId: areaServiceId },
						jobId,
					}) => ({
						id,
						previousWorkflowAreaId,
						areaId,
						areaServiceId,
						parameters,
						jobId,
					}),
				),
			}),
		);
	}

	async createWorkflow(
		name: string,
		ownerId: string,
		action: WorkflowActionDto,
		reactions: WorkflowReactionDto[],
		active: boolean = false,
	) {
		let exception: unknown = null;
		const queryRunner = this.workflowRepository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			if (await queryRunner.manager.exists(Workflow, { where: { name, ownerId } }))
				throw new ConflictException(`Workflow ${name} already exists.`);

			const owner = await queryRunner.manager.findOneBy(User, { id: ownerId });
			if (!owner) throw new NotFoundException(`User ${ownerId} not found.`);

			const workflow = await queryRunner.manager.save(Workflow, { name, owner, active });
			const { id } = workflow;

			const actionToSave = await this.createWorkflowArea(ownerId, action, workflow, queryRunner, true);
			const reactionsToSave = await this.createWorkflowReactions(
				ownerId,
				actionToSave,
				reactions,
				workflow,
				queryRunner,
			);
			await queryRunner.manager.save(Workflow, { ...workflow, action: actionToSave, reactions: reactionsToSave });
			await queryRunner.commitTransaction();

			if (workflow.active) {
				await this.jobsService.launchWorkflowAction(workflow.id);
			}
			return {
				id,
			};
		} catch (_exception) {
			await queryRunner.rollbackTransaction();
			exception = _exception;
		} finally {
			await queryRunner.release();
			if (exception) throw exception;
		}
	}

	async updateWorkflow(workflowId: string, { name, reactions, action }: UpdateWorkflowDto, ownerId: string) {
		const workflow = await this.workflowRepository.findOne({
			where: {
				id: workflowId,
			},
			relations: {
				action: true,
				reactions: true,
			},
		});
		if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found.`);
		if (!name && !action && !reactions) return false;
		let result = false;
		let exception: unknown = null;
		const queryRunner = this.workflowRepository.manager.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (name) {
				if (await queryRunner.manager.exists(Workflow, { where: { name, ownerId: ownerId } }))
					throw new ConflictException(`Workflow ${name} already exists.`);
				result ||= (await queryRunner.manager.update(Workflow, workflowId, { name })).affected > 0;
			}

			if (action) {
				const { id, areaId, areaServiceId, parameters } = action;
				if (id !== workflow.action.id) {
					throw new ConflictException(
						`You can only change the action ${workflow.action.id} for the workflow ${workflowId}.`,
					);
				}
				const area = await this.getAreaWithNeededScopes(areaId, areaServiceId, true);
				const neededScopes = await this.getNeededNewScopes(
					ownerId,
					areaServiceId,
					area.serviceScopesNeeded.map(({ id }) => id),
				);
				if (neededScopes.length > 0)
					throw new BadRequestException(
						`You need to connect to ${areaServiceId} with scopes ${neededScopes.join(", ")}.`,
					);
				const jobType = `${areaServiceId}-${areaId}`;
				parameters.workflowStepId = id;
				result ||=
					(
						await queryRunner.manager.update(WorkflowArea, id, {
							area: { id: areaId, serviceId: areaServiceId },
							jobId: JobsIdentifiers[jobType](parameters),
							parameters: (await this.jobsService.convertParams(jobType as JobsType, parameters).catch((err) => {
								throw new BadRequestException(
									`Invalid parameters for workflow area ${id} (${jobType}): ${err.message}`,
								);
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
							})) as Record<string, any>,
						})
					).affected > 0;
			}

			if (reactions) {
				await queryRunner.manager.delete(WorkflowArea, { id: In(workflow.reactions.map((reaction) => reaction.id)) });
				const reactionsToSave = await this.createWorkflowReactions(
					ownerId,
					workflow.action,
					reactions,
					workflow,
					queryRunner,
				);
				result ||=
					(await queryRunner.manager.update(Workflow, workflowId, { reactions: reactionsToSave })).affected > 0;
			}

			return result;
		} catch (_exception) {
			await queryRunner.rollbackTransaction();
			exception = _exception;
		} finally {
			await queryRunner.release();
			if (exception) throw exception;
		}
	}

	async toggleWorkflows(workflows: string[], newState: boolean, ownerId: string) {
		const { affected } = await this.workflowRepository.update(
			{
				id: In(workflows),
				active: !newState,
				ownerId,
			},
			{ active: () => `${newState}` },
		);
		if (newState) {
			await Promise.all(workflows.map((workflowId) => this.jobsService.launchWorkflowAction(workflowId)));
		}
		return affected > 0;
	}

	async toggleWorkflow(workflowId: string, ownerId: string) {
		const workflow = await this.workflowRepository.findOneBy({ id: workflowId, ownerId });
		if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found.`);
		const { active } = workflow;
		await this.workflowRepository.update(workflowId, { active: !active });
		if (!active) {
			await this.jobsService.launchWorkflowAction(workflowId);
		}
		return { newState: !active };
	}

	async deleteWorkflows(workflows: string[], ownerId: string) {
		const { affected } = await this.workflowRepository.delete({ id: In(workflows), ownerId });
		return affected > 0;
	}

	async deleteWorkflow(workflowId: string, ownerId: string) {
		const { affected } = await this.workflowRepository.delete({ id: workflowId, ownerId });
		return affected === 1;
	}

	private async createWorkflowReactions(
		ownerId: string,
		action: WorkflowArea,
		reactions: WorkflowReactionDto[],
		workflow: Workflow,
		queryRunner: QueryRunner,
	) {
		const dbReactions = await Promise.all(
			reactions.map(async (reaction) => await this.createWorkflowArea(ownerId, reaction, workflow, queryRunner)),
		);
		for (const dbReaction of dbReactions) {
			if (!dbReaction.previousWorkflowArea) {
				const { previousAreaId } = reactions.find((reaction) => reaction.id === dbReaction.id);
				dbReaction.previousWorkflowArea = [action, ...dbReactions].find((area) => area.id === previousAreaId);
				if (!dbReaction.previousWorkflowArea)
					throw new NotFoundException(`You did not provide a previous area for area ${dbReaction.id}.`);
			}
		}
		return dbReactions;
	}

	private async getNeededNewScopes(userId: string, serviceId: string, neededScopeIds: string[]) {
		const service = await this.workflowRepository.manager.findOneBy(Service, { id: serviceId });
		if (!service) throw new NotFoundException(`Service ${serviceId} not found.`);
		if (!service.needConnection) return [];
		const userConnection = await this.workflowRepository.manager.findOne(UserConnection, {
			where: {
				userId,
				serviceId,
			},
			relations: {
				scopes: true,
			},
		});
		if (!userConnection) return neededScopeIds;
		return this.connectionsService.getNewScopesForConnection(
			userId,
			serviceId,
			userConnection.scopes.map(({ id }) => id),
		);
	}

	private async getAreaWithNeededScopes(id: string, serviceId: string, isAction: boolean) {
		const result = await this.areaRepository.findOne({
			where: { id, serviceId, isAction },
			relations: {
				serviceScopesNeeded: true,
			},
		});
		if (!result) throw new NotFoundException(`Area ${id} for service ${serviceId} not found.`);
		return result;
	}

	private async createWorkflowArea(
		userId: string,
		{ id, areaId, areaServiceId, parameters }: Partial<WorkflowReactionDto>,
		workflow: Workflow,
		queryRunner: QueryRunner,
		isAction: boolean = false,
	) {
		if (await queryRunner.manager.exists(Workflow, { where: { id } }))
			throw new ConflictException(`Workflow area ${id} already exists.`);
		const action = new WorkflowArea();
		action.id = id;
		action.area = await this.getAreaWithNeededScopes(areaId, areaServiceId, isAction);
		const neededNewScopes = await this.getNeededNewScopes(
			userId,
			areaServiceId,
			action.area.serviceScopesNeeded.map(({ id }) => id),
		);
		if (neededNewScopes.length > 0) {
			throw new BadRequestException(
				`You need to connect to ${areaServiceId} with scopes ${neededNewScopes.join(", ")}.`,
			);
		}
		const jobType = `${areaServiceId}-${areaId}`;
		parameters.workflowStepId = id;
		action.parameters = await this.jobsService.convertParams(jobType as JobsType, parameters).catch((err) => {
			throw new BadRequestException(`Invalid parameters for workflow area ${id} (${jobType}): ${err.message}`);
		});
		if (isAction) action.actionOfWorkflow = workflow;
		else action.workflow = workflow;
		action.jobId = JobsIdentifiers[jobType](parameters);
		return action;
	}
}
