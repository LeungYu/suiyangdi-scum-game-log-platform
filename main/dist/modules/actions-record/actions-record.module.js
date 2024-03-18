"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsRecordModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const actions_record_entity_1 = require("../../entity/actions-record.entity");
const actions_record_service_1 = require("./actions-record.service");
const actions_record_admin_sys_controller_1 = require("./actions-record-admin-sys.controller");
let ActionsRecordModule = class ActionsRecordModule {
};
ActionsRecordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                actions_record_entity_1.ActionsRecord,
            ])],
        providers: [
            actions_record_service_1.ActionsRecordService,
        ],
        controllers: [actions_record_admin_sys_controller_1.ActionsRecordAdminSysController],
    })
], ActionsRecordModule);
exports.ActionsRecordModule = ActionsRecordModule;
//# sourceMappingURL=actions-record.module.js.map