import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GrpcService } from "../../grpc/grpc.service";
import { createHmac, timingSafeEqual } from "crypto";
import { ConfigService } from "@nestjs/config";

type GithubActions = "opened";

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
			switch (body.action) {
				case "opened":
					await this.grpcService.onAction({
						name: "github-on-issue-create",
						identifier: this.identifierFromRepo("github-on-issue-create", body.repository.full_name),
						params: {
							url: body.issue.html_url,
							title: body.issue.title,
							body: body.issue.body,
							createdAt: body.issue.created_at,
						},
					});
			}
		}
	}

	async onGithubWebhook(signature: string, body: unknown) {
		if (!this.verifySignature(signature, body)) {
			throw new UnauthorizedException("Invalid signature");
		}
		await this.parseBody(body as GithubWebhookBody);
	}
}
