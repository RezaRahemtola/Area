import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";
import ServiceScope from "./service-scope.entity";

@Entity()
export default class Area {
	@PrimaryColumn()
	id!: string;

	@PrimaryColumn()
	serviceId!: string;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;

	@Column()
	isAction!: boolean;

	@ManyToMany(() => ServiceScope, { onDelete: "SET NULL" })
	@JoinTable()
	serviceScopesNeeded!: ServiceScope[];
}
