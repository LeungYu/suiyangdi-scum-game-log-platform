import { Economy } from "../../entity/economy.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class EconomyService {
    private readonly economyRepository;
    constructor(economyRepository: Repository<Economy>);
    saveEconomys(economys: any[]): Promise<Economy[]>;
    saveEconomy(scumId: string, steamId: string, type: string, trader: string, createdTimeStamp: string, otherConfig?: any): Promise<Economy>;
    getEconomyList(page: Page, data?: any): Promise<any>;
    getEconomyListLike(page: Page, data?: any): Promise<any>;
    getEconomy(data: {
        [props: string]: any;
    }): Promise<Economy>;
    getLatestRecordTime(): Promise<string>;
    deleteEconomy(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllEconomy(): Promise<DeleteResult>;
    clearEconomy(): Promise<any>;
}
