import { Response } from 'express';
import { ListLevelSysDto, LevelInfoSysDto, AddLevelSysDto, DeleteLevelSysDto, UpdateLevelSysDto, UpdateLevelInfoSysDto } from '../../dto/level-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { LevelService } from "./level.service";
import { UserDollarService } from "../user/user-dollar.service";
export declare class LevelAdminSysController {
    private readonly userDollarService;
    private readonly levelService;
    constructor(userDollarService: UserDollarService, levelService: LevelService);
    list(page: Page, query: ListLevelSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: LevelInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    add(userInfo: SessionUser, body: AddLevelSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, body: UpdateLevelSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateInfo(userInfo: SessionUser, body: UpdateLevelInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteLevelSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
