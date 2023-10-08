import { In, MigrationInterface, QueryRunner } from "typeorm";
import ServiceScope from "../entities/service-scope.entity";

export class CreateGithubServiceScopes1696697647435 implements MigrationInterface {
	private readonly GITHUB_SERVICE_SCOPES: Array<string> = [
		"repo",
		"repo:status",
		"repo_deployment",
		"public_repo",
		"repo:invite",
		"security_events",
		"admin:repo_hook",
		"write:repo_hook",
		"read:repo_hook",
		"admin:org",
		"write:org",
		"read:org",
		"admin:public_key",
		"write:public_key",
		"read:public_key",
		"admin:org_hook",
		"gist",
		"notifications",
		"user",
		"read:user",
		"user:email",
		"user:follow",
		"project",
		"read:project",
		"delete_repo",
		"write:packages",
		"read:packages",
		"delete:packages",
		"admin:gpg_key",
		"write:gpg_key",
		"read:gpg_key",
		"codespace",
		"workflow",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(ServiceScope).save(
			this.GITHUB_SERVICE_SCOPES.map((id) => ({
				id,
				serviceId: "github",
			})),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(ServiceScope).delete({
			id: In(this.GITHUB_SERVICE_SCOPES),
			serviceId: "github",
		});
	}
}
