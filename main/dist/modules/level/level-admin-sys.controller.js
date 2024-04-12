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
exports.LevelAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const level_admin_sys_1 = require("../../dto/level-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const level_service_1 = require("./level.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const user_dollar_service_1 = require("../user/user-dollar.service");
const morgan_log_1 = require("../../common/morgan-log");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
let LevelAdminSysController = class LevelAdminSysController {
    constructor(userDollarService, levelService) {
        this.userDollarService = userDollarService;
        this.levelService = levelService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetLevelList = yield this.levelService.getLevelList(page, {
                    level: query.level,
                    chargeDollars: query.chargeDollars,
                    discount: query.discount,
                    enableGesture: query.enableGesture,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetLevelList, page)));
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
                const resGetLevel = yield this.levelService.getLevel(query);
                if (resGetLevel && resGetLevel.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetLevel));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该等级'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    add(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resSaveLevel = yield this.levelService.saveLevel(body.level, body.chargeDollars, body.discount, body.enableGesture, body.generalGesture, body.checkInPrize, body.onlinePrize, body.minRewardOnlineTime, body.enableLevelAnnounce);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveLevel, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    update(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetOriginLevel = yield this.levelService.getLevel({ id: body.id });
                const resUpdateLevel = yield this.levelService.updateLevel({
                    id: body.id,
                    level: body.level,
                    chargeDollars: body.chargeDollars,
                    discount: body.discount,
                    enableGesture: body.enableGesture,
                    generalGesture: body.generalGesture,
                    checkInPrize: body.checkInPrize,
                    onlinePrize: body.onlinePrize,
                    minRewardOnlineTime: body.minRewardOnlineTime,
                    enableLevelAnnounce: body.enableLevelAnnounce,
                });
                if (resGetOriginLevel.level !== body.level) {
                    const resUpdateUserDollarLevel = yield this.userDollarService.updateUserDollarLevel(resGetOriginLevel.level, body.level);
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.levelService.getLevel({
                    id: body.id,
                }), ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateInfo(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetOriginLevel = yield this.levelService.getLevel({ id: body.id });
                const resUpdateLevel = yield this.levelService.updateLevel({
                    id: body.id,
                    chargeDollars: body.chargeDollars,
                    discount: body.discount,
                    enableGesture: body.enableGesture,
                    generalGesture: body.generalGesture,
                    checkInPrize: body.checkInPrize,
                    onlinePrize: body.onlinePrize,
                    minRewardOnlineTime: body.minRewardOnlineTime,
                    enableLevelAnnounce: body.enableLevelAnnounce,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.levelService.getLevel({
                    id: body.id,
                }), ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    delete(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetOriginLevel = yield this.levelService.getLevel({ id: query.id });
                const resDeleteLevel = yield this.levelService.deleteLevel({
                    id: query.id,
                });
                const resGetFirstLevel = yield this.levelService.getLevelList((0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 999999 }), {});
                const resUpdateUserDollarLevel = yield this.userDollarService.updateUserDollarLevel(resGetOriginLevel.level, resGetFirstLevel && resGetFirstLevel[0].length ? resGetFirstLevel[0][0].level : null);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resDeleteLevel, ''));
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
        level_admin_sys_1.ListLevelSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [level_admin_sys_1.LevelInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        level_admin_sys_1.AddLevelSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/update'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        level_admin_sys_1.UpdateLevelSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('/updateInfo'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        level_admin_sys_1.UpdateLevelInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "updateInfo", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        level_admin_sys_1.DeleteLevelSysDto, Object]),
    __metadata("design:returntype", Promise)
], LevelAdminSysController.prototype, "delete", null);
LevelAdminSysController = __decorate([
    (0, common_1.Controller)('/levelAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [user_dollar_service_1.UserDollarService,
        level_service_1.LevelService])
], LevelAdminSysController);
exports.LevelAdminSysController = LevelAdminSysController;
//# sourceMappingURL=level-admin-sys.controller.js.map