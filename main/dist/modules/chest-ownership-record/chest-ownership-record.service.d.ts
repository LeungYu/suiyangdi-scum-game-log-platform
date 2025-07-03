import { ChestOwnershipRecord } from "../../entity/chest-ownership-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class ChestOwnershipRecordService {
    private readonly chestOwnershipRecordRepository;
    constructor(chestOwnershipRecordRepository: Repository<ChestOwnershipRecord>);
    saveChestOwnershipRecord(scumId: string, steamId: string, sessionId: string, type: string, createdLocations: string, createdArea: string, createdTimeStamp: string, targetName?: string, otherConfig?: any): Promise<ChestOwnershipRecord>;
    getChestOwnershipRecordList(page: Page, data?: any): Promise<any>;
    getChestOwnershipRecordListLike(page: Page, data?: any): Promise<any>;
    deleteChestOwnershipRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllChestOwnershipRecord(): Promise<DeleteResult>;
    clearChestOwnershipRecord(): Promise<any>;
}
