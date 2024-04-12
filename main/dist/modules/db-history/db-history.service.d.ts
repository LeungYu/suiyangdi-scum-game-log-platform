import { Repository } from "typeorm";
import { DbHistory } from "../../entity/db-history.entity";
export declare enum DatabseStatsTaskType {
    DATABASE_STATS = 0
}
interface DatabseStatsJobProps {
    timeStamp: string;
    taskType: DatabseStatsTaskType;
}
interface JobOpts {
    delay?: number;
}
export declare class DbHistoryService {
    private readonly dbHistoryRepository;
    constructor(dbHistoryRepository: Repository<DbHistory>);
    add(task: DatabseStatsJobProps, opts?: JobOpts): Promise<void>;
    databseStatsQueueHandler(): void;
    databseStats(): Promise<{
        process: boolean;
        error?: undefined;
    } | {
        error: any;
        process?: undefined;
    }>;
}
export {};
