import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

export class UniqueJobParams {
	@IsUUID(4)
	workflowStepId: string;
}

export class TimerSecondIntervalParams extends UniqueJobParams {
	@IsNumber()
	seconds: number;
}

export class GoogleEmailParams extends UniqueJobParams {
	@IsEmail()
	to: string;

	@IsString()
	subject: string;

	@IsString()
	body: string;
}

export class GoogleEmailSignatureUpdateParams extends UniqueJobParams {
	@IsString()
	signature: string;
}

export class GoogleYoutubeCreateCommentParams extends UniqueJobParams {
	@IsString()
	videoId: string;

	@IsString()
	content: string;
}

export class GoogleCreateDocumentParams extends UniqueJobParams {
	@IsString()
	name: string;
}

export class GoogleCreateContactParams extends UniqueJobParams {
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;
}
