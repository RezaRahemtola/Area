import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTimerService1696814128392 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url", "need_connection")
       VALUES ('timer',
               'https://cdn-icons-png.flaticon.com/512/1571/1571810.png',
               '',
               false)`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'timer'`,
		);
	}
}
