import { Response } from 'express';
import { UpdateAllGportalSettingsSysDto, UpdateGportalSettingsSysDto, UpdateScumLogSysDto } from '../../dto/server-config-admin-sys';
import { ServerConfigService } from "./server-config.service";
import { UserLoginService } from "../user/user-login.service";
import { KillService } from "../kill/kill.service";
import { AdminCommandService } from "../admin-command/admin-command.service";
import { ChatMessageService } from "../chat-message/chat-message.service";
import { ActionsRecordService } from '../actions-record/actions-record.service';
import { ViolationsRecordService } from '../violations-record/violations-record.service';
import { EconomyService } from '../economy/economy.service';
export declare class ServerConfigAdminSysController {
    private readonly serverConfigService;
    private readonly userLoginService;
    private readonly killService;
    private readonly adminCommandService;
    private readonly chatMessageService;
    private readonly actionsRecordService;
    private readonly violationsRecordService;
    private readonly economyService;
    constructor(serverConfigService: ServerConfigService, userLoginService: UserLoginService, killService: KillService, adminCommandService: AdminCommandService, chatMessageService: ChatMessageService, actionsRecordService: ActionsRecordService, violationsRecordService: ViolationsRecordService, economyService: EconomyService);
    serverStatus(res: Response): Promise<Response<any, Record<string, any>>>;
    gameAreaList(res: Response): Promise<Response<any, Record<string, any>>>;
    gameAreaData(res: Response): Promise<Response<any, Record<string, any>>>;
    gportalSettings(res: Response): Promise<Response<any, Record<string, any>>>;
    updateAllGportalSettings(body: UpdateAllGportalSettingsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateGportalSettings(body: UpdateGportalSettingsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    scumMapConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    updateScumLog(body: UpdateScumLogSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
