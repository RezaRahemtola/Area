import { MigrationInterface, QueryRunner } from "typeorm";

export class AreaParametersFlowAndDescription1697044261933 implements MigrationInterface {
	name = "AreaParametersFlowAndDescription1697044261933";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "area"
        ADD "parameters_form_flow" jsonb NOT NULL DEFAULT '[]'`);
		await queryRunner.query(`ALTER TABLE "area"
        ADD "description" character varying NOT NULL DEFAULT 'An area description'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "area"
        DROP COLUMN "description"`);
		await queryRunner.query(`ALTER TABLE "area"
        DROP COLUMN "parameters_form_flow"`);
	}
}
