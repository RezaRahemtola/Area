export class JobData {
	name: string;
	identifier: string;
	params: unknown;
}

export class AuthenticatedJobData {
	name: string;
	identifier: string;
	params: unknown;
	auth: unknown;
}

export class JobListData {
	name: string;
	identifier: string;
	status: string;
}

export class JobList {
	jobs: JobListData[];
}

export class JobId {
	identifier: string;
}

export class GrpcResponse {
	error?: {
		code: number;
		message: string;
	};
}
