import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { ConfigService } from "@nestjs/config";
import { GrpcService } from "../../grpc/grpc.service";

type LinearBodyActions = "create" | "update";

type LinearBaseBody = {
	action: LinearBodyActions;
	createdAt: string;
	url: string;
};

type LinearIssueBody = LinearBaseBody & {
	type: "Issue";
	data: {
		number: number;
		title: string;
		description?: string;
		url: string;
		priorityLabel?: string;
		assignee?: {
			name: string;
		};
		cycle?: {
			name: string;
			number: string;
		};
		state?: {
			name: string;
		};
	};
};

type LinearProjectBody = LinearBaseBody & {
	type: "Project";
	data: {
		name: string;
		description: string;
		state: string;
		startDate: string;
		targetDate: string;
	};
};

type LinearCommentBody = LinearBaseBody & {
	type: "Comment";
	data: {
		body: string;
		issue: {
			name: string;
		};
		user: {
			name: string;
		};
	};
};

type LinearWebhookBody = LinearIssueBody | LinearProjectBody | LinearCommentBody;

@Injectable()
export class LinearWebhookService {
	private readonly webhookSecret: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly grpcService: GrpcService,
	) {
		this.webhookSecret = this.configService.getOrThrow<string>("LINEAR_WEBHOOK_SECRET");
	}

	verifySignature(signature: string, body: unknown) {
		const hmac = createHmac("sha256", this.webhookSecret).update(JSON.stringify(body)).digest("hex");
		const trusted = Buffer.from(hmac, "ascii");
		const untrusted = Buffer.from(signature, "ascii");
		return timingSafeEqual(trusted, untrusted);
	}

	getIssueAction(body: LinearIssueBody): string | null {
		switch (body.action) {
			case "create":
				return "linear-on-issue-create";
			case "update":
				return "linear-on-issue-update";
			default:
				return null;
		}
	}

	getProjectAction(body: LinearProjectBody): string | null {
		switch (body.action) {
			case "create":
				return "linear-on-project-create";
			case "update":
				return "linear-on-project-update";
			default:
				return null;
		}
	}

	getCommentAction(body: LinearCommentBody): string | null {
		switch (body.action) {
			case "create":
				return "linear-on-comment-create";
			default:
				return null;
		}
	}

	getWorkspace(url: string): string {
		const baseUrl = "https://linear.app/";
		const croppedUrl = url.substring(baseUrl.length);
		const nextSlash = croppedUrl.indexOf("/");

		if (nextSlash === -1) {
			return croppedUrl;
		}
		return croppedUrl.substring(0, nextSlash);
	}

	identifierFromRepo(action: string, workspace: string) {
		return `${action}-${workspace}`;
	}

	async parseBody(body: LinearWebhookBody) {
		let action: string;

		switch (body.type) {
			case "Issue":
				action = this.getIssueAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, this.getWorkspace(body.url)),
						params: {
							url: body.data.url,
							title: body.data.title,
							description: body.data.description,
							createdAt: body.createdAt,
							number: body.data.number,
							priorityLabel: body.data.priorityLabel,
							assignee: body.data.assignee?.name,
							cycleName: body.data.cycle?.name,
							cycleNumber: body.data.cycle?.number,
							state: body.data.state?.name,
						},
					});
				}
				break;

			case "Project":
				action = this.getProjectAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, this.getWorkspace(body.url)),
						params: {
							url: body.url,
							name: body.data.name,
							description: body.data.description,
							createdAt: body.createdAt,
							state: body.data.state,
							startDate: body.data.startDate,
							targetDate: body.data.targetDate,
						},
					});
				}
				break;

			case "Comment":
				action = this.getCommentAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, this.getWorkspace(body.url)),
						params: {
							url: body.url,
							body: body.data.body,
							createdAt: body.createdAt,
							issue: body.data.issue.name,
							author: body.data.user.name,
						},
					});
				}
				break;
		}
	}

	async onLinearWebhook(signature: string, body: unknown): Promise<void> {
		if (!this.verifySignature(signature, body)) {
			throw new UnauthorizedException("Invalid signature");
		}
		await this.parseBody(body as LinearWebhookBody);
	}
}
