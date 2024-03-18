import { AdminCommand } from "../../entity/admin-command.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class AdminCommandService {
    private readonly adminCommandRepository;
    constructor(adminCommandRepository: Repository<AdminCommand>);
    saveAdminCommands(adminCommands: any[]): Promise<AdminCommand[]>;
    saveAdminCommand(scumId: string, steamId: string, sessionId: string, content: string, sendTimeStamp: string, otherConfig?: any): Promise<AdminCommand>;
    getAdminCommandList(page: Page, data?: any): Promise<any>;
    getAdminCommandListLike(page: Page, data?: any): Promise<any>;
    getAdminCommand(data: {
        [props: string]: any;
    }): Promise<AdminCommand>;
    getLatestRecordTime(): Promise<string>;
    deleteAdminCommand(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllAdminCommand(): Promise<DeleteResult>;
    clearAdminCommand(): Promise<any>;
}
