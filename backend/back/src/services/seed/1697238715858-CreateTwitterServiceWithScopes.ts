import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTwitterServiceWithScopes1697238715858 implements MigrationInterface {
	private readonly TWITTER_SERVICE_SCOPES = [
		"tweet.read",
		"tweet.write",
		"tweet.moderate.write",
		"users.read",
		"follows.read",
		"follows.write",
		"offline.access",
		"space.read",
		"mute.read",
		"mute.write",
		"like.read",
		"like.write",
		"list.read",
		"list.write",
		"block.read",
		"block.write",
		"bookmark.read",
		"bookmark.write",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('twitter',
               'https://cdn.cms-twdigitalassets.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.2560.png',
               'https://twitter.com/i/oauth2/authorize')`,
		);

		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.TWITTER_SERVICE_SCOPES.map((scope) => `('${scope}', 'twitter')`).join(", ")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'twitter'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'twitter'
         AND "id" IN (${this.TWITTER_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
