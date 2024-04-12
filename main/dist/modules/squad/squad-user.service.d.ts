import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
import { SquadUser } from "../../entity/squad-user.entity";
export declare class SquadUserService {
    private readonly squadUserRepository;
    constructor(squadUserRepository: Repository<SquadUser>);
    saveSquadUser(squadId: string, userId: any, role?: string): Promise<SquadUser>;
    updateSquadUser(squadUser: SquadUser): Promise<UpdateResult> | undefined;
    getSquadUserList(page: Page, data?: any): Promise<any>;
    getSquadUserListLike(page: Page, data?: any): Promise<any>;
    getSquadUser(data: {
        [props: string]: any;
    }): Promise<SquadUser>;
    deleteSquadUser(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    cleanSquadUser(): Promise<any>;
}
