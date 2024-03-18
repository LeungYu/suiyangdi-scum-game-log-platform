import { ChatMessage } from "../../entity/chat-message.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class ChatMessageService {
    private readonly chatMessageRepository;
    constructor(chatMessageRepository: Repository<ChatMessage>);
    saveChatMessages(chatMessages: any[]): Promise<ChatMessage[]>;
    saveChatMessage(scumId: string, steamId: string, sessionId: string, type: string, content: string, sendTimeStamp: string): Promise<ChatMessage>;
    getChatMessageList(page: Page, data?: any): Promise<any>;
    getChatMessageListLike(page: Page, data?: any): Promise<any>;
    getChatMessage(data: {
        [props: string]: any;
    }): Promise<ChatMessage>;
    getLatestRecordTime(): Promise<string>;
    deleteChatMessage(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    limitAllChatMessage(): Promise<DeleteResult>;
    clearChatMessage(): Promise<any>;
}
