import { UserLogin } from '../../entity/user-login.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Page } from '../../dto/page';
export declare class UserLoginService {
    private readonly userLoginRepository;
    constructor(userLoginRepository: Repository<UserLogin>);
    saveUserLogin(scumId: string, steamId: string, sessionId: string, loginIp: string, status?: string, loginTimeStamp?: string, logoutTimeStamp?: string, otherConfig?: any): Promise<UserLogin>;
    updateUserLogin(userLogin: UserLogin): Promise<UpdateResult> | undefined;
    getLoginUserList(): Promise<any>;
    getLoginUserListLike(page: Page, data?: any): Promise<any>;
    getUserLoginList(page: Page, data?: any): Promise<any>;
    getDistinctUserLogin(keyword?: string): Promise<any>;
    getDistinctUserLoginList(keyword?: string): Promise<any>;
    getUserLoginListBySteamId(page: Page, data?: any): Promise<any>;
    getLatestUserLoginListBySteamId(steamId: string): Promise<any>;
    getUserLogin(data: {
        [props: string]: any;
    }): Promise<UserLogin>;
    getLatestRecordTime(): Promise<string>;
    deleteUserLogin(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllUserLogin(): Promise<DeleteResult>;
    cleanAllUserLogin(): Promise<any>;
}
