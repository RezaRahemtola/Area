import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAddScopeToLinearOnIssueCreate1699190007820 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('on-issue-create', 'linear', 'read', 'linear')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area_service_scopes_needed_service_scope"
            WHERE "area_id" = 'on-issue-create' AND "area_service_id" = 'linear' AND "service_scope_id" = 'read' AND "service_scope_service_id" = 'linear'`,
		);
	}
}
