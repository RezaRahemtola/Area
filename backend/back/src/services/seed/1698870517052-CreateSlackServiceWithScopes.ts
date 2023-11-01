import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSlackServiceWithScopes1698870517052 implements MigrationInterface {
	private readonly SLACK_SERVICE_SCOPES = [
		"admin",
		"admin.analytics:read",
		"admin.app_activities:read",
		"admin.apps:read",
		"admin.apps:write",
		"admin.barriers:read",
		"admin.barriers:write",
		"admin.conversations:read",
		"admin.conversations:write",
		"admin.invites:read",
		"admin.invites:write",
		"admin.roles:read",
		"admin.roles:write",
		"admin.teams:read",
		"admin.teams:write",
		"admin.usergroups:read",
		"admin.usergroups:write",
		"admin.users:read",
		"admin.users:write",
		"admin.workflows:read",
		"admin.workflows:write",
		"auditlogs:read",
		"bookmarks:read",
		"bookmarks:write",
		"calls:read",
		"calls:write",
		"channels:history",
		"channels:read",
		"channels:write",
		"channels:write.invites",
		"channels:write.topic",
		"chat:write",
		"chat:write:bot",
		"chat:write:user",
		"commands",
		"dnd:read",
		"dnd:write",
		"email",
		"emoji:read",
		"files:read",
		"files:write",
		"files:write:user",
		"groups:history",
		"groups:read",
		"groups:write",
		"groups:write.invites",
		"groups:write.topic",
		"identity.avatar",
		"identity.basic",
		"identity.email",
		"identity.team",
		"im:history",
		"im:read",
		"im:write",
		"incoming-webhook",
		"links.embed:write",
		"links:read",
		"links:write",
		"mpim:history",
		"mpim:read",
		"mpim:write",
		"mpim:write.invites",
		"mpim:write.topic",
		"openid",
		"pins:read",
		"pins:write",
		"profile",
		"reactions:read",
		"reactions:write",
		"reminders:read",
		"reminders:write",
		"remote_files:read",
		"remote_files:share",
		"search:read",
		"stars:read",
		"stars:write",
		"team.billing:read",
		"team.preferences:read",
		"team:read",
		"tokens.basic",
		"usergroups:read",
		"usergroups:write",
		"users.profile:read",
		"users.profile:write",
		"users:read",
		"users:read.email",
		"users:write",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('slack',
               'https://asset.brandfetch.io/idJ_HhtG0Z/idr0eyz8Xo.svg',
               'https://slack.com/oauth/v2/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.SLACK_SERVICE_SCOPES.map((scope) => `('${scope}', 'slack')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'slack'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'slack'
         AND "id" IN (${this.SLACK_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
