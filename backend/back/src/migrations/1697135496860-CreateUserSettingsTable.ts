import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSettingsTable1697135496860 implements MigrationInterface {
	name = "CreateUserSettingsTable1697135496860";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."user_settings_language_enum" AS ENUM('en', 'fr', 'de', 'es', 'pt', 'it', 'nl')`,
		);
		await queryRunner.query(`CREATE TYPE "public"."user_settings_theme_enum" AS ENUM('light', 'dark', 'auto')`);
		await queryRunner.query(`CREATE TABLE "user_settings"
                             (
                                 "user_id"  uuid                                   NOT NULL,
                                 "language" "public"."user_settings_language_enum" NOT NULL DEFAULT 'en',
                                 "theme"    "public"."user_settings_theme_enum"    NOT NULL DEFAULT 'auto',
                                 CONSTRAINT "PK_4ed056b9344e6f7d8d46ec4b302" PRIMARY KEY ("user_id")
                             )`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user_settings"
        DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
		await queryRunner.query(`DROP TABLE "user_settings"`);
		await queryRunner.query(`DROP TYPE "public"."user_settings_theme_enum"`);
		await queryRunner.query(`DROP TYPE "public"."user_settings_language_enum"`);
	}
}
