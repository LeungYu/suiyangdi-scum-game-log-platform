import { Response } from 'express';
import { ListQueueSysDto, InfoQueueSysDto, AddQueueSysDto, updateStatusSysDto, updateAllStatusSysDto, RedoQueueSysDto, DeleteQueueItemSysDto } from '../../dto/queue-admin-sys';
import { QueueService } from './queue.service';
import { Page } from "../../dto/page";
import { SessionUser } from '../../dto/session-user';
export declare class QueueAdminSysController {
    private readonly queueService;
    constructor(queueService: QueueService);
    listQueue(page: Page, query: ListQueueSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    infoQueue(query: InfoQueueSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(userInfo: SessionUser, body: updateStatusSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateAllStatus(userInfo: SessionUser, body: updateAllStatusSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    addQueue(userInfo: SessionUser, body: AddQueueSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    redoQueue(userInfo: SessionUser, body: RedoQueueSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteQueueItem(userInfo: SessionUser, query: DeleteQueueItemSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
