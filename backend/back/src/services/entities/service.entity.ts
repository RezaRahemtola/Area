import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import ServiceScope from "./service-scope.entity";
import Area from "./area.entity";
import { ServiceName } from "../services.service";

@Entity()
export default class Service {
	@PrimaryColumn()
	id!: ServiceName;

	@Column()
	imageUrl!: string;

	@Column()
	oauthUrl!: string;

	@OneToMany(() => ServiceScope, (scope) => scope.service)
	scopes!: ServiceScope[];

	@OneToMany(() => Area, (area) => area.service)
	areas!: Area[];

	@Column({ default: true, nullable: false })
	needConnection!: boolean;
}
