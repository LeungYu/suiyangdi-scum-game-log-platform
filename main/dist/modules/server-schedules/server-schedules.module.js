"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const server_config_entity_1 = require("../../entity/server-config.entity");
const user_login_entity_1 = require("../../entity/user-login.entity");
const kill_entity_1 = require("../../entity/kill.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const kill_service_1 = require("../kill/kill.service");
const server_schedules_gportal_server_log_queue_service_1 = require("./server-schedules.gportal-server-log.queue.service");
const server_schedules_nitrado_server_log_queue_service_1 = require("./server-schedules.nitrado-server-log.queue.service");
const server_schedules_gghost_server_log_queue_service_1 = require("./server-schedules.gghost-server-log.queue.service");
const server_schedules_private_server_log_queue_service_1 = require("./server-schedules.private-server-log.queue.service");
const admin_command_entity_1 = require("../../entity/admin-command.entity");
const chat_message_entity_1 = require("../../entity/chat-message.entity");
const actions_record_entity_1 = require("../../entity/actions-record.entity");
const user_login_service_1 = require("../user/user-login.service");
const admin_command_service_1 = require("../admin-command/admin-command.service");
const chat_message_service_1 = require("../chat-message/chat-message.service");
const actions_record_service_1 = require("../actions-record/actions-record.service");
const violations_record_entity_1 = require("../../entity/violations-record.entity");
const violations_record_service_1 = require("../violations-record/violations-record.service");
const chest_ownership_record_entity_1 = require("../../entity/chest-ownership-record.entity");
const chest_ownership_record_service_1 = require("../chest-ownership-record/chest-ownership-record.service");
const vehicle_destruction_record_entity_1 = require("../../entity/vehicle-destruction-record.entity");
const vehicle_destruction_record_service_1 = require("../vehicle-destruction-record/vehicle-destruction-record.service");
const unrecognized_record_entity_1 = require("../../entity/unrecognized-record.entity");
const unrecognized_record_service_1 = require("../unrecognized-record/unrecognized-record.service");
const economy_entity_1 = require("../../entity/economy.entity");
const economy_service_1 = require("../economy/economy.service");
let ServerSchedulesModule = class ServerSchedulesModule {
};
ServerSchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                server_config_entity_1.ServerConfig,
                user_login_entity_1.UserLogin,
                kill_entity_1.Kill,
                admin_command_entity_1.AdminCommand,
                chat_message_entity_1.ChatMessage,
                actions_record_entity_1.ActionsRecord,
                violations_record_entity_1.ViolationsRecord,
                economy_entity_1.Economy,
                chest_ownership_record_entity_1.ChestOwnershipRecord,
                vehicle_destruction_record_entity_1.VehicleDestructionRecord,
                unrecognized_record_entity_1.UnrecognizedRecord,
            ])],
        providers: [
            server_config_service_1.ServerConfigService,
            kill_service_1.KillService,
            server_schedules_gportal_server_log_queue_service_1.ServerSchedulesGportalServerLogQueueService,
            server_schedules_nitrado_server_log_queue_service_1.ServerSchedulesNitradoServerLogQueueService,
            server_schedules_gghost_server_log_queue_service_1.ServerSchedulesGGHostServerLogQueueService,
            server_schedules_private_server_log_queue_service_1.ServerSchedulesPrivateServerLogQueueService,
            user_login_service_1.UserLoginService,
            admin_command_service_1.AdminCommandService,
            chat_message_service_1.ChatMessageService,
            actions_record_service_1.ActionsRecordService,
            violations_record_service_1.ViolationsRecordService,
            economy_service_1.EconomyService,
            chest_ownership_record_service_1.ChestOwnershipRecordService,
            vehicle_destruction_record_service_1.VehicleDestructionRecordService,
            unrecognized_record_service_1.UnrecognizedRecordService,
        ],
    })
], ServerSchedulesModule);
exports.ServerSchedulesModule = ServerSchedulesModule;
//# sourceMappingURL=server-schedules.module.js.map