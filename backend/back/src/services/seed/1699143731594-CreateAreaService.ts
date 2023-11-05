import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAreaService1699143731594 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url", "need_connection")
       VALUES ('area',
               'https://svgshare.com/i/zHw.svg',
               '',
               false)`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'area'`,
		);
	}
}
