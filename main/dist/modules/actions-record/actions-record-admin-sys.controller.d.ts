import { Response } from 'express';
import { ListActionsRecordSysDto, ActionsRecordInfoSysDto, DeleteActionsRecordSysDto } from '../../dto/actions-record-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ActionsRecordService } from "./actions-record.service";
export declare class ActionsRecordAdminSysController {
    private readonly actionsRecordService;
    constructor(actionsRecordService: ActionsRecordService);
    list(page: Page, query: ListActionsRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ActionsRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteActionsRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
