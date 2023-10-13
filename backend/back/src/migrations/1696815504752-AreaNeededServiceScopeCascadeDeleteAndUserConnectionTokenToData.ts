import { MigrationInterface, QueryRunner } from "typeorm";

export class AreaNeededServiceScopeCascadeDeleteAndUserConnectionTokenToData1696815504752
	implements MigrationInterface
{
	name = "AreaNeededServiceScopeCascadeDeleteAndUserConnectionTokenToData1696815504752";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "area_service_scopes_needed_service_scope"
        DROP CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2"`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        RENAME COLUMN "token" TO "data"`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        DROP COLUMN "data"`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        ADD "data" jsonb NOT NULL default '{}'`);
		await queryRunner.query(`ALTER TABLE "area_service_scopes_needed_service_scope"
        ADD CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2" FOREIGN KEY ("area_id", "area_service_id") REFERENCES "area" ("id", "service_id") ON DELETE CASCADE ON UPDATE CASCADE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "area_service_scopes_needed_service_scope"
        DROP CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2"`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        DROP COLUMN "data"`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        ADD "data" character varying NOT NULL default 'unknown'`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        RENAME COLUMN "data" TO "token"`);
		await queryRunner.query(`ALTER TABLE "area_service_scopes_needed_service_scope"
        ADD CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2" FOREIGN KEY ("area_id", "area_service_id") REFERENCES "area" ("id", "service_id") ON DELETE SET NULL ON UPDATE CASCADE`);
	}
}
