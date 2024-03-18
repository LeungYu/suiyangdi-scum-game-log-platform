import { ActionsRecord } from "../../entity/actions-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class ActionsRecordService {
    private readonly actionsRecordRepository;
    constructor(actionsRecordRepository: Repository<ActionsRecord>);
    saveActionsRecord(scumId: string, steamId: string, sessionId: string, type: string, createdLocations: string, createdArea: string, createdTimeStamp: string, targetName?: string, otherConfig?: any): Promise<ActionsRecord>;
    getActionsRecordList(page: Page, data?: any): Promise<any>;
    getActionsRecordListLike(page: Page, data?: any): Promise<any>;
    getActionsRecord(data: {
        [props: string]: any;
    }): Promise<ActionsRecord>;
    getLatestRecordTime(): Promise<string>;
    deleteActionsRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllActionsRecord(): Promise<DeleteResult>;
    clearActionsRecord(): Promise<any>;
}
