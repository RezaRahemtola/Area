import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowAreaJobId1696791202100 implements MigrationInterface {
	name = "WorkflowAreaJobId1696791202100";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "workflow_area"
        ADD "job_id" character varying NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "workflow_area"
        DROP COLUMN "job_id"`);
	}
}
