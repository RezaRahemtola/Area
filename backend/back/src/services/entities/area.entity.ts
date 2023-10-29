import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";
import ServiceScope from "./service-scope.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ParametersFormFlowFieldDto } from "../dto/area.dto";
import { ServiceName } from "../services.service";

@Entity()
export default class Area {
	@ApiProperty()
	@PrimaryColumn()
	id!: string;

	@PrimaryColumn()
	serviceId!: ServiceName;
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
	parametersFormFlow!: ParametersFormFlowFieldDto[];

	@ApiProperty()
	@Column({ array: true, type: "text", default: [] })
	parametersReturnFlow!: string[];

	@ApiProperty()
	@Column({ default: "An area description" })
	description!: string;
}
