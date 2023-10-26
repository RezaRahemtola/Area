import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GrpcService } from "../../grpc/grpc.service";
import { createHmac, timingSafeEqual } from "crypto";
import { ConfigService } from "@nestjs/config";

type GithubActions = "opened" | "reopened" | "closed";
type GithubBodyType = "issue" | "pull_request" | "commit";

type GithubBaseBody = {
	repository: {
		full_name: string;
	};
	sender: {
		login: string;
	};
};

type GithubIssueBody = GithubBaseBody & {
	type: "issue";
	action: GithubActions;
	issue: {
		html_url: string;
		title: string;
		body: string;
		created_at: string;
	};
};

type GithubPullRequestBody = GithubBaseBody & {
	type: "pull_request";
	action: GithubActions;
	pull_request: {
		html_url: string;
		title: string;
		body: string;
		created_at: string;
		head: {
			ref: string;
		};
		base: {
			ref: string;
		};
		merged_by?: {
			login: string;
		};
	};
};

type GithubCommitBody = GithubBaseBody & {
	type: "commit";
	ref: string;
	head_commit: {
		id: string;
		url: string;
		message: string;
		timestamp: string;
		committer: {
			username: string;
		};
	};
};

type GithubWebhookBody = GithubIssueBody | GithubPullRequestBody | GithubCommitBody;

const GithubProperties: Record<string, GithubBodyType> = {
	issue: "issue",
	pull_request: "pull_request",
	head_commit: "commit",
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

	getIssueAction(body: GithubIssueBody): string | null {
		switch (body.action) {
			case "opened":
				return "github-on-issue-create";
			case "reopened":
				return "github-on-issue-reopen";
			case "closed":
				return "github-on-issue-close";
			default:
				return null;
		}
	}

	getPullRequestAction(body: GithubPullRequestBody): string | null {
		switch (body.action) {
			case "opened":
				return "github-on-pull-request-create";
			case "closed":
				return body.pull_request.merged_by ? "github-on-pull-request-merge" : "github-on-pull-request-close";
			default:
				return null;
		}
	}

	async parseBody(body: GithubWebhookBody) {
		let action: string;
		for (const property in GithubProperties) {
			if (property in body) {
				body.type = GithubProperties[property];
				break;
			}
		}

		switch (body.type) {
			case "issue":
				action = this.getIssueAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, body.repository.full_name),
						params: {
							url: body.issue.html_url,
							title: body.issue.title,
							body: body.issue.body,
							createdAt: body.issue.created_at,
							author: body.sender.login,
						},
					});
				}
				break;

			case "pull_request":
				action = this.getPullRequestAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, body.repository.full_name),
						params: {
							url: body.pull_request.html_url,
							title: body.pull_request.title,
							body: body.pull_request.body,
							createdAt: body.pull_request.created_at,
							base: body.pull_request.base.ref,
							compare: body.pull_request.head.ref,
							author: body.sender.login,
						},
					});
				}
				break;

			case "commit":
				await this.grpcService.onAction({
					name: "github-on-commit",
					identifier: this.identifierFromRepo("github-on-commit", body.repository.full_name),
					params: {
						url: body.head_commit.url,
						message: body.head_commit.message,
						createdAt: body.head_commit.timestamp,
						author: body.head_commit.committer.username,
						branch: body.ref.substring(11),
					},
				});
				break;
		}
	}

	async onGithubWebhook(signature: string, body: unknown) {
		if (!this.verifySignature(signature, body)) {
			throw new UnauthorizedException("Invalid signature");
		}
		await this.parseBody(body as GithubWebhookBody);
	}
}
