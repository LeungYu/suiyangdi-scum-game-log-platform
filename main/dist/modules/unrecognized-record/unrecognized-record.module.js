"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrecognizedRecordModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const unrecognized_record_entity_1 = require("../../entity/unrecognized-record.entity");
const unrecognized_record_service_1 = require("./unrecognized-record.service");
const unrecognized_record_admin_sys_controller_1 = require("./unrecognized-record-admin-sys.controller");
let UnrecognizedRecordModule = class UnrecognizedRecordModule {
};
UnrecognizedRecordModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([unrecognized_record_entity_1.UnrecognizedRecord])],
        providers: [unrecognized_record_service_1.UnrecognizedRecordService],
        controllers: [unrecognized_record_admin_sys_controller_1.UnrecognizedRecordAdminSysController],
    })
], UnrecognizedRecordModule);
exports.UnrecognizedRecordModule = UnrecognizedRecordModule;
//# sourceMappingURL=unrecognized-record.module.js.map