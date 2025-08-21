import { VehicleDestructionRecord } from "../../entity/vehicle-destruction-record.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class VehicleDestructionRecordService {
    private readonly vehicleDestructionRecordRepository;
    constructor(vehicleDestructionRecordRepository: Repository<VehicleDestructionRecord>);
    saveVehicleDestructionRecord(ownerScumId: string, ownerSteamId: string, ownerSessionId: string, actionType: string, vehicleType: string, vehicleId: string, locations: string, area: string, createdTimeStamp: string, rawText?: string): Promise<VehicleDestructionRecord>;
    getVehicleDestructionRecordList(page: Page, data?: any): Promise<any>;
    getVehicleDestructionRecordListLike(page: Page, data?: any): Promise<any>;
    getVehicleDestructionRecord(data: {
        [props: string]: any;
    }): Promise<VehicleDestructionRecord>;
    deleteVehicleDestructionRecord(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    getLatestRecordTime(): Promise<string>;
    limitAllVehicleDestructionRecord(): Promise<DeleteResult>;
    clearVehicleDestructionRecord(): Promise<any>;
}
