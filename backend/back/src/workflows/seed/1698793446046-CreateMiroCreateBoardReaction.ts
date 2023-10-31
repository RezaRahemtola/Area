import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateMiroCreateBoardReaction1698793446046 implements MigrationInterface {
	private readonly miroReactionsParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "name",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "long-text",
			required: true,
		},
	];

	private readonly miroReactionsParametersReturnFlow: string[] = ["createdAt", "url"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('create-board', 'miro', false, 'Creates a new board', $1, '{${this.miroReactionsParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}')`,
			[JSON.stringify(this.miroReactionsParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-board', 'miro', 'boards:write', 'miro')
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'miro'
                    AND id = 'create-board'`,
		);
	}
}
