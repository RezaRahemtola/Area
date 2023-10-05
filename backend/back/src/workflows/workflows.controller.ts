import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import CreateWorkflowDto from "./dto/create-workflow.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";

@UseGuards(JwtAuthGuard)
@Controller("workflows")
export class WorkflowsController {
	constructor(private readonly workspacesService: WorkflowsService) {}

	@Post()
	async createWorkflow(
		@Req() { user: { id: ownerId } }: APIRequest,
		@Body() { name, active, entry, steps }: CreateWorkflowDto,
	) {
		return await this.workspacesService.createWorkflow(name, ownerId, entry, steps, active);
	}

	@Get(":id")
	async getWorkflow(@Param("id") workflowId: string) {
		return await this.workspacesService.getWorkflowWithSteps(workflowId);
	}
}
