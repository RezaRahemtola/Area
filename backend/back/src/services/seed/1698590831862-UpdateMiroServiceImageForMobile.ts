import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMiroServiceImageForMobile1698590831862 implements MigrationInterface {
	private readonly PREVIOUS_MIRO_IMAGE = "https://asset.brandfetch.io/idAnDTFapY/idG4aRyg5R.svg";
	private readonly NEW_MIRO_IMAGE = "https://svgshare.com/i/z5s.svg";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
           SET image_url = '${this.NEW_MIRO_IMAGE}'
           WHERE id = 'miro'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
           SET image_url = '${this.PREVIOUS_MIRO_IMAGE}'
           WHERE id = 'miro'`,
		);
	}
}
