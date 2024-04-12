import { Response } from 'express';
import { ServerConfigService } from "./server-config.service";
export declare class ServerConfigController {
    private readonly serverConfigService;
    constructor(serverConfigService: ServerConfigService);
    serverFirstTips(res: Response): Promise<Response<any, Record<string, any>>>;
    serverStatus(res: Response): Promise<Response<any, Record<string, any>>>;
    serverConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    scumMapConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    safeZoneConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    hotPointConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    prizeConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    randomPrizeConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    gameMessageConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    FamesConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
    robotConfigs(res: Response): Promise<Response<any, Record<string, any>>>;
}
