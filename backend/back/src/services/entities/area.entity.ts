import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";
import ServiceScope from "./service-scope.entity";
import { ApiProperty } from "@nestjs/swagger";

type ParametersFormFlowFieldType =
	| "email"
	| "short-text"
	| "long-text"
	| "integer"
	| "float"
	| "date"
	| "datetime"
	| "time";
type ParametersFormFlowField = {
	for: string;
	type: ParametersFormFlowFieldType;
	required: boolean;
};

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

	@ManyToMany(() => ServiceScope, { onDelete: "CASCADE" })
	@JoinTable()
	serviceScopesNeeded!: ServiceScope[];

	@ApiProperty()
	@Column({ type: "jsonb", default: [] })
	parametersFormFlow!: Array<ParametersFormFlowField>;

	@ApiProperty()
	@Column({ default: "An area description" })
	description!: string;
}
