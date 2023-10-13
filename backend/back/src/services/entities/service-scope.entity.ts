import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "./service.entity";
import { ServiceName } from "../services.service";

@Entity()
export default class ServiceScope {
	@PrimaryColumn()
	id!: string;

	@PrimaryColumn()
	serviceId!: ServiceName;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;
}
