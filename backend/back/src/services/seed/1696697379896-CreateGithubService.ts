import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGithubService1696697379896 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('github',
               'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
               'https://github.com/login/oauth/authorize')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'github'`,
		);
	}
}
