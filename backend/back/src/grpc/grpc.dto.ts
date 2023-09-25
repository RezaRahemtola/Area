export class JobData {
	name: string;
	identifier: string;
	params: unknown;
}

export class GrpcResponse {
	error?: {
		code: number;
		message: string;
	};
}
