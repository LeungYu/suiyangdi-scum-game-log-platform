import { Response } from 'express';
import { ListViolationsRecordSysDto, ViolationsRecordInfoSysDto, DeleteViolationsRecordSysDto } from '../../dto/violations-record-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ViolationsRecordService } from "./violations-record.service";
export declare class ViolationsRecordAdminSysController {
    private readonly violationsRecordService;
    constructor(violationsRecordService: ViolationsRecordService);
    list(page: Page, query: ListViolationsRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ViolationsRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteViolationsRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
