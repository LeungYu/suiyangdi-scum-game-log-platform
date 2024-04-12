"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const level_service_1 = require("./level.service");
const level_controller_1 = require("./level.controller");
const level_admin_sys_controller_1 = require("./level-admin-sys.controller");
const level_entity_1 = require("../../entity/level.entity");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
const user_dollar_service_1 = require("../user/user-dollar.service");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const server_config_entity_1 = require("../../entity/server-config.entity");
let LevelModule = class LevelModule {
};
LevelModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, user_dollar_entity_1.UserDollar, level_entity_1.Level, server_config_entity_1.ServerConfig,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, user_dollar_service_1.UserDollarService, level_service_1.LevelService, server_config_service_1.ServerConfigService,
        ],
        controllers: [level_controller_1.LevelController, level_admin_sys_controller_1.LevelAdminSysController],
    })
], LevelModule);
exports.LevelModule = LevelModule;
//# sourceMappingURL=level.module.js.map