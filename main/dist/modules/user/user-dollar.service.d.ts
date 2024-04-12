import { UserDollar } from '../../entity/user-dollar.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Page } from '../../dto/page';
import { ServerConfigService } from "../server-config/server-config.service";
import { LevelService } from "../level/level.service";
export declare class UserDollarService {
    private readonly serverConfigService;
    private readonly userDollarRepository;
    private readonly levelService;
    constructor(serverConfigService: ServerConfigService, userDollarRepository: Repository<UserDollar>, levelService: LevelService);
    saveUserDollar(userId: any, dollars: number, chargeDollars?: number, level?: number, gesture?: string): Promise<UserDollar>;
    updateUserDollar(userDollar: UserDollar): Promise<UpdateResult> | undefined;
    updateUserDollarLevel(originLevel: number, newLevel: number): Promise<UpdateResult> | undefined;
    updateUserDollars(id: string, change: number, level?: number, changeChargeDollars?: boolean): Promise<UpdateResult> | undefined;
    updateUserChargeDollars(id: string, change: number, levelExpire?: boolean): Promise<UpdateResult> | undefined;
    updateAllUserDollars(change: number): Promise<UpdateResult> | undefined;
    getUserDollarList(page: Page, data?: {
        userId?: any;
        level?: string;
        gesture?: string;
    }, sorts?: {
        sort: string;
        order: 'DESC' | 'ASC';
    }[]): Promise<any>;
    getUserDollar(userId: any): Promise<UserDollar>;
    deleteUserDollar(userId: any): Promise<DeleteResult>;
    exportUserDollarsList(): Promise<any>;
}
