import { Response } from 'express';
import { ListRecentNKillList, ListTopNUserKill } from '../../dto/kill';
import { Page } from "../../dto/page";
import { UserService } from "../user/user.service";
import { KillService } from "./kill.service";
import { SessionUser } from "../../dto/session-user";
export declare class KillController {
    private readonly userService;
    private readonly killService;
    constructor(userService: UserService, killService: KillService);
    listByUser(userInfo: SessionUser, page: Page, res: Response): Promise<Response<any, Record<string, any>>>;
    kdasByUser(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    listRecentNKillList(query: ListRecentNKillList, res: Response): Promise<Response<any, Record<string, any>>>;
    listTopNUserKill(query: ListTopNUserKill, res: Response): Promise<Response<any, Record<string, any>>>;
}
