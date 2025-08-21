import { Response } from 'express';
import { ListVehicleDestructionRecordSysDto, VehicleDestructionRecordInfoSysDto, DeleteVehicleDestructionRecordSysDto } from '../../dto/vehicle-destruction-record-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { VehicleDestructionRecordService } from "./vehicle-destruction-record.service";
export declare class VehicleDestructionRecordAdminSysController {
    private readonly vehicleDestructionRecordService;
    constructor(vehicleDestructionRecordService: VehicleDestructionRecordService);
    list(page: Page, query: ListVehicleDestructionRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: VehicleDestructionRecordInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteVehicleDestructionRecordSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
