import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

type UserIdentification = { id: string } | { mail: string };

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	createUser(mail: string, passwordHash: string, isAdmin: boolean = false): Promise<boolean> {
		return this.userRepository
			.insert({ mail, passwordHash, isAdmin })
			.then(() => true)
			.catch(() => false);
	}

	getUser(options: UserIdentification): Promise<User | null> {
		return this.userRepository.findOne({ where: options });
	}

	async updateUser(options: UserIdentification, update: UpdateUserDto): Promise<boolean> {
		try {
			if (!(await this.userRepository.exist({ where: options }))) return false;
			return (await this.userRepository.update(options, update)).affected > 0;
		} catch (error) {
			return false;
		}
	}

	async deleteUser(options: UserIdentification): Promise<boolean> {
		try {
			if (!(await this.userRepository.exist({ where: options }))) return false;
			return (await this.userRepository.delete(options)).affected > 0;
		} catch {
			return false;
		}
	}
}
