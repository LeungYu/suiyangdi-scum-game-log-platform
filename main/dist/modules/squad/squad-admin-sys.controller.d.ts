import { Response } from 'express';
import { ListSquadSysDto, SearchSquadsSysDto, SquadInfoSysDto, DisbandSquadSysDto, DeleteSquadSysDto, UpdateSquadSysDto, ListSquadUserSysDto, ListSquadHistorySysDto, ListSquadJoinRequestSysDto } from '../../dto/squad-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { UserService } from "../user/user.service";
import { SquadService } from "./squad.service";
import { SquadUserService } from "./squad-user.service";
import { SquadHistoryService } from "./squad-history.service";
import { SquadJoinRequestService } from "./squad-join-request.service";
import { ServerConfigService } from "../server-config/server-config.service";
export declare class SquadAdminSysController {
    private readonly userService;
    private readonly squadService;
    private readonly squadUserService;
    private readonly squadHistoryService;
    private readonly squadJoinRequestService;
    private readonly serverConfigService;
    constructor(userService: UserService, squadService: SquadService, squadUserService: SquadUserService, squadHistoryService: SquadHistoryService, squadJoinRequestService: SquadJoinRequestService, serverConfigService: ServerConfigService);
    list(page: Page, query: ListSquadSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: SquadInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, body: UpdateSquadSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    disband(userInfo: SessionUser, query: DisbandSquadSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteSquadSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    searchSquads(query: SearchSquadsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listSquadUser(page: Page, query: ListSquadUserSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listSquadJoinRequest(page: Page, query: ListSquadJoinRequestSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listSquadHistory(page: Page, query: ListSquadHistorySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
