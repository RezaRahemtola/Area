import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";
import ServiceScope from "./service-scope.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export default class Area {
	@ApiProperty()
	@PrimaryColumn()
	id!: string;

	@PrimaryColumn()
	serviceId!: string;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;

	@ApiProperty()
	@Column()
	isAction!: boolean;

	@ManyToMany(() => ServiceScope, { onDelete: "SET NULL" })
	@JoinTable()
	serviceScopesNeeded!: ServiceScope[];
}
