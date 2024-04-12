import { Response } from 'express';
import { ChatMessageInfoDto } from '../../dto/chat-message';
import { Page } from "../../dto/page";
import { ChatMessageService } from "./chat-message.service";
import { ServerConfigService } from "../server-config/server-config.service";
export declare class ChatMessageController {
    private readonly chatMessageService;
    private readonly serverConfigService;
    constructor(chatMessageService: ChatMessageService, serverConfigService: ServerConfigService);
    list(page: Page, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ChatMessageInfoDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
