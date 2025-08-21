import { Response } from 'express';
import { ListChestOwnershipRecordSysDto, ChestOwnershipRecordInfoSysDto, DeleteChestOwnershipRecordSysDto } from '../../dto/chest-ownership-record-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ChestOwnershipRecordService } from "./chest-ownership-record.service";
export declare class ChestOwnershipRecordAdminSysController {
    private readonly chestOwnershipRecordService;
    constructor(chestOwnershipRecordService: ChestOwnershipRecordService);
    list(page: Page, query: ListChestOwnershipRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ChestOwnershipRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteChestOwnershipRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
