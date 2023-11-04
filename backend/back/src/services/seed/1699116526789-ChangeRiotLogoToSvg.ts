import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRiotLogoToSvg1699116526789 implements MigrationInterface {
	private readonly PREVIOUS_MIRO_IMAGE = "https://i.pinimg.com/originals/90/6d/23/906d231cbaff55c77fb97191592e1c76.png";
	private readonly NEW_MIRO_IMAGE = "https://asset.brandfetch.io/idtxF1ugCc/idSaLQdGtL.svg";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
           SET image_url = '${this.NEW_MIRO_IMAGE}'
           WHERE id = 'riot'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE service
           SET image_url = '${this.PREVIOUS_MIRO_IMAGE}'
           WHERE id = 'riot'`,
		);
	}
}
