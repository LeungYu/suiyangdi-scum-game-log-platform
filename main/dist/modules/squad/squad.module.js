"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const squad_admin_sys_controller_1 = require("./squad-admin-sys.controller");
const squad_controller_1 = require("./squad.controller");
const squad_entity_1 = require("../../entity/squad.entity");
const squad_user_entity_1 = require("../../entity/squad-user.entity");
const squad_history_entity_1 = require("../../entity/squad-history.entity");
const squad_join_request_entity_1 = require("../../entity/squad-join-request.entity");
const queue_entity_1 = require("../../entity/queue.entity");
const user_entity_1 = require("../../entity/user.entity");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const user_dollar_change_entity_1 = require("../../entity/user-dollar-change.entity");
const level_entity_1 = require("../../entity/level.entity");
const admin_entity_1 = require("../../entity/admin.entity");
const server_config_entity_1 = require("../../entity/server-config.entity");
const squad_service_1 = require("./squad.service");
const squad_user_service_1 = require("./squad-user.service");
const squad_history_service_1 = require("./squad-history.service");
const squad_join_request_service_1 = require("./squad-join-request.service");
const queue_service_1 = require("../queue/queue.service");
const user_service_1 = require("../user/user.service");
const user_dollar_service_1 = require("../user/user-dollar.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const level_service_1 = require("../level/level.service");
const admin_service_1 = require("../admin/admin.service");
const server_config_service_1 = require("../server-config/server-config.service");
let SquadModule = class SquadModule {
};
SquadModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                squad_entity_1.Squad, squad_user_entity_1.SquadUser, squad_history_entity_1.SquadHistory, squad_join_request_entity_1.SquadJoinRequest, user_entity_1.User, admin_entity_1.Admin, server_config_entity_1.ServerConfig, user_dollar_entity_1.UserDollar, user_dollar_change_entity_1.UserDollarChange, level_entity_1.Level, queue_entity_1.Queue,
            ])],
        providers: [
            squad_service_1.SquadService,
            squad_user_service_1.SquadUserService,
            squad_history_service_1.SquadHistoryService,
            squad_join_request_service_1.SquadJoinRequestService,
            user_service_1.UserService,
            user_dollar_service_1.UserDollarService,
            user_dollar_change_service_1.UserDollarChangeService,
            level_service_1.LevelService,
            admin_service_1.AdminService,
            server_config_service_1.ServerConfigService,
            queue_service_1.QueueService,
        ],
        controllers: [squad_admin_sys_controller_1.SquadAdminSysController, squad_controller_1.SquadController],
    })
], SquadModule);
exports.SquadModule = SquadModule;
//# sourceMappingURL=squad.module.js.map