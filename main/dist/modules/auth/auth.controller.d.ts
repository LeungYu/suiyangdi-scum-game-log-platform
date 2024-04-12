import { Response, Request } from 'express';
import { LogoutUserDto, LoginUserDto, LoginUserBodyDto } from '../../dto/auth';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SessionUser } from '../../dto/session-user';
import { UserPasswordService } from "../user/user-password.service";
import { AdminService } from "../admin/admin.service";
export declare const cookieCfg: {
    expires: Date;
    domain: string;
    maxAge: number;
    httpOnly: boolean;
};
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly userPasswordService;
    private readonly adminService;
    constructor(authService: AuthService, userService: UserService, userPasswordService: UserPasswordService, adminService: AdminService);
    login(query: LoginUserDto, body: LoginUserBodyDto, req: Request, res: Response, sessionUser: SessionUser, session: any): Promise<Response<any, Record<string, any>>>;
    checkValid(res: Response, sessionUser: SessionUser): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response, query: LogoutUserDto, session: any, sessionUser: SessionUser): Promise<void>;
}
