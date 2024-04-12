import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
import { Queue } from "../../entity/queue.entity";
export declare class QueueService {
    private readonly queueRepository;
    constructor(queueRepository: Repository<Queue>);
    saveQueues(queues: any[]): Promise<Queue[]>;
    saveQueueItem(commands: string, type: string, status?: string, buyId?: any, buyUserId?: any, isNewSet?: boolean): Promise<Queue>;
    updateQueueItem(queue: Queue): Promise<UpdateResult> | undefined;
    updateAllQueueStatus(status: any): Promise<UpdateResult> | undefined;
    getQueueList(page: Page, data?: any): Promise<any>;
    getQueueListLike(page: Page, data?: any): Promise<any>;
    getQueueListPending(page: Page, data?: any): Promise<any>;
    getBuyQueuePending(): Promise<any>;
    getQueueItem(data: {
        id?: any;
        buyId?: any;
    }): Promise<any>;
    deleteQueueItem(data: {
        id: string;
    }): Promise<DeleteResult>;
    cleanQueue(): Promise<any>;
    limitAllQueue(): Promise<DeleteResult>;
}
