import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import { In, Repository } from "typeorm";
import WorkflowStep from "./entities/workflow-step.entity";
import WorkflowStepDto, { WorkflowEntryDto } from "./dto/workflow-step.dto";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";
import UpdateWorkflowDto from "./dto/update-workflow.dto";

@Injectable()
export class WorkflowsService {
	constructor(
		@InjectRepository(Workflow)
		private readonly workflowRepository: Repository<Workflow>,
		@InjectRepository(WorkflowStep)
		private readonly workflowStepRepository: Repository<WorkflowStep>,
		@InjectRepository(Area)
		private readonly areaRepository: Repository<Area>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getWorkflowWithSteps(id: string, ownerId: string) {
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

	async getWorkflowsWithSteps(ownerId: string) {
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
		entry: WorkflowEntryDto,
		steps: WorkflowStepDto[],
		active: boolean = false,
	) {
		if (await this.workflowRepository.exist({ where: { name, ownerId } }))
			throw new ConflictException(`Workflow ${name} already exists.`);

		const owner = await this.userRepository.findOneBy({ id: ownerId });
		if (!owner) throw new NotFoundException(`User ${ownerId} not found.`);

		const workflow = await this.workflowRepository.save({ name, owner, active });
		const { id } = workflow;

		const entryToSave = await this.createWorkflowStep(entry, workflow);
		const stepsToSave = await this.createWorkflowSteps(entryToSave, steps, workflow);
		await this.workflowRepository.save({ ...workflow, action: entryToSave, reactions: stepsToSave });
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
					await this.workflowStepRepository.update(id, {
						area: { id: areaId, serviceId: areaServiceId },
						parameters,
					})
				).affected > 0;
		}

		if (reactions) {
			await this.workflowStepRepository.delete({ id: In(workflow.reactions.map((reaction) => reaction.id)) });
			const reactionsToSave = await this.createWorkflowSteps(workflow.action, reactions, workflow);
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

	private async createWorkflowSteps(entry: WorkflowStep, steps: WorkflowStepDto[], workflow: Workflow) {
		const dbSteps = await Promise.all(steps.map(async (step) => await this.createWorkflowStep(step, workflow)));
		for (const dbStep of dbSteps) {
			if (!dbStep.previousStep) {
				const previousStepId = steps.find((step) => step.id === dbStep.id)?.previousStepId;
				dbStep.previousStep = [entry, ...dbSteps].find((step) => step.id === previousStepId);
				if (!dbStep.previousStep)
					throw new NotFoundException(`You not provided a previous step for step ${dbStep.id}.`);
			}
		}
		return dbSteps;
	}

	private async createWorkflowStep(
		{ id, areaId, areaServiceId, parameters }: Partial<WorkflowStepDto>,
		workflow: Workflow,
	) {
		if (await this.workflowStepRepository.exist({ where: { id } }))
			throw new ConflictException(`Workflow step ${id} already exists.`);
		const entry = new WorkflowStep();
		entry.id = id;
		entry.area = await this.areaRepository.findOneBy({ id: areaId, serviceId: areaServiceId });
		entry.parameters = parameters;
		entry.workflow = workflow;
		return entry;
	}
}
