import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
import { ViolationsRecord } from "../../entity/violations-record.entity";
export declare class ViolationsRecordService {
    private readonly violationsRecordRepository;
    constructor(violationsRecordRepository: Repository<ViolationsRecord>);
    saveViolationsRecords(violationsRecords: any[]): Promise<ViolationsRecord[]>;
    saveViolationsRecord(rawContent: string, createdTimeStamp?: string, tag?: string, steamId?: string, count?: number, otherConfig?: any): Promise<ViolationsRecord>;
    getViolationsRecordList(page: Page, data?: any): Promise<any>;
    getViolationsRecordListLike(page: Page, data?: any): Promise<any>;
    getViolationsRecord(data: {
        [props: string]: any;
    }): Promise<ViolationsRecord>;
    getLatestRecordTime(): Promise<string>;
    deleteViolationsRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllViolationsRecord(): Promise<DeleteResult>;
    clearViolationsRecord(): Promise<any>;
}
