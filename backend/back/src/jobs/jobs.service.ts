import { Injectable } from "@nestjs/common";
import { GrpcService } from "../grpc/grpc.service";

@Injectable()
export class JobsService {
	constructor(private readonly grpcService: GrpcService) {}
}
