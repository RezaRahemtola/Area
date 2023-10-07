import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import { In, Repository } from "typeorm";
import WorkflowArea from "./entities/workflow-area.entity";
import WorkflowReactionDto, { WorkflowActionDto } from "./dto/workflow-reaction.dto";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";
import UpdateWorkflowDto from "./dto/update-workflow.dto";

@Injectable()
export class WorkflowsService {
	constructor(
		@InjectRepository(Workflow)
		private readonly workflowRepository: Repository<Workflow>,
		@InjectRepository(WorkflowArea)
		private readonly workflowAreaRepository: Repository<WorkflowArea>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getWorkflowWithAreas(id: string, ownerId: string) {
		const workflow = await this.workflowRepository.findOne({
			where: { id, ownerId },
			relations: { action: true, reactions: true },
		});
		if (!workflow) throw new NotFoundException(`Workflow ${id} not found.`);
		const { name, active, reactions, action } = workflow;
		return {
			id,
			name,
			active,
			action,
			reactions,
		};
	}

	async getWorkflowsWithAreas(ownerId: string) {
		const workflows = await this.workflowRepository.find({
			where: { ownerId },
			relations: { action: true, reactions: true },
		});
		return workflows.map(({ id, name, active, action, reactions }) => ({
			id,
			name,
			active,
			action,
			reactions,
		}));
	}

	async createWorkflow(
		name: string,
		ownerId: string,
		action: WorkflowActionDto,
		reactions: WorkflowReactionDto[],
		active: boolean = false,
	) {
		if (await this.workflowRepository.exist({ where: { name, ownerId } }))
			throw new ConflictException(`Workflow ${name} already exists.`);

		const owner = await this.userRepository.findOneBy({ id: ownerId });
		if (!owner) throw new NotFoundException(`User ${ownerId} not found.`);

		const workflow = await this.workflowRepository.save({ name, owner, active });
		const { id } = workflow;

		const actionToSave = await this.createWorkflowArea(action, workflow, true);
		const reactionsToSave = await this.createWorkflowReactions(actionToSave, reactions, workflow);
		await this.workflowRepository.save({ ...workflow, action: actionToSave, reactions: reactionsToSave });
		return {
			id,
		};
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

		if (name) {
			if (await this.workflowRepository.exist({ where: { name, ownerId: ownerId } }))
				throw new ConflictException(`Workflow ${name} already exists.`);
			result ||= (await this.workflowRepository.update(workflowId, { name })).affected > 0;
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
					await this.workflowAreaRepository.update(id, {
						area: { id: areaId, serviceId: areaServiceId },
						parameters,
					})
				).affected > 0;
		}

		if (reactions) {
			await this.workflowAreaRepository.delete({ id: In(workflow.reactions.map((reaction) => reaction.id)) });
			const reactionsToSave = await this.createWorkflowReactions(workflow.action, reactions, workflow);
			result ||= (await this.workflowRepository.update(workflowId, { reactions: reactionsToSave })).affected > 0;
		}

		return result;
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

	private async createWorkflowReactions(action: WorkflowArea, reactions: WorkflowReactionDto[], workflow: Workflow) {
		const dbReactions = await Promise.all(
			reactions.map(async (reaction) => await this.createWorkflowArea(reaction, workflow)),
		);
		for (const dbReaction of dbReactions) {
			if (!dbReaction.previousArea) {
				const { previousAreaId } = reactions.find((reaction) => reaction.id === dbReaction.id);
				dbReaction.previousArea = [action, ...dbReactions].find((area) => area.id === previousAreaId);
				if (!dbReaction.previousArea)
					throw new NotFoundException(`You did not provide a previous area for area ${dbReaction.id}.`);
			}
		}
		return dbReactions;
	}

	private async createWorkflowArea(
		{ id, areaId, areaServiceId, parameters }: Partial<WorkflowReactionDto>,
		workflow: Workflow,
		isAction: boolean = false,
	) {
		if (await this.workflowAreaRepository.exist({ where: { id } }))
			throw new ConflictException(`Workflow area ${id} already exists.`);
		const action = new WorkflowArea();
		action.id = id;
		action.area = await this.areaRepository.findOneBy({ id: areaId, serviceId: areaServiceId, isAction });
		if (!action.area)
			throw new NotFoundException(
				`${
					isAction ? "Action" : "Reaction"
				} ${areaId} with service ${areaServiceId} not found for workflow area ${id}.`,
			);
		action.parameters = parameters;
		if (isAction) action.actionOfWorkflow = workflow;
		else action.workflow = workflow;
		return action;
	}
}
