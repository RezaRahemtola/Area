import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePasswordHashNullable1698408481880 implements MigrationInterface {
	name = "MakePasswordHashNullable1698408481880";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "password_hash" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "password_hash" SET NOT NULL`);
	}
}
