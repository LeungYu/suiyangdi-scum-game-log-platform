import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
import { SquadHistory } from "../../entity/squad-history.entity";
export declare class SquadHistoryService {
    private readonly squadHistoryRepository;
    constructor(squadHistoryRepository: Repository<SquadHistory>);
    saveSquadHistory(squadId: string, userId: any, action: string): Promise<SquadHistory>;
    updateSquadHistory(squadHistory: SquadHistory): Promise<UpdateResult> | undefined;
    getSquadHistoryList(page: Page, data?: any): Promise<any>;
    getSquadHistoryListLike(page: Page, data?: any): Promise<any>;
    getSquadHistory(data: {
        [props: string]: any;
    }): Promise<SquadHistory>;
    deleteSquadHistory(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    cleanSquadHistory(): Promise<any>;
}
