import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GrpcService } from "../../grpc/grpc.service";
import { createHmac, timingSafeEqual } from "crypto";
import { ConfigService } from "@nestjs/config";

type GithubActions = "opened" | "reopened" | "closed";

type GithubWebhookBody = {
	action: GithubActions;
	issue?: {
		html_url: string;
		title: string;
		body: string;
		created_at: string;
	};
	repository: {
		full_name: string;
	};
	sender: {
		login: string;
	};
};

const GithubTriggers: Record<string, Record<string, string>> = {
	issues: {
		opened: "github-on-issue-create",
		closed: "github-on-issue-close",
		reopened: "github-on-issue-reopen",
	},
};

@Injectable()
export class GithubWebhookService {
	private readonly webhookSecret: string;

	constructor(
		private readonly grpcService: GrpcService,
		private readonly configService: ConfigService,
	) {
		this.webhookSecret = this.configService.getOrThrow<string>("GITHUB_WEBHOOK_SECRET");
	}

	verifySignature(signature: string, body: unknown) {
		const hmac = createHmac("sha256", this.webhookSecret).update(JSON.stringify(body)).digest("hex");
		const trusted = Buffer.from(`sha256=${hmac}`, "ascii");
		const untrusted = Buffer.from(signature, "ascii");
		return timingSafeEqual(trusted, untrusted);
	}

	identifierFromRepo(action: string, repo: string) {
		return `${action}-${repo}`;
	}

	async parseBody(body: GithubWebhookBody) {
		if (body.issue) {
			const trigger = GithubTriggers.issues[body.action];
			if (trigger) {
				await this.grpcService.onAction({
					name: trigger,
					identifier: this.identifierFromRepo(trigger, body.repository.full_name),
					params: {
						url: body.issue.html_url,
						title: body.issue.title,
						body: body.issue.body,
						createdAt: body.issue.created_at,
						author: body.sender.login,
					},
				});
			}
		}
		console.log(body);
	}

	async onGithubWebhook(signature: string, body: unknown) {
		if (!this.verifySignature(signature, body)) {
			throw new UnauthorizedException("Invalid signature");
		}
		await this.parseBody(body as GithubWebhookBody);
	}
}
