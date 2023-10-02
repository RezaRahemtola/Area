import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";

@Entity()
export default class ServiceScope {
	@PrimaryColumn()
	id!: string;

	@PrimaryColumn()
	serviceId!: string;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;
}
