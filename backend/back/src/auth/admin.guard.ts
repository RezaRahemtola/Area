import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { APIRequest } from "../types/request";

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly userService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { id } = context.switchToHttp().getRequest<APIRequest>().user;
		const user = await this.userService.getUser({ id });

		return !!user?.isAdmin;
	}
}
