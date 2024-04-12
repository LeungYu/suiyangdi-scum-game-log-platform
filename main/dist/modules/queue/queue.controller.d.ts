import { Response } from 'express';
import { nextPendingQueueItemDto, updateQueueItemDto } from '../../dto/queue';
import { QueueService } from './queue.service';
import { BuyService } from "../buy/buy.service";
import { ServerConfigService } from "../server-config/server-config.service";
import { UserLoginService } from "../user/user-login.service";
export declare class QueueController {
    private readonly queueService;
    private readonly buyService;
    private readonly serverConfigService;
    private readonly userLoginService;
    constructor(queueService: QueueService, buyService: BuyService, serverConfigService: ServerConfigService, userLoginService: UserLoginService);
    nextPending(query: nextPendingQueueItemDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateQueueItem(body: updateQueueItemDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
