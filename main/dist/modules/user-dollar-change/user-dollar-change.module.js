"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDollarChangeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_dollar_change_service_1 = require("./user-dollar-change.service");
const user_dollar_change_entity_1 = require("../../entity/user-dollar-change.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
const user_dollar_change_controller_1 = require("./user-dollar-change.controller");
const user_dollar_change_admin_sys_controller_1 = require("./user-dollar-change-admin-sys.controller");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const level_entity_1 = require("../../entity/level.entity");
const level_service_1 = require("../level/level.service");
let UserDollarChangeModule = class UserDollarChangeModule {
};
UserDollarChangeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, user_dollar_change_entity_1.UserDollarChange, level_entity_1.Level,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, user_dollar_change_service_1.UserDollarChangeService, level_service_1.LevelService,
        ],
        controllers: [user_dollar_change_controller_1.UserDollarChangeController, user_dollar_change_admin_sys_controller_1.UserDollarChangeAdminSysController],
    })
], UserDollarChangeModule);
exports.UserDollarChangeModule = UserDollarChangeModule;
//# sourceMappingURL=user-dollar-change.module.js.map