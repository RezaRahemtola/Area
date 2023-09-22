import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn({ type: "uuid" })
	id!: string;

	@Column({ unique: true })
	mail!: string;

	@Column({ name: "password_hash" })
	passwordHash!: string;

	@Column({ name: "totp_secret", nullable: true })
	totpSecret?: string;

	// TODO: Add plan
	// @ManyToOne(() => Plan)
	// plan!: Plan;

	@Column()
	isAdmin!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;
}
