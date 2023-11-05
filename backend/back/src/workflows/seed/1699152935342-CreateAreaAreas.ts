import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateAreaAreas1699152935342 implements MigrationInterface {
	private readonly areaWorkspaceParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "workflowName",
			type: "short-text",
			required: true,
		},
	];

	private readonly areaAccountConnectParametersReturnFlow: string[] = ["service"];
	private readonly areaWorkspaceCreateParametersReturnFlow: string[] = ["name"];
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('disable-workflow', 'area', false, 'Disable a workflow', $1, '{}'),
                   ('enable-workflow', 'area', false, 'Enable a workflow', $1, '{}'),
                   ('on-account-connect', 'area', true, 'Triggers when a new OAuth account is connected', '[]', '{${this.areaAccountConnectParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-workflow-create', 'area', true, 'Triggers when a new workflow is created', '[]', '{${this.areaWorkspaceCreateParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-workflow-toggle', 'area', true, 'Triggers when a workflow is enabled', '[]', '{${this.areaWorkspaceCreateParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}')`,
			[JSON.stringify(this.areaWorkspaceParametersFormFlow)],
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'area'
				AND id IN ('disable-workflow', 'enable-workflow', 'on-account-connect', 'on-workflow-create', 'on-workflow-toggle')
             `,
		);
	}
}
