"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChestOwnershipRecordModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chest_ownership_record_entity_1 = require("../../entity/chest-ownership-record.entity");
const chest_ownership_record_service_1 = require("./chest-ownership-record.service");
const chest_ownership_record_admin_sys_controller_1 = require("./chest-ownership-record-admin-sys.controller");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
let ChestOwnershipRecordModule = class ChestOwnershipRecordModule {
};
ChestOwnershipRecordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([admin_entity_1.Admin, user_entity_1.User, chest_ownership_record_entity_1.ChestOwnershipRecord])],
        providers: [admin_service_1.AdminService, user_service_1.UserService, chest_ownership_record_service_1.ChestOwnershipRecordService],
        controllers: [chest_ownership_record_admin_sys_controller_1.ChestOwnershipRecordAdminSysController],
    })
], ChestOwnershipRecordModule);
exports.ChestOwnershipRecordModule = ChestOwnershipRecordModule;
//# sourceMappingURL=chest-ownership-record.module.js.map