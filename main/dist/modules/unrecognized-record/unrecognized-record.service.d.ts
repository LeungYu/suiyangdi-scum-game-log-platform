import { UnrecognizedRecord } from "../../entity/unrecognized-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class UnrecognizedRecordService {
    private readonly unrecognizedRecordRepository;
    constructor(unrecognizedRecordRepository: Repository<UnrecognizedRecord>);
    saveUnrecognizedRecord(fileName: string, rawText: string, createdTimeStamp: string): Promise<UnrecognizedRecord>;
    getUnrecognizedRecordList(page: Page, data?: any): Promise<any>;
    getUnrecognizedRecordListLike(page: Page, data?: any): Promise<any>;
    getUnrecognizedRecord(data: {
        [props: string]: any;
    }): Promise<UnrecognizedRecord>;
    deleteUnrecognizedRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    getLatestRecordTime(): Promise<string>;
    limitAllUnrecognizedRecord(): Promise<DeleteResult>;
    clearUnrecognizedRecord(): Promise<any>;
}
