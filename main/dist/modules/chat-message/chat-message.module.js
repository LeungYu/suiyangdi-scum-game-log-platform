"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_message_service_1 = require("./chat-message.service");
const chat_message_admin_sys_controller_1 = require("./chat-message-admin-sys.controller");
const chat_message_entity_1 = require("../../entity/chat-message.entity");
const server_config_entity_1 = require("../../entity/server-config.entity");
let ChatMessageModule = class ChatMessageModule {
};
ChatMessageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                chat_message_entity_1.ChatMessage, server_config_entity_1.ServerConfig,
            ])],
        providers: [
            chat_message_service_1.ChatMessageService, chat_message_service_1.ChatMessageService
        ],
        controllers: [chat_message_admin_sys_controller_1.ChatMessageAdminSysController],
    })
], ChatMessageModule);
exports.ChatMessageModule = ChatMessageModule;
//# sourceMappingURL=chat-message.module.js.map