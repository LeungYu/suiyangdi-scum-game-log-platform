import { Response } from 'express';
import { ListKillSysDto, KillInfoSysDto } from '../../dto/kill-admin-sys';
import { Page } from "../../dto/page";
import { KillService } from "./kill.service";
import { SessionUser } from '../../dto/session-user';
export declare class KillAdminSysController {
    private readonly killService;
    constructor(killService: KillService);
    list(page: Page, query: ListKillSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: KillInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
