import { MigrationInterface, QueryRunner } from "typeorm";
import Service from "../entities/service.entity";

export class CreateGithubService1696697379896 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).save({
			id: "github",
			imageUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
			oauthUrl: "https://github.com/login/oauth/authorize",
		});
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).delete({ id: "github" });
	}
}
