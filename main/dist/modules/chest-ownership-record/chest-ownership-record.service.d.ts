import { ChestOwnershipRecord } from "../../entity/chest-ownership-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class ChestOwnershipRecordService {
    private readonly chestOwnershipRecordRepository;
    constructor(chestOwnershipRecordRepository: Repository<ChestOwnershipRecord>);
    saveChestOwnershipRecord(fromScumId: string, fromSteamId: string, toScumId: string, toSteamId: string, chestId: string, createdTimeStamp: string, rawText?: string): Promise<ChestOwnershipRecord>;
    getChestOwnershipRecordList(page: Page, data?: any): Promise<any>;
    getChestOwnershipRecordListLike(page: Page, data?: any): Promise<any>;
    getChestOwnershipRecord(data: {
        [props: string]: any;
    }): Promise<ChestOwnershipRecord>;
    deleteChestOwnershipRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    getLatestRecordTime(): Promise<string>;
    limitAllChestOwnershipRecord(): Promise<DeleteResult>;
    clearChestOwnershipRecord(): Promise<any>;
}
