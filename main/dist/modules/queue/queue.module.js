"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const queue_service_1 = require("./queue.service");
const queue_entity_1 = require("../../entity/queue.entity");
const buy_service_1 = require("../buy/buy.service");
const buy_entity_1 = require("../../entity/buy.entity");
const queue_controller_1 = require("./queue.controller");
const queue_admin_sys_controller_1 = require("./queue-admin-sys.controller");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const server_config_entity_1 = require("../../entity/server-config.entity");
const user_login_entity_1 = require("../../entity/user-login.entity");
const user_login_service_1 = require("../user/user-login.service");
let QueueModule = class QueueModule {
};
QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, queue_entity_1.Queue, buy_entity_1.Buy, server_config_entity_1.ServerConfig, user_login_entity_1.UserLogin,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, queue_service_1.QueueService, buy_service_1.BuyService, server_config_service_1.ServerConfigService, user_login_service_1.UserLoginService,
        ],
        controllers: [queue_controller_1.QueueController, queue_admin_sys_controller_1.QueueAdminSysController],
    })
], QueueModule);
exports.QueueModule = QueueModule;
//# sourceMappingURL=queue.module.js.map