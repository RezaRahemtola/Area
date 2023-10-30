import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GrpcService } from "../../grpc/grpc.service";

type GitlabBaseBody = {
	user_username: string;
	project: {
		id: string;
	};
	event_name?: string;
	event_type?: string;
};

type GitlabCommitBody = GitlabBaseBody & {
	type: "push";
	ref: string;
	commits: [
		{
			title: string;
			timestamp: string;
			url: string;
		},
	];
};

type GitlabPullRequestBody = GitlabBaseBody & {
	type: "pull_request";
	object_attributes: {
		action?: string;
		created_at: string;
		description: string;
		draft: boolean;
		source_branch: string;
		target_branch: string;
		title: string;
		url: string;
		state: string;
	};
};

type GitlabWebhookBody = GitlabCommitBody | GitlabPullRequestBody;

@Injectable()
export class GitlabWebhookService {
	private readonly webhookSecret: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly grpcService: GrpcService,
	) {
		this.webhookSecret = this.configService.getOrThrow<string>("GITLAB_WEBHOOK_SECRET");
	}

	identifierFromRepo(action: string, repo: string) {
		return `${action}-${repo}`;
	}

	setBodyType(body: GitlabWebhookBody) {
		if (body.event_name === "push") {
			body.type = "push";
		} else if (body.event_type === "merge_request") {
			body.type = "pull_request";
		}
	}

	getPullRequestAction(body: GitlabPullRequestBody): string | null {
		switch (body.object_attributes.state) {
			case "closed":
				return "gitlab-on-pull-request-close";
			case "merged":
				return "gitlab-on-pull-request-merge";
			case "opened":
				return `gitlab-on-pull-request-${body.object_attributes.action === "reopen" ? "reopen" : "create"}`;
			default:
				return null;
		}
	}

	async parseBody(body: GitlabWebhookBody): Promise<void> {
		let action: string;
		this.setBodyType(body);

		switch (body.type) {
			case "push":
				if (body.commits.length < 1) return;
				await this.grpcService.onAction({
					name: "gitlab-on-commit",
					identifier: this.identifierFromRepo("gitlab-on-commit", body.project.id),
					params: {
						url: body.commits[0].url,
						message: body.commits[0].title,
						createdAt: body.commits[0].timestamp,
						author: body.user_username,
						branch: body.ref.substring(11),
					},
				});
				break;

			case "pull_request":
				action = this.getPullRequestAction(body);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromRepo(action, body.project.id),
						params: {
							url: body.object_attributes.url,
							title: body.object_attributes.title,
							description: body.object_attributes.description,
							createdAt: body.object_attributes.created_at,
							base: body.object_attributes.source_branch,
							compare: body.object_attributes.target_branch,
							author: body.user_username,
						},
					});
				}
				break;
		}
	}

	async onGitlabWebhook(token: string, body: unknown): Promise<void> {
		if (token !== this.webhookSecret) {
			throw new UnauthorizedException("Invalid token");
		}
		await this.parseBody(body as GitlabWebhookBody);
	}
}
