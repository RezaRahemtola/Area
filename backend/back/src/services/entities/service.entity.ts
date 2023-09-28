import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Service {
	@PrimaryColumn()
	id: string;

	@Column()
	imageUrl: string;
}
