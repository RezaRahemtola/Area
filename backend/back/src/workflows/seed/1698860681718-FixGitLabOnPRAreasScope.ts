import { MigrationInterface, QueryRunner } from "typeorm";

export class FixGitLabOnPRAreasScope1698860681718 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        UPDATE "area_service_scopes_needed_service_scope"
        SET "area_id" = 'on-pull-request-reopen'
        WHERE area_id = 'on-pull-request-merge'
          AND area_service_id = 'gitlab'
		`);

		await queryRunner.query(`
        UPDATE "area_service_scopes_needed_service_scope"
        SET "area_service_id" = 'gitlab'
        WHERE area_id = 'on-pull-request-merge'
          AND area_service_id = 'github'
          AND service_scope_id = 'api'
          AND service_scope_service_id = 'gitlab'
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        UPDATE "area_service_scopes_needed_service_scope"
        SET "area_id" = 'on-pull-request-merge'
        WHERE area_id = 'on-pull-request-reopen'
          AND area_service_id = 'gitlab'
		`);

		await queryRunner.query(`
        UPDATE "area_service_scopes_needed_service_scope"
        SET "area_service_id" = 'github'
        WHERE area_id = 'on-pull-request-merge'
          AND area_service_id = 'gitlab'
          AND service_scope_id = 'api'
          AND service_scope_service_id = 'gitlab'
		`);
	}
}
