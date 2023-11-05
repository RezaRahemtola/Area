import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateLinearProjectCommentAREAs1699202040386 implements MigrationInterface {
	private readonly linearWorkspaceParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "workspace",
			type: "short-text",
			required: true,
		},
	];

	private readonly linearCreateProjectParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "name",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "long-text",
			required: false,
		},
	];

	private readonly linearCreateCommentParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "body",
			type: "long-text",
			required: true,
		},
		{
			name: "issueNumber",
			type: "integer",
			required: true,
		},
	];

	private readonly linearUrlParametersReturnFlow: string[] = ["url"];
	private readonly linearProjectActionsParametersReturnFlow: string[] = [
		...this.linearUrlParametersReturnFlow,
		"name",
		"description",
		"createdAt",
		"state",
		"startDate",
		"targetDate",
	];
	private readonly linearCommentActionsParametersReturnFlow: string[] = [
		...this.linearUrlParametersReturnFlow,
		"body",
		"createdAt",
		"issue",
		"author",
	];
	private readonly linearIssueParametersReturnFlow: string[] = [
		...this.linearUrlParametersReturnFlow,
		"assignee",
		"createdAt",
		"cycleName",
		"cycleNumber",
		"description",
		"number",
		"priorityLabel",
		"state",
		"title",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-comment-create', 'linear', true, 'Triggers when a comment is created on a Linear issue', $1, '{${this.linearCommentActionsParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}'),
                   ('on-issue-update', 'linear', true, 'Triggers when a Linear issue is updated', $1, '{${this.linearIssueParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-project-create', 'linear', true, 'Triggers when a Linear project is created', $1, '{${this.linearProjectActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-project-update', 'linear', true, 'Triggers when a Linear project is updated', $1, '{${this.linearProjectActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('create-project', 'linear', false, 'Create a project on a Linear workspace', $2, '{${this.linearUrlParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('create-comment', 'linear', false, 'Post a comment on a Linear issue', $3, '{}')`,
			[
				JSON.stringify(this.linearWorkspaceParametersFormFlow),
				JSON.stringify(this.linearCreateProjectParametersFormFlow),
				JSON.stringify(this.linearCreateCommentParametersFormFlow),
			],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('on-comment-create', 'linear', 'read', 'linear'),
                   ('on-issue-update', 'linear', 'read', 'linear'),
                   ('on-project-create', 'linear', 'read', 'linear'),
                   ('on-project-update', 'linear', 'read', 'linear'),
                   ('create-project', 'linear', 'write', 'linear'),
                   ('create-comment', 'linear', 'write', 'linear')
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'linear'
                    AND id IN ('on-comment-create', 'on-issue-update', 'on-project-create', 'on-project-update', 'create-comment', 'create-project')`,
		);
	}
}
