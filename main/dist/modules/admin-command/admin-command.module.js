"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommandModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_command_service_1 = require("./admin-command.service");
const admin_command_admin_sys_controller_1 = require("./admin-command-admin-sys.controller");
const admin_command_entity_1 = require("../../entity/admin-command.entity");
let AdminCommandModule = class AdminCommandModule {
};
AdminCommandModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_command_entity_1.AdminCommand,
            ])],
        providers: [
            admin_command_service_1.AdminCommandService,
        ],
        controllers: [admin_command_admin_sys_controller_1.AdminCommandAdminSysController],
    })
], AdminCommandModule);
exports.AdminCommandModule = AdminCommandModule;
//# sourceMappingURL=admin-command.module.js.map