import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserSettingsLanguageEnumAndAddAreaDefaultParameterReturnFlowValue1698986506624
	implements MigrationInterface
{
	name = "ChangeUserSettingsLanguageEnumAndAddAreaDefaultParameterReturnFlowValue1698986506624";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "public"."user_settings_language_enum" RENAME TO "user_settings_language_enum_old"`,
		);
		await queryRunner.query(`CREATE TYPE "public"."user_settings_language_enum" AS ENUM('en', 'fr', 'is')`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" TYPE "public"."user_settings_language_enum" USING "language"::"text"::"public"."user_settings_language_enum"`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" SET DEFAULT 'en'`);
		await queryRunner.query(`DROP TYPE "public"."user_settings_language_enum_old"`);
		await queryRunner.query(`ALTER TABLE "area"
        ALTER COLUMN "parameters_return_flow" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "user_connection"
        ALTER COLUMN "data" DROP DEFAULT`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user_connection"
        ALTER COLUMN "data" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "area"
        ALTER COLUMN "parameters_return_flow" SET DEFAULT ARRAY []`);
		await queryRunner.query(
			`CREATE TYPE "public"."user_settings_language_enum_old" AS ENUM('en', 'fr', 'de', 'es', 'pt', 'it', 'nl')`,
		);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" TYPE "public"."user_settings_language_enum_old" USING "language"::"text"::"public"."user_settings_language_enum_old"`);
		await queryRunner.query(`ALTER TABLE "user_settings"
        ALTER COLUMN "language" SET DEFAULT 'en'`);
		await queryRunner.query(`DROP TYPE "public"."user_settings_language_enum"`);
		await queryRunner.query(
			`ALTER TYPE "public"."user_settings_language_enum_old" RENAME TO "user_settings_language_enum"`,
		);
	}
}
