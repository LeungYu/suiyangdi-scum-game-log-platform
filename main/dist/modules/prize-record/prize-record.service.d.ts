import { PrizeRecord } from "../../entity/prize-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class PrizeRecordService {
    private readonly prizeRecordRepository;
    constructor(prizeRecordRepository: Repository<PrizeRecord>);
    savePrizeRecords(prizeRecords: any[]): Promise<PrizeRecord[]>;
    savePrizeRecord(userId: any, prizeId: number, dollars: number): Promise<PrizeRecord>;
    getPrizeRecordList(page: Page, data?: any): Promise<any>;
    getPrizeRecordListLike(page: Page, data?: any): Promise<any>;
    getPrizeRecord(data: {
        [props: string]: any;
    }): Promise<any>;
    deletePrizeRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    clearPrizeRecord(): Promise<any>;
}
