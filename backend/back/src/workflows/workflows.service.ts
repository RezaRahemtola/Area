import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	Logger,
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
import { JobsIdentifiers } from "../types/jobIds";
import { JobsService } from "../jobs/jobs.service";
import { JobParamsClasses, JobsType } from "../types/jobs";
import { ConnectionsService } from "../connections/connections.service";
import { ServiceName, ServicesService } from "../services/services.service";
import { OwnerJobParams, OwnerUniqueJobParams, UniqueJobParams } from "../types/jobParams";
import { plainToInstance } from "class-transformer";
import { GrpcService } from "../grpc/grpc.service";

@Injectable()
export class WorkflowsService {
	private readonly logger = new Logger(WorkflowsService.name);

	constructor(
		@InjectRepository(Workflow)
		private readonly workflowRepository: Repository<Workflow>,
		@InjectRepository(WorkflowArea)
		private readonly workflowAreaRepository: Repository<WorkflowArea>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
		@Inject(forwardRef(() => JobsService))
		private readonly jobsService: JobsService,
		@Inject(forwardRef(() => GrpcService))
		private readonly grpcService: GrpcService,
		private readonly connectionsService: ConnectionsService,
		private readonly servicesService: ServicesService,
	) {}

	async getWorkflowByNameAndOwner(name: string, ownerId: string) {
		return this.workflowRepository.findOneBy({
			name,
			ownerId,
		});
	}

