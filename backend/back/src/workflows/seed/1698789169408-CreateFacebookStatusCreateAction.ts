import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateFacebookStatusCreateAction1698789169408 implements MigrationInterface {
	private readonly facebookActionsParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "pageId",
			type: "short-text",
			required: true,
		},
	];

	private readonly facebookActionsParametersReturnFlow: string[] = ["author", "createdAt", "message"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-status-create', 'facebook', true, 'Triggers when the status of a Facebook page is updated', $1, '{${this.facebookActionsParametersFormFlow
							.map((v) => `"${v}"`)
							.join(",")}}')`,
			[JSON.stringify(this.facebookActionsParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('on-status-create', 'facebook', 'user_posts', 'facebook')
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'facebook'
                    AND id = 'on-status-create'`,
		);
	}
}
