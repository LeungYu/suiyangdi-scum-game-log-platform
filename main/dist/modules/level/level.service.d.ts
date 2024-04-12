import { Level } from "../../entity/level.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class LevelService {
    private readonly levelRepository;
    constructor(levelRepository: Repository<Level>);
    saveLevel(level: number, chargeDollars: number, discount: number, enableGesture: boolean, generalGesture?: string, checkInPrize?: number, onlinePrize?: number, minRewardOnlineTime?: number, enableLevelAnnounce?: boolean): Promise<Level>;
    updateLevel(level: Level): Promise<UpdateResult> | undefined;
    getLevelList(page: Page, data?: any): Promise<any>;
    getLevelListByChargeDollar(chargeDollars: number): Promise<any>;
    getLevel(data: {
        [props: string]: any;
    }): Promise<Level>;
    deleteLevel(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
}
