import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDiscordServiceWithScopes1698325062489 implements MigrationInterface {
	private readonly DISCORD_SERVICE_SCOPES = [
		"activities.read",
		"activities.write",
		"applications.builds.read",
		"applications.builds.upload",
		"applications.commands",
		"applications.commands.update",
		"applications.commands.permissions.update",
		"applications.entitlements",
		"applications.store.update",
		"bot",
		"connections",
		"dm_channels.read",
		"email",
		"gdm.join",
		"guilds",
		"guilds.join",
		"guilds.members.read",
		"identify",
		"messages.read",
		"relationships.read",
		"role_connections.write",
		"rpc",
		"rpc.activities.write",
		"rpc.notifications.read",
		"rpc.voice.read",
		"rpc.voice.write",
		"voice",
		"webhook.incoming",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('discord',
               'https://asset.brandfetch.io/idM8Hlme1a/idHdpdABAN.svg',
               'https://discord.com/oauth2/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.DISCORD_SERVICE_SCOPES.map((scope) => `('${scope}', 'miro')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'miro'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'google'
         AND "id" IN (${this.DISCORD_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
