import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDiscordOnGuildJoinAction1699140593736 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow",
                           "parameters_return_flow")
       VALUES ('on-guild-join', 'discord', true, 'Fired when the user join a guild on discord.', '[]', '{}')`,
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id",
                                                               "service_scope_service_id")
       VALUES ('on-guild-join', 'discord', 'guilds', 'discord')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE service_id = 'discord'
         AND id IN ('on-guild-join');
			`,
		);
	}
}
