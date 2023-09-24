import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { AreaData } from "./grpc.dto";

interface WorkerService {
	launchJob(data: AreaData): Observable<any>
}

@Injectable()
export class GrpcService implements OnModuleInit {
	private workerService: WorkerService;

	constructor(
		@Inject("WORKER_PACKAGE") private readonly client: ClientGrpc
	) {}

	onModuleInit() {
		this.workerService = this.client.getService<WorkerService>("AreaWorkerService");
	}

	launchJob(name: string, params: Object): Observable<any> {
		return this.workerService.launchJob({ name, params })
	}
}
