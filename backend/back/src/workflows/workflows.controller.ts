import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Logger,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import CreateWorkflowDto from "./dto/create-workflow.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { APIRequest } from "../types/request";
import BulkWorkflowsDto, { BulkToggleWorkflowsDto } from "./dto/bulk-workflows.dto";
import { Response } from "express";
import UpdateWorkflowDto from "./dto/update-workflow.dto";
import { UuidParamDto } from "../param-validators.dto";
import {
	ApiBearerAuth,
	ApiBody,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiParam,
	ApiProduces,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
	PickType,
} from "@nestjs/swagger";
import Workflow from "./entities/workflow.entity";

@ApiBearerAuth()
@ApiTags("Workflows")
@ApiProduces("application/json")
@ApiUnauthorizedResponse({
	description: "The user access token was either invalid or expired",
})
@UseGuards(JwtAuthGuard)
@Controller("workflows")
export class WorkflowsController {
	private readonly logger = new Logger(WorkflowsController.name);

	constructor(private readonly workspacesService: WorkflowsService) {}

	@ApiOkResponse({
		description: "The workflow was successfully created",
		schema: {
			properties: {
				id: { type: "string" },
			},
		},
	})
	@ApiConflictResponse({
		description: "A workflow with the same name already exists",
	})
	@ApiNotFoundResponse({
		description:
			"The user making this request was deleted, a reaction was not provided a previous area or an area was not found for a specific workflow area",
	})
	@ApiBody({
		description: "The workflow to create",
		type: CreateWorkflowDto,
	})
	@Post()
	async createWorkflow(
		@Req() { user: { id: ownerId } }: APIRequest,
		@Body() { name, active, action, reactions }: CreateWorkflowDto,
	) {
		return await this.workspacesService.createWorkflow(name, ownerId, action, reactions, active);
	}

	@ApiOkResponse({
		description: "The workflows was successfully retrieved",
		type: [PickType(Workflow, ["id", "name", "active", "action", "reactions"])],
	})
	@ApiNotFoundResponse({
		description: "The workflow was not found",
	})
	@Get()
	async getWorkflows(@Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.getWorkflowsWithAreas(ownerId);
	}

	@ApiOkResponse({
		description: "The workflow were successfully retrieved",
		type: PickType(Workflow, ["id", "name", "active", "action", "reactions"]),
	})
	@ApiParam({
		description: "The UUID of the workflow to retrieve",
		name: "uuid",
	})
	@Get(":uuid")
	async getWorkflow(@Param() { uuid: workflowId }: UuidParamDto, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.getWorkflowWithAreas(workflowId, ownerId);
	}

	@ApiOkResponse({
		description: "The workflow was successfully updated",
	})
	@ApiResponse({
		status: HttpStatus.NOT_MODIFIED,
		description: "The workflow was not modified",
	})
	@ApiNotFoundResponse({
		description: "The workflow was not found",
	})
	@ApiConflictResponse({
		description: "A workflow with the same name already exists",
	})
	@ApiParam({
		description: "The UUID of the workflow to update",
		name: "uuid",
	})
	@Patch(":uuid")
	async updateWorkflow(
		@Param() { uuid: workflowId }: UuidParamDto,
		@Req() { user: { id: ownerId } }: APIRequest,
		@Body() updateWorkflowDto: UpdateWorkflowDto,
		@Res() response: Response,
	) {
		const result = await this.workspacesService.updateWorkflow(workflowId, updateWorkflowDto, ownerId);
		if (result) this.logger.log(`Updated workflow ${workflowId} with ${JSON.stringify(updateWorkflowDto)}`);
		else this.logger.warn(`No changes to workflow ${workflowId} made.`);
		return response.status(result ? HttpStatus.OK : HttpStatus.NOT_MODIFIED).send();
	}

	@ApiOkResponse({
		description: "The workflows were successfully toggled",
	})
	@ApiResponse({
		status: HttpStatus.NOT_MODIFIED,
		description: "The workflows provided didn't changed state",
	})
	@Patch("/toggle/bulk")
	async toggleWorkflows(
		@Body() { workflows, newState }: BulkToggleWorkflowsDto,
		@Req() { user: { id: ownerId } }: APIRequest,
		@Res() response: Response,
	) {
		const result = await this.workspacesService.toggleWorkflows(workflows, newState, ownerId);
		if (result) this.logger.log(`Toggled ${workflows.length}, or less, workflows to ${newState}`);
		else this.logger.warn(`No workflows toggled.`);
		return response.status(result ? HttpStatus.OK : HttpStatus.NOT_MODIFIED).send();
	}

	@ApiOkResponse({
		description: "The workflow was successfully toggled",
		schema: {
			properties: {
				newState: { type: "boolean" },
			},
		},
	})
	@ApiNotFoundResponse({
		description: "The workflow was not found",
	})
	@ApiParam({
		description: "The UUID of the workflow to toggle",
		name: "uuid",
	})
	@Patch("/toggle/:uuid")
	async toggleWorkflow(@Param() { uuid: workflowId }: UuidParamDto, @Req() { user: { id: ownerId } }: APIRequest) {
		return await this.workspacesService.toggleWorkflow(workflowId, ownerId);
	}

	@ApiOkResponse({
		description: "The workflows were successfully deleted",
	})
	@ApiNotFoundResponse({
		description: "The workflows you provided were not found",
	})
	@Delete("bulk")
	async deleteWorkflows(
		@Body() { workflows }: BulkWorkflowsDto,
		@Req() { user: { id: ownerId } }: APIRequest,
		@Res() response: Response,
	) {
		const result = await this.workspacesService.deleteWorkflows(workflows, ownerId);
		if (result) this.logger.log(`Deleted ${workflows.length}, or less, workflows`);
		else this.logger.warn(`No workflows deleted.`);
		return response.status(result ? HttpStatus.OK : HttpStatus.NOT_FOUND).send();
	}

	@ApiOkResponse({
		description: "The workflow was successfully deleted",
	})
	@ApiNotFoundResponse({
		description: "The workflow &was not found",
	})
	@ApiParam({
		description: "The UUID of the workflow to delete",
		name: "uuid",
	})
	@Delete(":uuid")
	async deleteWorkflow(
		@Param() { uuid: workflowId }: UuidParamDto,
		@Req() { user: { id: ownerId } }: APIRequest,
		@Res() response: Response,
	) {
		const result = await this.workspacesService.deleteWorkflow(workflowId, ownerId);
		if (result) this.logger.log(`Deleted workflow ${workflowId}`);
		else this.logger.warn(`Workflow ${workflowId} was not found.`);
		return response.status(result ? HttpStatus.OK : HttpStatus.NOT_FOUND).send();
	}
}
