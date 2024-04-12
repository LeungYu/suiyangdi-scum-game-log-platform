import { Response } from 'express';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { UserService } from "../user/user.service";
import { UserDollarChangeService } from "./user-dollar-change.service";
export declare class UserDollarChangeController {
    private readonly userService;
    private readonly userDollarChangeService;
    constructor(userService: UserService, userDollarChangeService: UserDollarChangeService);
    listByUser(userInfo: SessionUser, page: Page, res: Response): Promise<Response<any, Record<string, any>>>;
}
