export class JobData {
	name: string;
	identifier: string;
	params: object;
}

export class GrpcResponse {
	error?: {
		code: number;
		message: string;
	};
}
