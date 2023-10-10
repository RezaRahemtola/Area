import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

class UniqueJobParams {
	@IsUUID(4)
	workflowStepId: string;
}

export class TimerSecondIntervalParams extends UniqueJobParams {
	@IsNumber()
	seconds: number;
}

export class GoogleSendEmailParams extends UniqueJobParams {
	@IsEmail()
	to: string;

	@IsString()
	subject: string;

	@IsString()
	content: string;
}
