import { Response } from 'express';
import { ListEconomySysDto, EconomyInfoSysDto, DeleteEconomySysDto } from '../../dto/economy-admin-sys';
import { Page } from "../../dto/page";
import { EconomyService } from "./economy.service";
export declare class EconomyAdminSysController {
    private readonly economyService;
    constructor(economyService: EconomyService);
    list(page: Page, query: ListEconomySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: EconomyInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(query: DeleteEconomySysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(res: Response): Promise<Response<any, Record<string, any>>>;
}
