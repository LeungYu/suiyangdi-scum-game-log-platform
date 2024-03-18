import { Response } from 'express';
import { LoginUserBodySysDto } from '../../dto/auth-admin-sys';
import { SessionUser } from '../../dto/session-user';
export declare const cookieCfg: {
    expires: Date;
    domain: string;
    maxAge: number;
    httpOnly: boolean;
};
export declare class AuthAdminSysController {
    constructor();
    login(body: LoginUserBodySysDto, res: Response, sessionUser: SessionUser, session: any): Promise<Response<any, Record<string, any>>>;
    checkValid(res: Response, sessionUser: SessionUser): Promise<Response<any, Record<string, any>>>;
    logout(res: Response, session: any): Promise<void>;
}
