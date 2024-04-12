import { ServerConfigService } from "../server-config/server-config.service";
import { KillService } from "../kill/kill.service";
import { UserLoginService } from "../user/user-login.service";
import { AdminCommandService } from "../admin-command/admin-command.service";
import { ChatMessageService } from "../chat-message/chat-message.service";
import { ActionsRecordService } from "../actions-record/actions-record.service";
import { ViolationsRecordService } from "../violations-record/violations-record.service";
import { EconomyService } from "../economy/economy.service";
export declare enum ServerLogTaskType {
    GET_GPORTAL_SERVER_LOG = 0
}
interface GPortalServerLogJobProps {
    timeStamp: string;
    taskType: ServerLogTaskType;
}
interface JobOpts {
    delay?: number;
}
export declare class ServerSchedulesGportalServerLogQueueService {
    private readonly serverConfigService;
    private readonly userLoginService;
    private readonly killService;
    private readonly adminCommandService;
    private readonly chatMessageService;
    private readonly actionsRecordService;
    private readonly violationsRecordService;
    private readonly economyService;
    constructor(serverConfigService: ServerConfigService, userLoginService: UserLoginService, killService: KillService, adminCommandService: AdminCommandService, chatMessageService: ChatMessageService, actionsRecordService: ActionsRecordService, violationsRecordService: ViolationsRecordService, economyService: EconomyService);
    static updateFlag: any;
    static gPortalLogsInstance: any;
    add(task: GPortalServerLogJobProps, opts?: JobOpts): Promise<void>;
    serverLogQueueHandler(): void;
    getGPortalServerLog(initialize?: boolean): Promise<{
        proccess: boolean;
        error?: undefined;
    } | {
        error: string;
        proccess?: undefined;
    } | {
        proccess: boolean;
        noGPortal: boolean;
    }>;
    initializeGetServerLogsSchedule(): Promise<void>;
    getServerLogsSchedule(): Promise<{
        proccess: boolean;
        error?: undefined;
    } | {
        error: string;
        proccess?: undefined;
    }>;
    proccessKill2LoginLogs(cookies: any, loginLogFileNames: any, killLogFileNames: any): Promise<unknown>;
    proccessLoginLogs(cookies: any, loginLogFileNames: any): Promise<unknown>;
    proccessLoginLog(loginLog: any): Promise<unknown>;
    proccessKillLogs(cookies: any, killLogFileNames: any): Promise<unknown>;
    proccessKillLog(killLog: any): Promise<unknown>;
    bindAndSortLogsArrayToQueueArray(rawLoginLogsJsonArray: any, rawKillLogsJsonArray: any): Promise<unknown>;
    proccessAdmin2ChatLogs(cookies: any, adminLogFileNames: any, chatLogFileNames: any): Promise<unknown>;
    proccessAdminLogs(cookies: any, adminLogFileNames: any): Promise<unknown>;
    proccessAdminLog(adminLog: any): Promise<unknown>;
    proccessChatLogs(cookies: any, chatLogFileNames: any): Promise<unknown>;
    proccessChatLog(chatLog: any): Promise<unknown>;
    proccessActions2ViolationsLogs(cookies: any, actionsLogFileNames: any, violationsLogFileNames: any, economyLogFileNames: any): Promise<unknown>;
    proccessActionsLogs(cookies: any, actionsLogFileNames: any): Promise<unknown>;
    proccessActionsLog(actionsLog: any): Promise<unknown>;
    proccessViolationsLogs(cookies: any, violationsLogFileNames: any): Promise<unknown>;
    proccessViolationsLog(violationsLog: any): Promise<unknown>;
    proccessEconomyLogs(cookies: any, economyLogFileNames: any): Promise<unknown>;
    proccessEconomyLog(economyLog: any): Promise<unknown>;
    proccessServerStatus(): Promise<unknown>;
}
export {};
