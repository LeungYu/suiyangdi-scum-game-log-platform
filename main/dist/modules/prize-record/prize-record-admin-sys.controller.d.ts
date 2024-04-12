import { Response } from 'express';
import { PrizeRecordListSysDto, PrizeRecordInfoSysDto } from '../../dto/prize-record-admin-sys';
import { PrizeRecordService } from "./prize-record.service";
import { Page } from "../../dto/page";
import { SessionUser } from '../../dto/session-user';
export declare class PrizeRecordAdminSysController {
    private readonly prizeRecordService;
    constructor(prizeRecordService: PrizeRecordService);
    list(page: Page, query: PrizeRecordListSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listRecent(query: PrizeRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
