"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attachments_service_1 = require("./attachments.service");
const attachments_admin_sys_controller_1 = require("./attachments-admin-sys.controller");
const attachments_entity_1 = require("../../entity/attachments.entity");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
let AttachmentsModule = class AttachmentsModule {
};
AttachmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, attachments_entity_1.Attachments,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, attachments_service_1.AttachmentsService,
        ],
        controllers: [attachments_admin_sys_controller_1.AttachmentsAdminSysController],
    })
], AttachmentsModule);
exports.AttachmentsModule = AttachmentsModule;
//# sourceMappingURL=attachments.module.js.map