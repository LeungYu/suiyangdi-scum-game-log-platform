import { Page } from '../../dto/page';
import { Response } from 'express';
import { UserLoginService } from "./user-login.service";
import { SearchUserLoginSysDto, SearchUserLoginMultiSysDto, ListUserLoginSysDto, GetSteamInfoSysDto } from "../../dto/user-admin-sys";
import { SessionUser } from "../../dto/session-user";
import { ServerConfigService } from '../server-config/server-config.service';
export declare class UserAdminSysController {
    private readonly userLoginService;
    private readonly serverConfigService;
    constructor(userLoginService: UserLoginService, serverConfigService: ServerConfigService);
    checkUserInfo(userInfo: SessionUser, session: any, res: Response): Promise<any>;
    infoUsers(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    listUserLogin(page: Page, query: ListUserLoginSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    searchUserLogin(query: SearchUserLoginSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    searchUserLoginMulti(query: SearchUserLoginMultiSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getSteamInfo(query: GetSteamInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
