import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import Service from "../../services/entities/service.entity";
import { User } from "../../users/entities/user.entity";
import ServiceScope from "../../services/entities/service-scope.entity";
import { ServiceName } from "../../services/services.service";

@Entity()
export default class UserConnection {
	@PrimaryColumn()
	userId!: string;
	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user!: User;

	@PrimaryColumn()
	serviceId!: ServiceName;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;

	@ManyToMany(() => ServiceScope, { onDelete: "CASCADE" })
	@JoinTable()
	scopes!: ServiceScope[];

	@Column({ type: "jsonb" })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data!: any;

	@CreateDateColumn()
	createdAt!: Date;
}
