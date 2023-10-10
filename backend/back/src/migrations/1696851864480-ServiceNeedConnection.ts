import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceNeedConnection1696851864480 implements MigrationInterface {
	name = "ServiceNeedConnection1696851864480";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "service"
        ADD "need_connection" boolean NOT NULL DEFAULT true`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "service"
        DROP COLUMN "need_connection"`);
	}
}
