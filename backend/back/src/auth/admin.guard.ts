import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { APIRequest } from "../types/request";

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { id } = context.switchToHttp().getRequest<APIRequest>().user;
		const user = await this.userService.getUser({ id });

		return !!user?.isAdmin;
	}
}
