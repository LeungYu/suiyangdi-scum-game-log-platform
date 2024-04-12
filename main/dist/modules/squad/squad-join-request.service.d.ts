import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
import { SquadJoinRequest } from "../../entity/squad-join-request.entity";
export declare class SquadJoinRequestService {
    private readonly squadJoinRequestRepository;
    constructor(squadJoinRequestRepository: Repository<SquadJoinRequest>);
    saveSquadJoinRequest(squadId: number, userId: any): Promise<SquadJoinRequest>;
    updateSquadJoinRequest(squadJoinRequest: SquadJoinRequest): Promise<UpdateResult> | undefined;
    getSquadJoinRequestList(page: Page, data?: any): Promise<any>;
    getSquadJoinRequestListLike(page: Page, data?: any): Promise<any>;
    getSquadJoinRequest(data: {
        [props: string]: any;
    }): Promise<SquadJoinRequest>;
    deleteSquadJoinRequest(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    cleanSquadJoinRequest(): Promise<any>;
}
