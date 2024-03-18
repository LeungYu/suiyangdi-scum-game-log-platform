import { Response } from 'express';
import { ListAdminCommandSysDto, AdminCommandInfoSysDto, DeleteAdminCommandSysDto } from '../../dto/admin-command-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { AdminCommandService } from "./admin-command.service";
export declare class AdminCommandAdminSysController {
    private readonly adminCommandService;
    constructor(adminCommandService: AdminCommandService);
    list(page: Page, query: ListAdminCommandSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: AdminCommandInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(query: DeleteAdminCommandSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
