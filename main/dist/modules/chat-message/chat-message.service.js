"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_message_entity_1 = require("../../entity/chat-message.entity");
const typeorm_2 = require("typeorm");
let ChatMessageService = class ChatMessageService {
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    saveChatMessages(chatMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let chatMessage of chatMessages) {
                const element = new chat_message_entity_1.ChatMessage(chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.scumId, chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.steamId, chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.sessionId, chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.type, chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.content, chatMessage === null || chatMessage === void 0 ? void 0 : chatMessage.sendTimeStamp);
                insertArray.push(element);
            }
            return yield this.chatMessageRepository.save(insertArray);
        });
    }
    saveChatMessage(scumId, steamId, sessionId, type, content, sendTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.chatMessageRepository.save(new chat_message_entity_1.ChatMessage(scumId, steamId, sessionId, type, content, sendTimeStamp));
        });
    }
    getChatMessageList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chatMessageRepository.createQueryBuilder('chat-message');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.scumId !== undefined) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
            }
            if (data.type !== undefined) {
                res = res.andWhere("type = :type", { type: data.type });
            }
            if (data.content !== undefined) {
                res = res.andWhere("content = :content", { content: data.content });
            }
            if (data.sendTimeStamp !== undefined) {
                res = res.andWhere("sendTimeStamp = :sendTimeStamp", { sendTimeStamp: data.sendTimeStamp });
            }
            return yield res
                .orderBy(`sendTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getChatMessageListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chatMessageRepository.createQueryBuilder('chatMessage');
            if (data.scumId !== undefined) {
                res = res.andWhere("chatMessage.scumId like :scumId", { scumId: `%${data.scumId}%` });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("chatMessage.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("chatMessage.sessionId like :sessionId", { sessionId: `%${data.sessionId}%` });
            }
            if (data.type !== undefined) {
                res = res.andWhere("chatMessage.type like :type", { type: `%${data.type}%` });
            }
            if (data.content !== undefined) {
                res = res.andWhere("chatMessage.content like :content", { content: `%${data.content}%` });
            }
            if (data.sendTimeStamp !== undefined) {
                res = res.andWhere("chatMessage.sendTimeStamp like :sendTimeStamp", { sendTimeStamp: `%${data.sendTimeStamp}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("chatMessage.sendTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("chatMessage.sendTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`chatMessage.sendTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getChatMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chatMessageRepository.createQueryBuilder('chatMessage');
            if (data && (data.id || data.scumId !== undefined || data.steamId !== undefined || data.sessionId !== undefined || data.type !== undefined || data.content !== undefined || data.sendTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.scumId !== undefined) {
                    res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
                }
                if (data.steamId !== undefined) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.sessionId !== undefined) {
                    res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
                }
                if (data.type !== undefined) {
                    res = res.andWhere("type = :type", { type: data.type });
                }
                if (data.content !== undefined) {
                    res = res.andWhere("content = :content", { content: data.content });
                }
                if (data.sendTimeStamp !== undefined) {
                    res = res.andWhere("sendTimeStamp = :sendTimeStamp", { sendTimeStamp: data.sendTimeStamp });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestSendTimeStamp = yield this.chatMessageRepository
                .createQueryBuilder('chat-message')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`sendTimeStamp`, 'DESC')
                .getOne();
            return (resLatestSendTimeStamp && resLatestSendTimeStamp.sendTimeStamp) ? resLatestSendTimeStamp.sendTimeStamp : null;
        });
    }
    deleteChatMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chatMessageRepository.createQueryBuilder('chatMessage')
                .delete()
                .from(chat_message_entity_1.ChatMessage);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllChatMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chatMessageRepository.createQueryBuilder('chatMessage')
                .delete()
                .from(chat_message_entity_1.ChatMessage);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from chat_message ORDER BY sendTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    clearChatMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.chatMessageRepository
                .clear();
        });
    }
};
ChatMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatMessageService);
exports.ChatMessageService = ChatMessageService;
//# sourceMappingURL=chat-message.service.js.map