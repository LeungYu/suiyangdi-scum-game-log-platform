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
exports.ChatMessageController = void 0;
const common_1 = require("@nestjs/common");
const chat_message_1 = require("../../dto/chat-message");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const chat_message_service_1 = require("./chat-message.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
const server_config_service_1 = require("../server-config/server-config.service");
let ChatMessageController = class ChatMessageController {
    constructor(chatMessageService, serverConfigService) {
        this.chatMessageService = chatMessageService;
        this.serverConfigService = serverConfigService;
    }
    list(page, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resStoreRobotScumName = yield this.serverConfigService.getServerConfig({ name: 'StoreRobotScumName' });
                const storeRobotScumName = JSON.parse(resStoreRobotScumName.value).value;
                const resGetChatMessageListLike = yield this.chatMessageService.getChatMessageList(page, {
                    type: 'Global',
                    noRobot: storeRobotScumName !== undefined && storeRobotScumName !== null && storeRobotScumName.length !== 0,
                    robotScumId: storeRobotScumName,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetChatMessageListLike, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    info(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetChatMessage = yield this.chatMessageService.getChatMessage(query);
                if (resGetChatMessage && resGetChatMessage.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetChatMessage));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该记录'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page, Object]),
    __metadata("design:returntype", Promise)
], ChatMessageController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_message_1.ChatMessageInfoDto, Object]),
    __metadata("design:returntype", Promise)
], ChatMessageController.prototype, "info", null);
ChatMessageController = __decorate([
    (0, common_1.Controller)('/chatMessage'),
    __metadata("design:paramtypes", [chat_message_service_1.ChatMessageService,
        server_config_service_1.ServerConfigService])
], ChatMessageController);
exports.ChatMessageController = ChatMessageController;
//# sourceMappingURL=chat-message.controller.js.map