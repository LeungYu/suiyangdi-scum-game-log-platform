"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizeRecordModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prize_record_entity_1 = require("../../entity/prize-record.entity");
const prize_record_service_1 = require("./prize-record.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const prize_record_controller_1 = require("./prize-record.controller");
const prize_record_admin_sys_controller_1 = require("./prize-record-admin-sys.controller");
const user_dollar_change_entity_1 = require("../../entity/user-dollar-change.entity");
const user_entity_1 = require("../../entity/user.entity");
const user_service_1 = require("../user/user.service");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const user_dollar_service_1 = require("../user/user-dollar.service");
const server_config_entity_1 = require("../../entity/server-config.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const admin_entity_1 = require("../../entity/admin.entity");
const admin_service_1 = require("../admin/admin.service");
const level_entity_1 = require("../../entity/level.entity");
const level_service_1 = require("../level/level.service");
let PrizeRecordModule = class PrizeRecordModule {
};
PrizeRecordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, prize_record_entity_1.PrizeRecord, user_entity_1.User, user_dollar_entity_1.UserDollar, user_dollar_change_entity_1.UserDollarChange, server_config_entity_1.ServerConfig, level_entity_1.Level,
            ])],
        providers: [
            admin_service_1.AdminService, prize_record_service_1.PrizeRecordService, user_service_1.UserService, user_dollar_service_1.UserDollarService, user_dollar_change_service_1.UserDollarChangeService, server_config_service_1.ServerConfigService, level_service_1.LevelService,
        ],
        controllers: [prize_record_controller_1.PrizeRecordController, prize_record_admin_sys_controller_1.PrizeRecordAdminSysController],
    })
], PrizeRecordModule);
exports.PrizeRecordModule = PrizeRecordModule;
//# sourceMappingURL=prize-record.module.js.map