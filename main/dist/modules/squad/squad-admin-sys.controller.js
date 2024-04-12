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
exports.SquadAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const squad_admin_sys_1 = require("../../dto/squad-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const user_service_1 = require("../user/user.service");
const squad_service_1 = require("./squad.service");
const squad_user_service_1 = require("./squad-user.service");
const squad_history_service_1 = require("./squad-history.service");
const squad_join_request_service_1 = require("./squad-join-request.service");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
const server_config_service_1 = require("../server-config/server-config.service");
let SquadAdminSysController = class SquadAdminSysController {
    constructor(userService, squadService, squadUserService, squadHistoryService, squadJoinRequestService, serverConfigService) {
        this.userService = userService;
        this.squadService = squadService;
        this.squadUserService = squadUserService;
        this.squadHistoryService = squadHistoryService;
        this.squadJoinRequestService = squadJoinRequestService;
        this.serverConfigService = serverConfigService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetSquadList = yield this.squadService.getSquadListLike(page, {
                    name: query.name,
                    createdByUserName: query.createdByUserName,
                    status: query.status,
                    timestampStart: query.timestampStart,
                    timestampEnd: query.timestampEnd,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadList, page)));
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
                const resGetSquad = yield this.squadService.getSquad(query);
                if (resGetSquad && resGetSquad.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetSquad));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    update(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquad = yield this.squadService.getSquad({
                    name: body.name
                });
                if (resGetSquad && resGetSquad.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '名称不能与其他小队重复'));
                }
                const resGetOriginSquad = yield this.squadService.getSquad({ id: body.id });
                const resUpdateSquad = yield this.squadService.updateSquad({
                    id: body.id,
                    name: body.name,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.squadService.getSquad({
                    id: body.id,
                }), ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    disband(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquad = yield this.squadService.getSquad({
                    id: query.id,
                    status: 'normal',
                });
                if (!(resGetSquad && resGetSquad.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '队伍不存在或者已解散'));
                }
                const resUpdateSquad = yield this.squadService.updateSquad({
                    id: query.id,
                    status: 'disband',
                });
                const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(query.id, userInfo.userId, 'disband');
                const resGetSquadUserList = yield this.squadUserService.getSquadUserList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { squadId: query.id });
                const arrayPromises = [];
                for (const squadUser of resGetSquadUserList[0]) {
                    arrayPromises.push(yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(query.id, squadUser.userId, 'exit');
                            resolve(true);
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(e.toString());
                            resolve(false);
                        }
                    })));
                }
                yield Promise.all(arrayPromises);
                const resDeleteSquadUser = yield this.squadUserService.deleteSquadUser({ squadId: query.id });
                const resDeleteSquadJoinRequest = yield this.squadJoinRequestService.deleteSquadJoinRequest({ squadId: query.id });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
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
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resDeleteSquad = yield this.squadService.deleteSquad({ id: query.id });
                const resDeleteSquadUser = yield this.squadUserService.deleteSquadUser({ squadId: query.id });
                const resDeleteSquadJoinRequest = yield this.squadJoinRequestService.deleteSquadJoinRequest({ squadId: query.id });
                const resDeleteSquadHistory = yield this.squadHistoryService.deleteSquadHistory({ squadId: query.id });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    searchSquads(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetDistinctSquadList = yield this.squadService.getDistinctSquadList(query.keyword);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetDistinctSquadList));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listSquadUser(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetSquadUserList = yield this.squadUserService.getSquadUserList(page, {
                    squadId: query.squadId,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadUserList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listSquadJoinRequest(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetSquadJoinRequestList = yield this.squadJoinRequestService.getSquadJoinRequestList(page, {
                    squadId: query.squadId,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadJoinRequestList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listSquadHistory(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetSquadHistoryList = yield this.squadHistoryService.getSquadHistoryList(page, {
                    squadId: query.squadId,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadHistoryList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
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
        squad_admin_sys_1.ListSquadSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [squad_admin_sys_1.SquadInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Put)('/update'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_admin_sys_1.UpdateSquadSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/disband'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_admin_sys_1.DisbandSquadSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "disband", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_admin_sys_1.DeleteSquadSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('/searchSquads'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [squad_admin_sys_1.SearchSquadsSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "searchSquads", null);
__decorate([
    (0, common_1.Get)('/listSquadUser'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        squad_admin_sys_1.ListSquadUserSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "listSquadUser", null);
__decorate([
    (0, common_1.Get)('/listSquadJoinRequest'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        squad_admin_sys_1.ListSquadJoinRequestSysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "listSquadJoinRequest", null);
__decorate([
    (0, common_1.Get)('/listSquadHistory'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        squad_admin_sys_1.ListSquadHistorySysDto, Object]),
    __metadata("design:returntype", Promise)
], SquadAdminSysController.prototype, "listSquadHistory", null);
SquadAdminSysController = __decorate([
    (0, common_1.Controller)('/squadAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [user_service_1.UserService,
        squad_service_1.SquadService,
        squad_user_service_1.SquadUserService,
        squad_history_service_1.SquadHistoryService,
        squad_join_request_service_1.SquadJoinRequestService,
        server_config_service_1.ServerConfigService])
], SquadAdminSysController);
exports.SquadAdminSysController = SquadAdminSysController;
//# sourceMappingURL=squad-admin-sys.controller.js.map