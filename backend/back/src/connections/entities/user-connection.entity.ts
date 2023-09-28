import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import Service from "../../services/entities/service.entity";
import { User } from "../../users/entities/user.entity";
import ServiceScope from "../../services/entities/service-scope.entity";

@Entity()
export default class UserConnection {
	@PrimaryColumn()
	userId!: string;
	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user!: User;

	@PrimaryColumn()
	serviceId!: string;
	@ManyToOne(() => Service, { onDelete: "CASCADE" })
	service!: Service;

	@ManyToMany(() => ServiceScope, { onDelete: "CASCADE" })
	@JoinTable()
	scopes!: ServiceScope[];

	@Column()
	token!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@BeforeInsert()
	async beforeInsert() {
		console.log("this:", this);
	}

	@BeforeUpdate()
	async beforeUpdate() {
		console.log("this:", this);
	}
}
