import { NestMiddleware } from '@nestjs/common';
import { ServerConfigService } from "../modules/server-config/server-config.service";
export declare class AuthCheckMiddleware implements NestMiddleware {
    private readonly serverConfigService;
    constructor(serverConfigService: ServerConfigService);
    private realScum;
    use(req: any, res: any, next: () => void): Promise<any>;
}
