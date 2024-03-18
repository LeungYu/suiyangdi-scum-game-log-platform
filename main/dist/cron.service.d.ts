import { NestSchedule } from 'nest-schedule';
import { ServerConfigService } from "./modules/server-config/server-config.service";
export declare class CronService extends NestSchedule {
    private readonly serverConfigService;
    constructor(serverConfigService: ServerConfigService);
    static checkToolHealth(serverConfigService: any): Promise<void>;
    delOutdateLogAndBackupCronJob(): Promise<void>;
    checkToolHealthCronJob(): Promise<void>;
}
