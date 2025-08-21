import { Response } from 'express';
import { ListChatMessageSysDto, ChatMessageInfoSysDto, DeleteChatMessageSysDto } from '../../dto/chat-message-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ChatMessageService } from "./chat-message.service";
export declare class ChatMessageAdminSysController {
    private readonly chatMessageService;
    constructor(chatMessageService: ChatMessageService);
    list(page: Page, query: ListChatMessageSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ChatMessageInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(query: DeleteChatMessageSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
}
