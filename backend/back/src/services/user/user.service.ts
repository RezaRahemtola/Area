import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

type UserGetOptions = { id: string } | { mail: string };

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

	getUser(options: UserGetOptions): Promise<User | null> {
		return this.userRepository.findOne({ where: options });
	}

	updateUser(options: UserGetOptions, update: UpdateUserDto): Promise<boolean> {
		return this.userRepository
			.update(options, update)
			.then(() => true)
			.catch(() => false);
	}

	deleteUser(options: UserGetOptions): Promise<boolean> {
		return this.userRepository
			.delete(options)
			.then(() => true)
			.catch(() => false);
	}
}
