import { In, MigrationInterface, QueryRunner } from "typeorm";
import ServiceScope from "../entities/service-scope.entity";

export class CreateServiceScopes1696697647435 implements MigrationInterface {
	private readonly serviceScopes: Array<Partial<ServiceScope>> = [
		{
			id: "repo",
			serviceId: "github",
		},
		{
			id: "repo:status",
			serviceId: "github",
		},
		{
			id: "repo_deployment",
			serviceId: "github",
		},
		{
			id: "public_repo",
			serviceId: "github",
		},
		{
			id: "repo:invite",
			serviceId: "github",
		},
		{
			id: "security_events",
			serviceId: "github",
		},
		{
			id: "admin:repo_hook",
			serviceId: "github",
		},
		{
			id: "write:repo_hook",
			serviceId: "github",
		},
		{
			id: "read:repo_hook",
			serviceId: "github",
		},
		{
			id: "admin:org",
			serviceId: "github",
		},
		{
			id: "write:org",
			serviceId: "github",
		},
		{
			id: "read:org",
			serviceId: "github",
		},
		{
			id: "admin:public_key",
			serviceId: "github",
		},
		{
			id: "write:public_key",
			serviceId: "github",
		},
		{
			id: "read:public_key",
			serviceId: "github",
		},
		{
			id: "admin:org_hook",
			serviceId: "github",
		},
		{
			id: "gist",
			serviceId: "github",
		},
		{
			id: "notifications",
			serviceId: "github",
		},
		{
			id: "user",
			serviceId: "github",
		},
		{
			id: "read:user",
			serviceId: "github",
		},
		{
			id: "user:email",
			serviceId: "github",
		},
		{
			id: "user:follow",
			serviceId: "github",
		},
		{
			id: "project",
			serviceId: "github",
		},
		{
			id: "read:project",
			serviceId: "github",
		},
		{
			id: "delete_repo",
			serviceId: "github",
		},
		{
			id: "write:packages",
			serviceId: "github",
		},
		{
			id: "read:packages",
			serviceId: "github",
		},
		{
			id: "delete:packages",
			serviceId: "github",
		},
		{
			id: "admin:gpg_key",
			serviceId: "github",
		},
		{
			id: "write:gpg_key",
			serviceId: "github",
		},
		{
			id: "read:gpg_key",
			serviceId: "github",
		},
		{
			id: "codespace",
			serviceId: "github",
		},
		{
			id: "workflow",
			serviceId: "github",
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(ServiceScope).save(this.serviceScopes);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const serviceIds = new Set(this.serviceScopes.map(({ serviceId }) => serviceId));

		for (const serviceId of serviceIds) {
			await queryRunner.manager.getRepository(ServiceScope).delete({
				id: In(this.serviceScopes.filter((scope) => scope.serviceId === serviceId).map(({ id }) => id)),
				serviceId,
			});
		}
	}
}
