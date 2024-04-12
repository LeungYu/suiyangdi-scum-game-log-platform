import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
import { Squad } from "../../entity/squad.entity";
export declare class SquadService {
    private readonly squadRepository;
    constructor(squadRepository: Repository<Squad>);
    saveSquad(name: string, createdByUserId: any): Promise<Squad>;
    updateSquad(squad: Squad): Promise<UpdateResult> | undefined;
    getSquadList(page: Page, data?: any): Promise<any>;
    getSquadListLike(page: Page, data?: any): Promise<any>;
    getDistinctSquadList(keyword?: string): Promise<any>;
    getSquad(data: {
        [props: string]: any;
    }): Promise<Squad>;
    deleteSquad(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    cleanSquad(): Promise<any>;
}
