import { ServerConfigService } from "../server-config/server-config.service";
import { KillService } from "../kill/kill.service";
import { UserLoginService } from "../user/user-login.service";
import { AdminCommandService } from "../admin-command/admin-command.service";
import { ChatMessageService } from "../chat-message/chat-message.service";
import { ActionsRecordService } from "../actions-record/actions-record.service";
import { ViolationsRecordService } from "../violations-record/violations-record.service";
import { EconomyService } from "../economy/economy.service";
export declare enum ServerLogTaskType {
    GET_GGHOST_SERVER_LOG = 0
}
interface GGHostServerLogJobProps {
    timeStamp: string;
    taskType: ServerLogTaskType;
}
interface JobOpts {
    delay?: number;
}
export declare class ServerSchedulesGGHostServerLogQueueService {
    private readonly serverConfigService;
    private readonly userLoginService;
    private readonly killService;
    private readonly adminCommandService;
    private readonly chatMessageService;
    private readonly actionsRecordService;
    private readonly violationsRecordService;
    private readonly economyService;
    constructor(serverConfigService: ServerConfigService, userLoginService: UserLoginService, killService: KillService, adminCommandService: AdminCommandService, chatMessageService: ChatMessageService, actionsRecordService: ActionsRecordService, violationsRecordService: ViolationsRecordService, economyService: EconomyService);
    static ggHostLogsInstance: any;
    add(task: GGHostServerLogJobProps, opts?: JobOpts): Promise<void>;
    serverLogQueueHandler(): void;
    getGGHostServerLog(initialize?: boolean): Promise<{
        proccess: boolean;
        error?: undefined;
    } | {
        error: string;
        proccess?: undefined;
    } | {
        proccess: boolean;
        noGGHost: boolean;
    }>;
    initializeGetServerLogsSchedule(): Promise<void>;
    getServerLogsSchedule(): Promise<{
        proccess: boolean;
        error?: undefined;
    } | {
        error: string;
        proccess?: undefined;
    }>;
    proccessKill2LoginLogs(loginLogFileNames: any, killLogFileNames: any): Promise<unknown>;
    proccessLoginLogs(loginLogFileNames: any): Promise<unknown>;
    proccessLoginLog(loginLog: any): Promise<unknown>;
    proccessKillLogs(killLogFileNames: any): Promise<unknown>;
    proccessKillLog(killLog: any): Promise<unknown>;
    bindAndSortLogsArrayToQueueArray(rawLoginLogsJsonArray: any, rawKillLogsJsonArray: any): Promise<unknown>;
    proccessAdmin2ChatLogs(adminLogFileNames: any, chatLogFileNames: any): Promise<unknown>;
    proccessAdminLogs(adminLogFileNames: any): Promise<unknown>;
    proccessAdminLog(adminLog: any): Promise<unknown>;
    proccessChatLogs(chatLogFileNames: any): Promise<unknown>;
    proccessChatLog(chatLog: any): Promise<unknown>;
    proccessActions2ViolationsLogs(actionsLogFileNames: any, violationsLogFileNames: any, economyLogFileNames: any): Promise<unknown>;
    proccessActionsLogs(actionsLogFileNames: any): Promise<unknown>;
    proccessActionsLog(actionsLog: any): Promise<unknown>;
    proccessViolationsLogs(violationsLogFileNames: any): Promise<unknown>;
    proccessViolationsLog(violationsLog: any): Promise<unknown>;
    proccessEconomyLogs(economyLogFileNames: any): Promise<unknown>;
    proccessEconomyLog(economyLog: any): Promise<unknown>;
}
export {};
