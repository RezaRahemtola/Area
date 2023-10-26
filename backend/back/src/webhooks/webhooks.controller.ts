import {Body, Controller, Get, Headers, Post, Query} from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { LinearWebhookService } from "./services/linear-webhook.service";
import { FacebookChallengeHub, FacebookWebhookService } from "./services/facebook-webhook.service";

@Controller("webhooks")
@ApiExcludeController()
export class WebhooksController {
	constructor(
        private readonly facebookWebhookService: FacebookWebhookService,
        private readonly githubWebhookService: GithubWebhookService,
		private readonly linearWebhookService: LinearWebhookService,
	) {}

    @Post("facebook")
    async onFacebookWebhook(@Headers("X-Hub-Signature-256") signature: string, @Body() body: unknown): Promise<void> {
        return this.facebookWebhookService.onFacebookWebhook(signature, body);
    }

    @Get("facebook")
    onFacebookWebhookChallenge(@Query() query: FacebookChallengeHub): number {
        return this.facebookWebhookService.onChallenge(query);
    }

	@Post("github")
	async onGithubWebhook(@Headers("X-Hub-Signature-256") signature: string, @Body() body: unknown): Promise<void> {
		return this.githubWebhookService.onGithubWebhook(signature, body);
	}

	@Post("linear")
	async onLinearWebhook(@Headers("linear-signature") signature: string, @Body() body: unknown): Promise<void> {
		return this.linearWebhookService.onLinearWebhook(signature, body);
	}
}
