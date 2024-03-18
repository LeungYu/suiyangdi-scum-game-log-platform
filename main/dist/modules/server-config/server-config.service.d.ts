import { ServerConfig } from "../../entity/server-config.entity";
import { Repository, UpdateResult } from "typeorm";
export declare class ServerConfigService {
    private readonly serverConfigRepository;
    constructor(serverConfigRepository: Repository<ServerConfig>);
    saveItem(name: string, cnName: string, value: any, modify?: boolean): Promise<ServerConfig>;
    updateServerConfig(serverConfig: ServerConfig): Promise<UpdateResult> | undefined;
    getServerConfig(data: {
        [props: string]: any;
    }): Promise<any>;
}
