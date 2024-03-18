"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfigModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const server_config_entity_1 = require("../../entity/server-config.entity");
const server_config_service_1 = require("./server-config.service");
const server_config_admin_sys_controller_1 = require("./server-config-admin-sys.controller");
const user_login_entity_1 = require("../../entity/user-login.entity");
const kill_entity_1 = require("../../entity/kill.entity");
const admin_command_entity_1 = require("../../entity/admin-command.entity");
const chat_message_entity_1 = require("../../entity/chat-message.entity");
const actions_record_entity_1 = require("../../entity/actions-record.entity");
const violations_record_entity_1 = require("../../entity/violations-record.entity");
const economy_entity_1 = require("../../entity/economy.entity");
const user_login_service_1 = require("../user/user-login.service");
const kill_service_1 = require("../kill/kill.service");
const admin_command_service_1 = require("../admin-command/admin-command.service");
const chat_message_service_1 = require("../chat-message/chat-message.service");
const actions_record_service_1 = require("../actions-record/actions-record.service");
const violations_record_service_1 = require("../violations-record/violations-record.service");
const economy_service_1 = require("../economy/economy.service");
let ServerConfigModule = class ServerConfigModule {
};
ServerConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                server_config_entity_1.ServerConfig, user_login_entity_1.UserLogin, kill_entity_1.Kill, admin_command_entity_1.AdminCommand, chat_message_entity_1.ChatMessage, actions_record_entity_1.ActionsRecord, violations_record_entity_1.ViolationsRecord, economy_entity_1.Economy,
            ])],
        providers: [
            server_config_service_1.ServerConfigService, user_login_service_1.UserLoginService, kill_service_1.KillService, admin_command_service_1.AdminCommandService, chat_message_service_1.ChatMessageService, actions_record_service_1.ActionsRecordService, violations_record_service_1.ViolationsRecordService, economy_service_1.EconomyService,
        ],
        controllers: [server_config_admin_sys_controller_1.ServerConfigAdminSysController],
        exports: [server_config_service_1.ServerConfigService],
    })
], ServerConfigModule);
exports.ServerConfigModule = ServerConfigModule;
//# sourceMappingURL=server-config.module.js.map