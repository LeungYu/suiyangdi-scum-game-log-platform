import { QueueService } from "../queue/queue.service";
import { ServerConfigService } from "../server-config/server-config.service";
declare enum GameRoutineNotificationTaskType {
    SEND_GAME_ROUTINE_NOTIFICATION = 0
}
interface GPortalServerStatusJobProps {
    timeStamp: string;
    taskType: GameRoutineNotificationTaskType;
}
interface JobOpts {
    delay?: number;
}
export declare class ServerSchedulesGameNotificationQueueService {
    private readonly queueService;
    private readonly serverConfigService;
    constructor(queueService: QueueService, serverConfigService: ServerConfigService);
    add(task: GPortalServerStatusJobProps, opts?: JobOpts): Promise<void>;
    serverSchedulesGameNotificationQueueHandler(): void;
    addGameRoutineNotificationToQueue(): Promise<{
        proccess: boolean;
        error?: undefined;
    } | {
        error: any;
        proccess?: undefined;
    }>;
}
export {};
