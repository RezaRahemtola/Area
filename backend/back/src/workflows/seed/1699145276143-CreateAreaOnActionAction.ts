import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAreaOnActionAction1699145276143 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-action', 'area', true, 'Triggers when a workflow''s action is triggered', '[]', '{}')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'area'
				AND id IN ('on-action');
             `,
		);
	}
}
