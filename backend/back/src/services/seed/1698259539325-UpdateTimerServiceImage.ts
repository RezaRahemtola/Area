import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimerServiceImage1698259539325 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
       SET image_url = 'https://www.svgrepo.com/show/22488/hourglass.svg'
       WHERE id = 'timer'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
       SET image_url = 'https://cdn-icons-png.flaticon.com/512/1571/1571810.png'
       WHERE id = 'timer'`,
		);
	}
}
