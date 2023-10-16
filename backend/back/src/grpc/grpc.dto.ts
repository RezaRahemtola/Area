export class JobData {
	name: string;
	identifier: string;
	params: unknown;
}

export class AuthenticatedJobData extends JobData {
	auth: unknown;
}

export class JobError {
	identifier: string;
	error: string;
	isAuthError: boolean;
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
