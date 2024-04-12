import { Buy } from "../../entity/buy.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class BuyService {
    private readonly buyRepository;
    constructor(buyRepository: Repository<Buy>);
    saveBuys(buys: any[]): Promise<Buy[]>;
    saveBuy(userId: any, itemId: number, number: number, isPrePurchase?: boolean, remainTimes?: number, vehicleId?: number, status?: string, configs?: string, updateTimeStamp?: string): Promise<Buy>;
    updateBuy(buy: Buy): Promise<UpdateResult> | undefined;
    getBuyList(page: Page, data?: any, needLock?: boolean): Promise<any>;
    getBuyListAdmin(page: Page, data?: any): Promise<any>;
    getBuy(data: {
        [props: string]: any;
    }, needLock?: boolean): Promise<any>;
    deleteBuy(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    clearBuy(): Promise<any>;
}
