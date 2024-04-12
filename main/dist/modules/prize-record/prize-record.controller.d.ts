import { Response } from 'express';
import { AddGetPrizeDto, RecentPrizeRecordListDto } from '../../dto/prize-record';
import { PrizeRecordService } from "./prize-record.service";
import { SessionUser } from "../../dto/session-user";
import { UserService } from "../user/user.service";
import { UserDollarService } from "../user/user-dollar.service";
import { UserDollarChangeService } from "../user-dollar-change/user-dollar-change.service";
import { ServerConfigService } from "../server-config/server-config.service";
export declare class PrizeRecordController {
    private readonly prizeRecordService;
    private readonly userService;
    private readonly userDollarService;
    private readonly userDollarChangeService;
    private readonly serverConfigService;
    constructor(prizeRecordService: PrizeRecordService, userService: UserService, userDollarService: UserDollarService, userDollarChangeService: UserDollarChangeService, serverConfigService: ServerConfigService);
    listAllPrizeTypes(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    listRecent(query: RecentPrizeRecordListDto, res: Response): Promise<Response<any, Record<string, any>>>;
    addGetPrize(userInfo: SessionUser, body: AddGetPrizeDto, res: Response): Promise<Response<any, Record<string, any>>>;
    addGetPrize10(userInfo: SessionUser, body: AddGetPrizeDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
