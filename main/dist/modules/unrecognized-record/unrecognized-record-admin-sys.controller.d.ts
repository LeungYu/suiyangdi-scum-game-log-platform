import { Response } from 'express';
import { ListUnrecognizedRecordSysDto, UnrecognizedRecordInfoSysDto, DeleteUnrecognizedRecordSysDto } from '../../dto/unrecognized-record-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { UnrecognizedRecordService } from "./unrecognized-record.service";
export declare class UnrecognizedRecordAdminSysController {
    private readonly unrecognizedRecordService;
    constructor(unrecognizedRecordService: UnrecognizedRecordService);
    list(page: Page, query: ListUnrecognizedRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: UnrecognizedRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteUnrecognizedRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
