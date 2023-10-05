import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Workflow from "./entities/workflow.entity";
import { Repository } from "typeorm";
import WorkflowStep from "./entities/workflow-step.entity";
import WorkflowStepDto, { WorkflowEntryDto } from "./dto/workflow-step.dto";
import Area from "../services/entities/area.entity";
import { User } from "../users/entities/user.entity";

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
		await this.workflowRepository.save({ ...workflow, entry: entryToSave, steps: stepsToSave });
		return {
			id,
		};
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
