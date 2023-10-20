import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFacebookServiceWithScopes1697687427741 implements MigrationInterface {
	private readonly FACEBOOK_SERVICE_SCOPES = [
		"user_birthday",
		"user_likes",
		"user_payment_tokens",
		"user_photos",
		"user_videos",
		"user_friends",
		"user_posts",
		"email",
		"groups_show_list",
		"public_profile",
		"basic_info",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('facebook',
               'https://fr.m.wikipedia.org/wiki/Fichier:Facebook_f_logo_%282019%29.svg',
               'https://www.facebook.com/v18.0/dialog/oauth')`,
		);

		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.FACEBOOK_SERVICE_SCOPES.map((scope) => `('${scope}', 'facebook')`).join(", ")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'facebook'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'facebook'
         AND "id" IN (${this.FACEBOOK_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
