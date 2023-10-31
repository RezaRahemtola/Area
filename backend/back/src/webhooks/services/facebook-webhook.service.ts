import {
	BadRequestException,
	ConflictException,
	Injectable,
	RawBodyRequest,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { createHmac, timingSafeEqual } from "crypto";
import { GrpcService } from "../../grpc/grpc.service";

export class FacebookChallengeHub {
	@IsString()
	"hub.mode": string;
	@IsString()
	"hub.verify_token": string;
	@Type(() => Number)
	@IsNumber()
	"hub.challenge": number;
}

type FacebookObject = "page";

type FacebookBaseBody<T> = {
	object: FacebookObject;
	entry: T[];
};

type FacebookFeedStatusEntry = {
	changes: [
		{
			field: "feed";
			value: FacebookFeedStatus;
		},
	];
};

type FacebookFeedStatus = {
	item: "status";
	verb: string;
	created_time: number;
	message: string;
	from: {
		id: string;
		name: string;
	};
};

type FacebookWebhookBody = FacebookBaseBody<FacebookFeedStatusEntry>; // eslint-disable-line

@Injectable()
export class FacebookWebhookService {
	private readonly clientSecret: string;
	private readonly webhookSecret: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly grpcService: GrpcService,
	) {
		this.clientSecret = this.configService.getOrThrow<string>("FACEBOOK_CLIENT_SECRET");
		this.webhookSecret = this.configService.getOrThrow<string>("FACEBOOK_WEBHOOK_SECRET");
	}

	onChallenge(query: FacebookChallengeHub): number {
		if (query["hub.mode"] !== "subscribe") {
			throw new ConflictException("Invalid hub.mode");
		}
		if (query["hub.verify_token"] !== this.webhookSecret) {
			throw new UnauthorizedException("Invalid hub.verify_token");
		}
		return query["hub.challenge"];
	}

	verifySignature(signature: string, body: Buffer) {
		const hmac = createHmac("sha256", this.clientSecret).update(body).digest("hex");
		const trusted = Buffer.from(`sha256=${hmac}`, "utf-8");
		const untrusted = Buffer.from(signature, "utf-8");
		return timingSafeEqual(trusted, untrusted);
	}

	identifierFromPage(action: string, pageId: string) {
		return `${action}-${pageId}`;
	}

	getAction(item: string, verb: string): string | null {
		if (item === "status" && verb === "add") {
			return "facebook-on-status-create";
		}
		return null;
	}

	async parseFeed(feed: FacebookFeedStatus) {
		let action: string;

		switch (feed.item) {
			case "status":
				action = this.getAction(feed.item, feed.verb);
				if (action) {
					await this.grpcService.onAction({
						name: action,
						identifier: this.identifierFromPage(action, feed.from.id),
						params: {
							message: feed.message,
							author: feed.from.name,
							createdAt: feed.created_time,
						},
					});
				}
				break;
		}
	}

	async parseBody(body: FacebookWebhookBody) {
		for (const entry of body.entry) {
			if (entry.changes) {
				for (const change of entry.changes) {
					if (change.field === "feed") {
						await this.parseFeed(change.value);
					}
				}
			}
		}
	}

	async onFacebookWebhook(signature: string, req: RawBodyRequest<unknown>): Promise<void> {
		if (!req.rawBody) {
			throw new BadRequestException("Missing raw body");
		}
		if (!this.verifySignature(signature, req.rawBody)) {
			throw new UnauthorizedException("Invalid signature");
		}
		const body: unknown = JSON.parse(req.rawBody.toString());
		await this.parseBody(body as FacebookWebhookBody);
	}
}
