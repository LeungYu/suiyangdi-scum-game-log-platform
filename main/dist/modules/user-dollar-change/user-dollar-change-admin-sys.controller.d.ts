import { Response } from 'express';
import { ListUserDollarChangeSysDto, InfoUserDollarChangeSysDto, CleanUserDollarChangeSysDto } from '../../dto/user-dollar-change-admin-sys';
import { Page } from "../../dto/page";
import { UserService } from "../user/user.service";
import { UserDollarChangeService } from "./user-dollar-change.service";
import { SessionUser } from '../../dto/session-user';
export declare class UserDollarChangeAdminSysController {
    private readonly userService;
    private readonly userDollarChangeService;
    constructor(userService: UserService, userDollarChangeService: UserDollarChangeService);
    list(page: Page, query: ListUserDollarChangeSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listByUser(page: Page, query: InfoUserDollarChangeSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response, query: CleanUserDollarChangeSysDto): Promise<Response<any, Record<string, any>>>;
    cleanAll(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