	async getWorkflowWithAreas(id: string, ownerId?: string, isActive?: boolean) {
		this.logger.log(`Getting workflow ${id}...`);
		if (ownerId) this.logger.log(`The workflow needs to be owned by user ${ownerId}`);
		if (isActive != undefined) this.logger.log(`The workflow needs to be ${isActive ? "active" : "inactive"}`);
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
		this.logger.log(`Got workflow ${id}/${name} with ${reactions.length + 1} areas...`);
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
					previousWorkflowArea: { id: previousAreaId },
					area: { id: areaId, serviceId: areaServiceId },
					jobId,
				}) => ({
					id,
					previousAreaId,
					areaId,
					areaServiceId,
					jobId,
					parameters,
				}),
			),
		};
	}

	async getWorkflowsWithAreas(ownerId?: string, active?: boolean) {
		this.logger.log(`Getting workflows...`);
		if (ownerId) this.logger.log(`The workflows need to be owned by user ${ownerId}`);
		if (active !== undefined) this.logger.log(`The workflows need to be ${active ? "active" : "inactive"}`);
		const workflows = await this.workflowRepository.find({
			where: { ownerId, active },
			relations: { action: { area: true }, reactions: { previousWorkflowArea: true, area: true } },
		});
		this.logger.log(`Got ${workflows.length} workflows...`);
		return workflows.map(
			({
				id,
				name,
				active,
				ownerId,
				action: {
					id: actionId,
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					parameters: actionParameters,
					area: { id: areaId, serviceId: areaServiceId },
					jobId,
				},
				reactions,
			}) => ({
				id,
				name,
				active,
				ownerId,
				action: {
					id: actionId,
					areaId,
					areaServiceId,
					parameters: actionParameters,
					jobId,
				},
				reactions: reactions.map(
					({
						id,
						parameters,
						previousWorkflowArea: { id: previousAreaId },
						area: { id: areaId, serviceId: areaServiceId },
						jobId,
					}) => ({
						id,
						previousAreaId,
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
		this.logger.log(
			`Creating ${active ? "active" : "inactive"} workflow ${name} owned by ${ownerId} with ${
				reactions.length + 1
			} areas...`,
		);
		const queryRunner = this.workflowRepository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			if (await queryRunner.manager.exists(Workflow, { where: { name, ownerId } })) {
				// noinspection ExceptionCaughtLocallyJS
				throw new ConflictException(`Workflow ${name} already exists.`);
			}

			const owner = await queryRunner.manager.findOneBy(User, { id: ownerId });
			if (!owner) {
				// noinspection ExceptionCaughtLocallyJS
				throw new NotFoundException(`User ${ownerId} not found.`);
			}

			let workflow = await queryRunner.manager.save(Workflow, { name, owner, active });
			const { id } = workflow;

			const actionToSave = await this.createWorkflowArea(queryRunner, ownerId, action, workflow, true);
			const reactionsToSave = await this.createWorkflowReactions(
				queryRunner,
				ownerId,
				actionToSave,
				reactions,
				workflow,
			);
			workflow = await queryRunner.manager.save(Workflow, {
				...workflow,
				action: actionToSave,
				reactions: reactionsToSave,
			});

			if (workflow.active) {
				this.logger.log(`Launching workflow ${id}'s action...`);
				await this.jobsService.launchWorkflowAction(workflow, ownerId);
			}
			this.logger.log(`Created workflow ${id} owned by ${ownerId}.`);
			await this.grpcService.onAction({
				name: "area-on-workflow-create",
				identifier: `area-on-workflow-create-${ownerId}`,
				params: {
					name,
				},
			});
			await queryRunner.commitTransaction();
			return {
				id,
			};
		} catch (exception) {
			this.logger.error(`Failed to create workflow ${name} owned by ${ownerId}: ${exception.message}`);
			await queryRunner.rollbackTransaction();
			throw exception;
		} finally {
			await queryRunner.release();
		}
	}

	async updateWorkflow(workflowId: string, { name, reactions, action }: UpdateWorkflowDto, ownerId: string) {
		this.logger.log(`Updating workflow ${workflowId} owned by ${ownerId}...`);
		const workflow = await this.workflowRepository.findOne({
			where: {
				id: workflowId,
				ownerId,
			},
			relations: {
				action: true,
				reactions: true,
			},
		});
		if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found.`);
		if (workflow.active) throw new ConflictException(`Workflow ${workflow.name} is active, you cannot update it.`);
		if (!name && !action && !reactions) {
			this.logger.log(`No changes to workflow ${workflowId} requested.`);
			return false;
		}
		let result = false;
		const queryRunner = this.workflowRepository.manager.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (name && workflow.name !== name) {
				if (await queryRunner.manager.exists(Workflow, { where: { name, ownerId: ownerId } })) {
					// noinspection ExceptionCaughtLocallyJS
					throw new ConflictException(`Workflow ${name} already exists.`);
				}
				this.logger.log(`Updating workflow ${workflowId} name to ${name}...`);
				result ||= (await queryRunner.manager.update(Workflow, workflowId, { name })).affected > 0;
			}

			if (action) {
				if (action.id !== workflow.action.id) {
					// noinspection ExceptionCaughtLocallyJS
					throw new ConflictException(
						`You can only change the action ${workflow.action.id} for the workflow ${workflowId}.`,
					);
				}
				this.logger.log(`Updating workflow ${workflowId} action from ${workflow.action.id} to ${action.id}...`);
				const updatedWorkflowAction = await this.createWorkflowArea(
					queryRunner,
					ownerId,
					action,
					workflow,
					true,
					false,
				);
				result ||= (await queryRunner.manager.update(WorkflowArea, action.id, updatedWorkflowAction)).affected > 0;
			}

			if (reactions) {
				this.logger.log(`Updating ${reactions.length} workflow ${workflowId} reactions...`);
				await queryRunner.manager.delete(WorkflowArea, {
					id: In(workflow.reactions.map((reaction) => reaction.id)),
				});
				const reactionsToSave = await this.createWorkflowReactions(
					queryRunner,
					ownerId,
					workflow.action,
					reactions,
					workflow,
				);
				const resultingWorkflow = await queryRunner.manager.save(Workflow, {
					id: workflowId,
					reactions: reactionsToSave,
				});
				result ||= !!resultingWorkflow;
			}
			this.logger.log(`Updated workflow ${workflowId} owned by ${ownerId}.`);
			await queryRunner.commitTransaction();
			return result;
		} catch (exception) {
			this.logger.error(`Failed to update workflow ${workflowId}: ${exception.message}, rolling back...`);
			await queryRunner.rollbackTransaction();
			throw exception;
		} finally {
			await queryRunner.release();
		}
	}

	async toggleWorkflows(workflowIds: string[], newState: boolean, ownerId: string) {
		this.logger.log(`Toggling ${workflowIds.length} workflows to ${newState}`);
		await Promise.all(workflowIds.map((workflowId) => this.toggleWorkflow(workflowId, newState, ownerId)));
		this.logger.log(`Toggled ${workflowIds.length} workflows to ${newState}`);
		return true;
	}

	async toggleWorkflow(workflowId: string, newState: boolean, ownerId: string) {
		this.logger.log(`Toggling workflow ${workflowId}...`);
		const workflow = await this.workflowRepository.findOne({
			where: { id: workflowId, ownerId },
			relations: { action: { area: true } },
		});
		if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found.`);
		await this.workflowRepository.update(workflowId, { active: newState });
		if (!newState) {
			this.logger.log(`Stopping workflow ${workflowId}...`);
			await this.jobsService.stopWorkflowActionIfNecessary(workflow);
		} else {
			this.logger.log(`Launching workflow ${workflowId}...`);
			await this.jobsService.launchWorkflowAction(workflow, ownerId);
			await this.grpcService.onAction({
				name: "area-on-workflow-toggle",
				identifier: `area-on-workflow-toggle-${ownerId}`,
				params: {
					name: workflow.name,
				},
			});
		}
		this.logger.log(`Toggled workflow ${workflowId} to ${newState}`);
		return { newState };
	}

	async deleteWorkflows(workflows: string[], ownerId: string) {
		this.logger.log(`Deleting ${workflows.length} workflows...`);
		const workflowActions = await this.workflowAreaRepository.find({
			where: { actionOfWorkflow: { id: In(workflows), ownerId } },
			relations: { actionOfWorkflow: true },
		});
		const jobIds = workflowActions.map((a) => a.jobId);
		const { affected } = await this.workflowRepository.delete({ id: In(workflows), ownerId });
		this.logger.log(`Stopping ${jobIds.length} workflow jobs...`);
		await Promise.all(jobIds.map((jobId) => this.jobsService.stopJobIdIfNecessary(jobId)));
		return affected > 0;
	}

	async deleteWorkflow(workflowId: string, ownerId: string) {
		this.logger.log(`Deleting workflow ${workflowId}...`);
		const { jobId } = await this.workflowAreaRepository.findOne({
			where: { actionOfWorkflow: { id: workflowId } },
			relations: { actionOfWorkflow: true },
		});
		const { affected } = await this.workflowRepository.delete({ id: workflowId, ownerId });
		this.logger.log(`Stopping workflow ${workflowId} job...`);
		await this.jobsService.stopJobIdIfNecessary(jobId);
		return affected === 1;
	}

	private async createWorkflowReactions(
		queryRunner: QueryRunner,
		ownerId: string,
		action: WorkflowArea,
		reactions: WorkflowReactionDto[],
		workflow: Workflow,
	) {
		const dbReactions = await Promise.all(
			reactions.map(async (reaction) => await this.createWorkflowArea(queryRunner, ownerId, reaction, workflow, false)),
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

	private async getNeededNewScopes(
		userId: string,
		serviceId: ServiceName,
		neededScopeIds: string[],
	): Promise<string[] | null> {
		const service = await this.servicesService.getService(serviceId);
		if (!service) throw new NotFoundException(`Service ${serviceId} not found.`);
		if (!service.needConnection) return [];
		const userConnection = await this.connectionsService.getUserConnectionForService(userId, serviceId);
		if (!userConnection) return neededScopeIds;
		return this.connectionsService.getNewScopesForConnection(
			userId,
			serviceId,
			userConnection.scopes.map(({ id }) => id),
		);
	}

	private async getAreaWithNeededScopes(id: string, serviceId: ServiceName, isAction: boolean) {
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
		queryRunner: QueryRunner,
		userId: string,
		{ id, areaId, areaServiceId, parameters }: Partial<WorkflowReactionDto>,
		workflow: Workflow,
		isAction: boolean = false,
		checkExist: boolean = true,
	) {
		this.logger.log(`Creating workflow ${isAction ? "" : "re"}action ${id}...`);
		if (checkExist && (await queryRunner.manager.exists(WorkflowArea, { where: { id } })))
			throw new ConflictException(`Workflow area ${id} already exists.`);
		const workflowArea = new WorkflowArea();
		workflowArea.id = id;
		workflowArea.area = await this.getAreaWithNeededScopes(areaId, areaServiceId, isAction);
		const neededNewScopes = await this.getNeededNewScopes(
			userId,
			areaServiceId,
			workflowArea.area.serviceScopesNeeded.map(({ id }) => id),
		);
		if (neededNewScopes && neededNewScopes.length > 0) {
			throw new BadRequestException(
				`You need to connect to ${areaServiceId} with scopes ${neededNewScopes.join(", ")}.`,
			);
		}
		const jobType = `${areaServiceId}-${areaId}`;
		const paramsInstance = plainToInstance(JobParamsClasses[jobType], parameters);
		if (paramsInstance instanceof UniqueJobParams) {
			parameters.workflowStepId = id;
		}
		if (paramsInstance instanceof OwnerJobParams || paramsInstance instanceof OwnerUniqueJobParams) {
			parameters.ownerId = userId;
		}
		workflowArea.parameters = await this.jobsService.convertParams(jobType as JobsType, parameters).catch((err) => {
			throw new BadRequestException(`Invalid parameters for workflow area ${id} (${jobType}): ${err.message}`);
		});
		if (isAction) workflowArea.actionOfWorkflow = workflow;
		else workflowArea.workflow = workflow;
		workflowArea.jobId = JobsIdentifiers[jobType](parameters);
		return workflowArea;
	}
}
