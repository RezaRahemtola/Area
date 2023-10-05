import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import CreateWorkflowDto from "./dto/create-workflow.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";
import BulkWorkflowsDto, { BulkToggleWorkflowsDto } from "./dto/bulk-workflows.dto";

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

	@Get()
	async getWorkflows(@Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.getWorkflowsWithSteps(ownerId);
	}

	@Get(":id")
	async getWorkflow(@Param("id") workflowId: string, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.getWorkflowWithSteps(workflowId, ownerId);
	}

	@Patch("/toggle/bulk")
	async toggleWorkflows(
		@Body() { workflows, newState }: BulkToggleWorkflowsDto,
		@Req() { user: { id: ownerId } }: APIRequest,
	) {
		return await this.workspacesService.toggleWorkflows(workflows, newState, ownerId);
	}

	@Patch("/toggle/:id")
	async toggleWorkflow(@Param("id") workflowId: string, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.toggleWorkflow(workflowId, ownerId);
	}

	@Delete("bulk")
	async deleteWorkflows(@Body() { workflows }: BulkWorkflowsDto, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.deleteWorkflows(workflows, ownerId);
	}

	@Delete(":id")
	async deleteWorkflow(@Param("id") workflowId: string, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.deleteWorkflow(workflowId, ownerId);
	}
}
