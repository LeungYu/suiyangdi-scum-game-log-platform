import { Kill } from "../../entity/kill.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class KillService {
    private readonly killRepository;
    constructor(killRepository: Repository<Kill>);
    saveKills(kills: any[]): Promise<Kill[]>;
    saveKill(killerSteamId: string, killerName: string, killerLocations: string, killerArea: string, victimSteamId: string, victimName: string, victimLocations: string, victimArea: string, distance: number, weapon: string, isEventKill: boolean, occuredTimeStamp: string): Promise<Kill>;
    getKillListLike(page: Page, data?: any): Promise<any>;
    getKill(data: {
        [props: string]: any;
    }): Promise<Kill>;
    getLatestKill(): Promise<Kill>;
    deleteKill(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllKill(): Promise<DeleteResult>;
    cleanKill(): Promise<any>;
}
