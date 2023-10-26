import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { GrpcService } from "../../grpc/grpc.service";
import { ConfigService } from "@nestjs/config";
import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FacebookChallengeHub {
	@IsString()
	"hub.mode": string;
	@IsString()
	"hub.verify_token": string;
	@Type(() => Number)
	@IsNumber()
	"hub.challenge": number;
}

@Injectable()
export class FacebookWebhookService {
	private readonly webhookSecret: string;

	constructor(
		private readonly grpcService: GrpcService,
		private readonly configService: ConfigService,
	) {
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

	/*
    verifySignature(signature: string, body: unknown) {
        const hmac = createHmac("sha256", this.webhookSecret).update(JSON.stringify(body)).digest("hex");
        const trusted = Buffer.from(`sha256=${hmac}`, "ascii");
        const untrusted = Buffer.from(signature, "ascii");
        return  timingSafeEqual(trusted, untrusted);
        // https://linear.app/cramptarea/issue/ARE-320/facebook-webhook-payload-validation
    }
    */

	async onFacebookWebhook(signature: string, body: unknown): Promise<void> {
		/*
        if (!this.verifySignature(signature, body)) {
            throw new UnauthorizedException("Invalid signature")
        }
        */
		console.log(body);
	}
}
