"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_admin_sys_controller_1 = require("./user-admin-sys.controller");
const user_login_service_1 = require("./user-login.service");
const user_login_entity_1 = require("../../entity/user-login.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const server_config_entity_1 = require("../../entity/server-config.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                user_login_entity_1.UserLogin,
                server_config_entity_1.ServerConfig,
            ])],
        providers: [
            user_login_service_1.UserLoginService,
            server_config_service_1.ServerConfigService
        ],
        controllers: [user_admin_sys_controller_1.UserAdminSysController],
        exports: [
            user_login_service_1.UserLoginService,
            server_config_service_1.ServerConfigService,
        ],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map