import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Service from "./entities/service.entity";
import { Repository } from "typeorm";

@Injectable()
export class ServicesService {
	constructor(
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
	) {}

	async getServices() {
		return this.serviceRepository.find();
	}
}
