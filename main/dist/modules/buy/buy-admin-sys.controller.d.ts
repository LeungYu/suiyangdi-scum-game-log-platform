import { Response } from 'express';
import { CleanVehiclesSysDto, InfoBuySysDto, ListBuySysDto, RefundBuySysDto, ResendBuySysDto, updateStatusSysDto, DeleteBuySysDto } from '../../dto/buy-admin-sys';
import { Page } from "../../dto/page";
import { BuyService } from "./buy.service";
import { QueueService } from "../queue/queue.service";
import { ServerConfigService } from "../server-config/server-config.service";
import { UserDollarService } from "../user/user-dollar.service";
import { UserDollarChangeService } from "../user-dollar-change/user-dollar-change.service";
import { SessionUser } from '../../dto/session-user';
export declare class BuyAdminSysController {
    private readonly buyService;
    private readonly queueService;
    private readonly userDollarService;
    private readonly userDollarChangeService;
    private readonly serverConfigService;
    constructor(buyService: BuyService, queueService: QueueService, userDollarService: UserDollarService, userDollarChangeService: UserDollarChangeService, serverConfigService: ServerConfigService);
    list(page: Page, query: ListBuySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(page: Page, query: InfoBuySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(userInfo: SessionUser, body: updateStatusSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    resendBuy(userInfo: SessionUser, req: any, body: ResendBuySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refundBuy(userInfo: SessionUser, req: any, body: RefundBuySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    cleanVehicles(userInfo: SessionUser, body: CleanVehiclesSysDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, res: Response, query: DeleteBuySysDto): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
