import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import ServiceScope from "./service-scope.entity";
import Area from "./area.entity";

@Entity()
export default class Service {
	@PrimaryColumn()
	id!: string;

	@Column()
	imageUrl!: string;

	@Column()
	oauthUrl!: string;

	@OneToMany(() => ServiceScope, (scope) => scope.service)
	scopes!: ServiceScope[];

	@OneToMany(() => Area, (area) => area.service)
	areas!: Area[];
}
