import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSettingsTable1697118595345 implements MigrationInterface {
	name = "CreateUserSettingsTable1697118595345";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "user_settings"
                             (
                                 "user_id"  uuid              NOT NULL,
                                 "language" character varying NOT NULL DEFAULT 'en',
                                 "theme"    character varying NOT NULL DEFAULT 'auto',
                                 CONSTRAINT "PK_4ed056b9344e6f7d8d46ec4b302" PRIMARY KEY ("user_id")
                             )`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user_settings"
        DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
		await queryRunner.query(`DROP TABLE "user_settings"`);
	}
}
