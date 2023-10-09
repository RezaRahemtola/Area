import { MigrationInterface, QueryRunner } from "typeorm";
import Service from "../entities/service.entity";

export class CreateTimerService1696814128392 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).save({
			id: "timer",
			imageUrl: "https://cdn-icons-png.flaticon.com/512/1571/1571810.png",
			oauthUrl: "",
		});
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).delete({ id: "timer" });
	}
}
