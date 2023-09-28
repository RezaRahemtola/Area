import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import ServiceScope from "./service-scope.entity";

@Entity()
export default class Service {
	@PrimaryColumn()
	id!: string;

	@Column()
	imageUrl!: string;

	@OneToMany(() => ServiceScope, (scope) => scope.service)
	scopes!: ServiceScope[];
}
