import { In, MigrationInterface, QueryRunner } from "typeorm";
import Service from "../entities/service.entity";

export class CreateServices1696697379896 implements MigrationInterface {
	private readonly services: Array<Partial<Service>> = [
		{
			id: "github",
			imageUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
			oauthUrl: "https://github.com/login/oauth/authorize",
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).save(this.services);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Service).delete({ id: In(this.services.map(({ id }) => id)) });
	}
}
