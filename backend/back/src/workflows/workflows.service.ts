import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import { In, QueryRunner, Repository } from "typeorm";
import WorkflowArea from "./entities/workflow-area.entity";
import WorkflowReactionDto, { WorkflowActionDto } from "./dto/workflow-reaction.dto";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";
import UpdateWorkflowDto from "./dto/update-workflow.dto";
import UserConnection from "../connections/entities/user-connection.entity";

@Injectable()
export class WorkflowsService {
	constructor(
		@InjectRepository(Workflow)
		private readonly workflowRepository: Repository<Workflow>,
	) {}

	async getWorkflowWithAreas(id: string, ownerId?: string) {
		const workflow = await this.workflowRepository.findOne({
			where: { id, ownerId },
			relations: { action: true, reactions: { previousWorkflowArea: true, area: true } },
		});
		if (!workflow) throw new NotFoundException(`Workflow ${id} not found.`);
		const { name, active, reactions, action } = workflow;
		return {
			id,
			name,
			active,
			action,
			reactions: reactions.map(
				({
					id,
					parameters,
					previousWorkflowArea: { id: previousWorkflowAreaId },
					area: { id: areaId, serviceId: areaServiceId },
				}) => ({
					id,
					previousWorkflowAreaId,
					areaId,
					areaServiceId,
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
				},
				reactions: reactions.map(
					({
						id,
						parameters,
						previousWorkflowArea: { id: previousWorkflowAreaId },
						area: { id: areaId, serviceId: areaServiceId },
					}) => ({
						id,
						previousWorkflowAreaId,
						areaId,
						areaServiceId,
						parameters,
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

			const actionToSave = await this.createWorkflowArea(action, workflow, queryRunner, true);
			const reactionsToSave = await this.createWorkflowReactions(actionToSave, reactions, workflow, queryRunner);
			await queryRunner.manager.save(Workflow, { ...workflow, action: actionToSave, reactions: reactionsToSave });
			await queryRunner.commitTransaction();
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
				result ||=
					(
						await queryRunner.manager.update(WorkflowArea, id, {
							area: { id: areaId, serviceId: areaServiceId },
							parameters,
						})
					).affected > 0;
			}

			if (reactions) {
				await queryRunner.manager.delete(WorkflowArea, { id: In(workflow.reactions.map((reaction) => reaction.id)) });
				const reactionsToSave = await this.createWorkflowReactions(workflow.action, reactions, workflow, queryRunner);
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
		return affected > 0;
	}

	async toggleWorkflow(workflowId: string, ownerId: string) {
		const workflow = await this.workflowRepository.findOneBy({ id: workflowId, ownerId });
		if (!workflow) throw new NotFoundException(`Workflow ${workflowId} not found.`);
		const { active } = workflow;
		await this.workflowRepository.update(workflowId, { active: !active });
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
		action: WorkflowArea,
		reactions: WorkflowReactionDto[],
		workflow: Workflow,
		queryRunner: QueryRunner,
	) {
		const dbReactions = await Promise.all(
			reactions.map(async (reaction) => await this.createWorkflowArea(reaction, workflow, queryRunner)),
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

	private async createWorkflowArea(
		{ id, areaId, areaServiceId, parameters }: Partial<WorkflowReactionDto>,
		workflow: Workflow,
		queryRunner: QueryRunner,
		isAction: boolean = false,
	) {
		if (await queryRunner.manager.exists(Workflow, { where: { id } }))
			throw new ConflictException(`Workflow area ${id} already exists.`);
		const action = new WorkflowArea();
		action.id = id;
		action.area = await queryRunner.manager.findOne(Area, {
			where: {
				id: areaId,
				serviceId: areaServiceId,
				isAction,
			},
			relations: {
				serviceScopesNeeded: true,
			},
		});
		if (!action.area)
			throw new NotFoundException(
				`${
					isAction ? "Action" : "Reaction"
				} ${areaId} with service ${areaServiceId} not found for workflow area ${id}.`,
			);
		const serviceUserConnection = await queryRunner.manager.findOne(UserConnection, {
			where: {
				serviceId: areaServiceId,
			},
			relations: {
				scopes: true,
			},
		});
		if (!serviceUserConnection) throw new NotFoundException(`User connection for ${areaServiceId} not found.`);
		const scopeIds = serviceUserConnection.scopes.map(({ id }) => id);
		const areaNeededScopeIds = action.area.serviceScopesNeeded.map(({ id }) => id);
		if (!areaNeededScopeIds.every((id) => scopeIds.includes(id)))
			throw new NotFoundException(
				`Workflow area ${id} misses scopes ${areaNeededScopeIds.filter((id) => !scopeIds.includes(id)).join(", ")}.`,
			);
		if (action.area.serviceScopesNeeded) action.parameters = parameters;
		if (isAction) action.actionOfWorkflow = workflow;
		else action.workflow = workflow;
		return action;
	}
}
