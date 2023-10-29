import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateLinearCreateIssueAreas1698614949784 implements MigrationInterface {
	private readonly linearOnIssueParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "workspace",
			type: "short-text",
			required: true,
		},
	];

	private readonly linearCreateIssueParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "title",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "long-text",
			required: true,
		},
		{
			name: "estimate",
			type: "integer",
			required: false,
		},
		{
			name: "priority",
			type: "select",
			required: false,
			values: ["Low", "Medium", "High", "Urgent"],
		},
	];

	private readonly linearOnIssueParametersReturnFlow: string[] = [
		"assignee",
		"createdAt",
		"cycleName",
		"cycleNumber",
		"description",
		"number",
		"priorityLabel",
		"state",
		"title",
		"url",
	];

	private readonly linearCreateIssueParametersReturnFlow: string[] = ["url"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-issue-create', 'linear', true, 'Triggers when an issue is created on a Linear workspace', $1, '{${this.linearOnIssueParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}'),
                   ('create-issue', 'linear', false, 'Create an issue on a Linear workspace', $2, '{${this.linearCreateIssueParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}')`,
			[JSON.stringify(this.linearOnIssueParametersFormFlow), JSON.stringify(this.linearCreateIssueParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-issue', 'linear', 'issues:create', 'linear')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'linear'
                    AND id IN ('on-issue-create', 'create-issue')`,
		);
	}
}
