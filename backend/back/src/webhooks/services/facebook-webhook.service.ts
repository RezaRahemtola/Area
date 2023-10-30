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
			value: {
				item: "status";
				created_time: number;
				message: string;
				from: {
					name: string;
				};
			};
		},
	];
};

type FacebookWebhookBody = FacebookBaseBody<FacebookFeedStatusEntry>; // eslint-disable-line

@Injectable()
export class FacebookWebhookService {
	private readonly webhookSecret: string;

	constructor(private readonly configService: ConfigService) {
		this.webhookSecret = this.configService.getOrThrow<string>("FACEBOOK_CLIENT_SECRET");
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
		const hmac = createHmac("sha256", this.webhookSecret).update(body).digest("hex");
		const trusted = Buffer.from(`sha256=${hmac}`, "utf-8");
		const untrusted = Buffer.from(signature, "utf-8");
		return timingSafeEqual(trusted, untrusted);
	}

	async onFacebookWebhook(signature: string, req: RawBodyRequest<unknown>): Promise<void> {
		if (!req.rawBody) {
			throw new BadRequestException("Missing raw body");
		}
		if (!this.verifySignature(signature, req.rawBody)) {
			throw new UnauthorizedException("Invalid signature");
		}
		const body: unknown = JSON.parse(req.rawBody.toString());
		console.log(body);
	}
}
