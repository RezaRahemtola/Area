import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityLogEntity1698986590525 implements MigrationInterface {
	name = "AddActivityLogEntity1698986590525";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "activity_log"
                             (
                                 "id"               uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                 "type"             character varying NOT NULL,
                                 "workflow_id"      uuid              NOT NULL,
                                 "created_at"       TIMESTAMP         NOT NULL DEFAULT now(),
                                 "workflow_area_id" uuid,
                                 CONSTRAINT "PK_067d761e2956b77b14e534fd6f1" PRIMARY KEY ("id")
                             )`);
		await queryRunner.query(`ALTER TABLE "activity_log"
        ADD CONSTRAINT "FK_a157eb51b2b1eb7f16729b120f0" FOREIGN KEY ("workflow_id") REFERENCES "workflow" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "activity_log"
        ADD CONSTRAINT "FK_7ddac78946d702aac791d08b113" FOREIGN KEY ("workflow_area_id") REFERENCES "workflow_area" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "activity_log"
        DROP CONSTRAINT "FK_7ddac78946d702aac791d08b113"`);
		await queryRunner.query(`ALTER TABLE "activity_log"
        DROP CONSTRAINT "FK_a157eb51b2b1eb7f16729b120f0"`);
		await queryRunner.query(`DROP TABLE "activity_log"`);
	}
}
