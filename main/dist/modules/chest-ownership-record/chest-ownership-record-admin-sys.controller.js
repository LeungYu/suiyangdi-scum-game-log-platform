"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChestOwnershipRecordAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const chest_ownership_record_admin_sys_1 = require("../../dto/chest-ownership-record-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const chest_ownership_record_service_1 = require("./chest-ownership-record.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
let ChestOwnershipRecordAdminSysController = class ChestOwnershipRecordAdminSysController {
    constructor(chestOwnershipRecordService) {
        this.chestOwnershipRecordService = chestOwnershipRecordService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetChestOwnershipRecordListLike = yield this.chestOwnershipRecordService.getChestOwnershipRecordListLike(page, Object.assign({ fromScumId: query.fromScumId, fromSteamId: query.fromSteamId, toScumId: query.toScumId, toSteamId: query.toSteamId, chestId: query.chestId, timestampStart: query.timestampStart, timestampEnd: query.timestampEnd }, query));
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetChestOwnershipRecordListLike, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    info(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetChestOwnershipRecord = yield this.chestOwnershipRecordService.getChestOwnershipRecord(query);
                if (resGetChestOwnershipRecord && resGetChestOwnershipRecord.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetChestOwnershipRecord));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该记录'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    delete(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resDeleteChestOwnershipRecord = yield this.chestOwnershipRecordService.deleteChestOwnershipRecord({
                    id: query.id,
                });
                yield this.adminRecordService.saveAdminRecord(userInfo.userId, '箱子归属记录', `删除箱子归属记录日志(ID:${query.id})`, Date.now() + '');
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resDeleteChestOwnershipRecord, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    clean(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resCleanChestOwnershipRecord = yield this.chestOwnershipRecordService.clearChestOwnershipRecord();
                yield this.adminRecordService.saveAdminRecord(userInfo.userId, '箱子归属记录日志', `清空箱子归属记录日志`, Date.now() + '');
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        chest_ownership_record_admin_sys_1.ListChestOwnershipRecordSysDto, Object]),
    __metadata("design:returntype", Promise)
], ChestOwnershipRecordAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chest_ownership_record_admin_sys_1.ChestOwnershipRecordInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], ChestOwnershipRecordAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        chest_ownership_record_admin_sys_1.DeleteChestOwnershipRecordSysDto, Object]),
    __metadata("design:returntype", Promise)
], ChestOwnershipRecordAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/clean'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], ChestOwnershipRecordAdminSysController.prototype, "clean", null);
ChestOwnershipRecordAdminSysController = __decorate([
    (0, common_1.Controller)('/chestOwnershipRecordAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [chest_ownership_record_service_1.ChestOwnershipRecordService])
], ChestOwnershipRecordAdminSysController);
exports.ChestOwnershipRecordAdminSysController = ChestOwnershipRecordAdminSysController;
//# sourceMappingURL=chest-ownership-record-admin-sys.controller.js.map