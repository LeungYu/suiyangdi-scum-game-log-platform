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
exports.SquadController = void 0;
const common_1 = require("@nestjs/common");
const squad_1 = require("../../dto/squad");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
const user_service_1 = require("../user/user.service");
const squad_service_1 = require("./squad.service");
const squad_user_service_1 = require("./squad-user.service");
const squad_history_service_1 = require("./squad-history.service");
const squad_join_request_service_1 = require("./squad-join-request.service");
const server_config_service_1 = require("../server-config/server-config.service");
let SquadController = class SquadController {
    constructor(userService, squadService, squadUserService, squadHistoryService, squadJoinRequestService, serverConfigService) {
        this.userService = userService;
        this.squadService = squadService;
        this.squadUserService = squadUserService;
        this.squadHistoryService = squadHistoryService;
        this.squadJoinRequestService = squadJoinRequestService;
        this.serverConfigService = serverConfigService;
    }
    list(page, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetSquadList = yield this.squadService.getSquadList(page, { status: 'normal' });
                resGetSquadList[0] = resGetSquadList[0].map((T) => {
                    const captainFilter = T.squadUsers ? T.squadUsers.find(T => T.role === 'captain') : undefined;
                    const viceCaptainFilter = T.squadUsers ? T.squadUsers.find(T => T.role === 'viceCaptain') : undefined;
                    return Object.assign(Object.assign({}, T), { createdUser: { userId: T.createdUser ? T.createdUser.id : null, userName: T.createdUser ? T.createdUser.userName : '无' }, captainUserId: captainFilter ? captainFilter.userId : null, viceCaptainUserId: viceCaptainFilter ? viceCaptainFilter.userId : null, squadUsers: T.squadUsers ? T.squadUsers.length : 0 });
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    info(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetSquad = yield this.squadService.getSquad(query);
                if (resGetSquad && resGetSquad.id) {
                    let resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: query.id,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id) {
                        const captainFilter = resGetSquad.squadUsers ? resGetSquad.squadUsers.find(T => T.role === 'captain') : undefined;
                        const viceCaptainFilter = resGetSquad.squadUsers ? resGetSquad.squadUsers.find(T => T.role === 'viceCaptain') : undefined;
                        const _resGetSquad = Object.assign(Object.assign({}, resGetSquadUser), { createdUser: { userId: resGetSquad.createdUser ? resGetSquad.createdUser.id : null, userName: resGetSquad.createdUser ? resGetSquad.createdUser.userName : '无' }, captainUserId: captainFilter ? captainFilter.userId : null, viceCaptainUserId: viceCaptainFilter ? viceCaptainFilter.userId : null, squadUsers: resGetSquad.squadUsers ? resGetSquad.squadUsers.length : 0 });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, _resGetSquad));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有权限查看小队信息'));
                    }
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
    createSquad(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquadUser = yield this.squadUserService.getSquadUser({
                    userId: userInfo.userId
                });
                if (resGetSquadUser && resGetSquadUser.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已加入其他小队，请先退出再创建其他小队'));
                }
                const resGetSquad = yield this.squadService.getSquad({
                    name: body.name
                });
                if (resGetSquad && resGetSquad.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '名称不能与其他小队重复'));
                }
                const resSaveSquad = yield this.squadService.saveSquad(body.name, userInfo.userId);
                const resSaveSquadUser = yield this.squadUserService.saveSquadUser(resSaveSquad.id, userInfo.userId, 'captain');
                const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(resSaveSquad.id, userInfo.userId, 'created');
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.squadService.getSquad({ id: resSaveSquad.id }), ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    submitJoinSquad(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquadUser = yield this.squadUserService.getSquadUser({
                    userId: userInfo.userId
                });
                if (resGetSquadUser && resGetSquadUser.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已加入其他小队，请先退出再创建其他小队'));
                }
                const resGetSquad = yield this.squadService.getSquad({
                    id: body.id
                });
                if (!(resGetSquad && resGetSquad.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '小队不存在'));
                }
                const resGetSquadJoinRequest = yield this.squadJoinRequestService.getSquadJoinRequest({
                    squadId: body.id,
                    userId: userInfo.userId,
                    status: 'pending',
                });
                if (resGetSquadJoinRequest && resGetSquadJoinRequest.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已提交过申请，请不要重复提交'));
                }
                const resSaveSquad = yield this.squadJoinRequestService.saveSquadJoinRequest(body.id, userInfo.userId);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    locateSquadByUser(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetSquadUser = yield this.squadUserService.getSquadUser({
                    userId: userInfo.userId
                });
                if (resGetSquadUser && resGetSquadUser.id) {
                    const resGetSquad = yield this.squadService.getSquad({ id: resGetSquadUser.squadId });
                    if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                        const captainFilter = resGetSquad.squadUsers ? resGetSquad.squadUsers.find(T => T.role === 'captain') : undefined;
                        const viceCaptainFilter = resGetSquad.squadUsers ? resGetSquad.squadUsers.find(T => T.role === 'viceCaptain') : undefined;
                        const _resGetSquad = Object.assign(Object.assign({}, resGetSquad), { createdUser: { userId: resGetSquad.createdUser ? resGetSquad.createdUser.id : null, userName: resGetSquad.createdUser ? resGetSquad.createdUser.userName : '无' }, captainUserId: captainFilter ? captainFilter.userId : null, viceCaptainUserId: viceCaptainFilter ? viceCaptainFilter.userId : null, squadUsers: resGetSquad.squadUsers ? resGetSquad.squadUsers.length : 0 });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, _resGetSquad));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '获取小队信息错误(小队不存在或已解散)'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    updateSquadName(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquadByName = yield this.squadService.getSquad({
                    name: body.name
                });
                if (resGetSquadByName && resGetSquadByName.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '名称不能与其他小队重复'));
                }
                const resGetSquad = yield this.squadService.getSquad({ id: body.id });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: body.id,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && resGetSquadUser.role === 'captain') {
                        const resUpdateSquad = yield this.squadService.updateSquad({
                            id: body.id,
                            name: body.name,
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.squadService.getSquad({
                            id: body.id,
                        }), ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长有权限修改小队信息'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    disbandSquad(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquad = yield this.squadService.getSquad({ id: query.id });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: query.id,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && resGetSquadUser.role === 'captain') {
                        const resUpdateSquad = yield this.squadService.updateSquad({
                            id: query.id,
                            status: 'disband',
                        });
                        const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(query.id, userInfo.userId, 'disband');
                        const resGetSquadUserList = yield this.squadUserService.getSquadUserList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { squadId: query.id });
                        const arrayPromises = [];
                        for (const squadUser of resGetSquadUserList[0]) {
                            squadUser.role !== 'captain' && arrayPromises.push(yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
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
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长有权限解散小队'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    exitSquad(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquadUser = yield this.squadUserService.getSquadUser({
                    userId: userInfo.userId
                });
                if (resGetSquadUser && resGetSquadUser.id) {
                    const resGetSquad = yield this.squadService.getSquad({ id: resGetSquadUser.squadId });
                    if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                        yield this.squadUserService.deleteSquadUser({
                            id: resGetSquadUser.id
                        });
                        yield this.squadHistoryService.saveSquadHistory(resGetSquad.id, userInfo.userId, 'exit');
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '获取小队信息错误(小队不存在或已解散)'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有加入小队或者小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listSquadUser(page, userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetSquad = yield this.squadService.getSquad({ id: query.squadId });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: query.squadId,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id) {
                        page = (0, format_page_query_1.formatPageQuery)(page);
                        const resGetSquadUserList = yield this.squadUserService.getSquadUserList(page, {
                            squadId: query.squadId,
                        });
                        resGetSquadUserList[0] = resGetSquadUserList[0].map((T) => {
                            let { id, user, role, createdTimeStamp, loginInfo } = T;
                            loginInfo = loginInfo && loginInfo.length ? loginInfo.sort((a, b) => b.loginTimeStamp - a.loginTimeStamp) : [];
                            return {
                                id, role, createdTimeStamp,
                                user: { userId: user.id, userName: user.userName },
                                online: loginInfo && loginInfo.length && loginInfo[0].status === 'login'
                            };
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadUserList, page)));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有权限查看小队成员信息'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    kickSquadUser(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                if (body.userId === userInfo.userId) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '不能踢出自己'));
                }
                const resGetSquad = yield this.squadService.getSquad({ id: body.squadId });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: body.squadId,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && (resGetSquadUser.role === 'captain' || resGetSquadUser.role === 'viceCaptain')) {
                        const resGetBeKickedSquadUser = yield this.squadUserService.getSquadUser({
                            squadId: body.squadId,
                            userId: body.userId
                        });
                        if (resGetBeKickedSquadUser && resGetBeKickedSquadUser.id) {
                            if (resGetSquadUser.role === 'viceCaptain' && (resGetBeKickedSquadUser.role === 'captain' || resGetBeKickedSquadUser.role === 'viceCaptain')) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '副队长只能踢出普通成员'));
                            }
                            const resDeleteSquadUser = yield this.squadUserService.deleteSquadUser({
                                squadId: body.squadId,
                                userId: body.userId
                            });
                            const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(body.squadId, body.userId, 'kicked');
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '成员信息不存在'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长才有权限踢出成员'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    transferSquadCaptain(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resGetSquad = yield this.squadService.getSquad({ id: body.squadId });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: body.squadId,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && resGetSquadUser.role === 'captain') {
                        const resGetBeKickedSquadUser = yield this.squadUserService.getSquadUser({
                            squadId: body.squadId,
                            userId: body.userId
                        });
                        if (resGetBeKickedSquadUser && resGetBeKickedSquadUser.id) {
                            const resDeleteOldCaptainSquadUser = yield this.squadUserService.updateSquadUser({
                                squadId: body.squadId,
                                userId: userInfo.userId,
                                role: 'member'
                            });
                            const resAddNewCaptainSquadUser = yield this.squadUserService.updateSquadUser({
                                squadId: body.squadId,
                                userId: body.userId,
                                role: 'captain'
                            });
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '成员信息不存在'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长才有权限转让队长身份'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    addOrDeleteSquadViceCaptain(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
            resGameType.value = JSON.parse(resGameType.value).value;
            if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
            }
            if (body.action !== 'add' && body.action !== 'delete') {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '非法指令'));
            }
            try {
                const resGetSquad = yield this.squadService.getSquad({ id: body.squadId });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: body.squadId,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && resGetSquadUser.role === 'captain') {
                        const resGetBeControlSquadUser = yield this.squadUserService.getSquadUser({
                            squadId: body.squadId,
                            userId: body.userId
                        });
                        if (resGetBeControlSquadUser && resGetBeControlSquadUser.id) {
                            const resControlViceCaptainSquadUser = yield this.squadUserService.updateSquadUser({
                                squadId: body.squadId,
                                userId: body.userId,
                                role: body.action === 'add' ? 'viceCaptain' : 'member'
                            });
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '成员信息不存在'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长才有权限操作副队长身份'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listSquadJoinRequest(userInfo, page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetSquad = yield this.squadService.getSquad({ id: query.squadId });
                if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                    const resGetSquadUser = yield this.squadUserService.getSquadUser({
                        squadId: query.squadId,
                        userId: userInfo.userId
                    });
                    if (resGetSquadUser && resGetSquadUser.id && (resGetSquadUser.role === 'captain' || resGetSquadUser.role === 'viceCaptain')) {
                        page = (0, format_page_query_1.formatPageQuery)(page);
                        const resGetSquadJoinRequestList = yield this.squadJoinRequestService.getSquadJoinRequestList(page, {
                            squadId: query.squadId,
                        });
                        resGetSquadJoinRequestList[0] = resGetSquadJoinRequestList[0]
                            .filter(T => !!T.userInfo)
                            .map((T) => {
                            const { id, userName } = T.userInfo;
                            T.userInfo = { userId: id, userName };
                            return T;
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetSquadJoinRequestList, page)));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长和副队长才有权限查看入队申请'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    processSquadJoinRequest(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                if (!(body.control === 'accepted' || body.control === 'rejected')) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '非法参数'));
                }
                const resGetSquadJoinRequest = yield this.squadJoinRequestService.getSquadJoinRequest({ id: body.id });
                if (resGetSquadJoinRequest && resGetSquadJoinRequest.id) {
                    if (resGetSquadJoinRequest.status !== 'pending') {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该申请已被处理'));
                    }
                    const resGetSquad = yield this.squadService.getSquad({ id: resGetSquadJoinRequest.squadId });
                    if (resGetSquad && resGetSquad.id && resGetSquad.status === 'normal') {
                        const resGetSquadUser = yield this.squadUserService.getSquadUser({
                            squadId: resGetSquadJoinRequest.squadId,
                            userId: userInfo.userId
                        });
                        if (resGetSquadUser && resGetSquadUser.id && (resGetSquadUser.role === 'captain' || resGetSquadUser.role === 'viceCaptain')) {
                            if (body.control === 'accepted') {
                                const resGetSquadUser = yield this.squadUserService.getSquadUserList((0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 999999 }), {
                                    squadId: resGetSquadJoinRequest.squadId,
                                });
                                const resTeamMaxMembers = yield this.serverConfigService.getServerConfig({ name: 'TeamMaxMembers' });
                                if (resTeamMaxMembers && resTeamMaxMembers.id) {
                                    const TeamMaxMembers = JSON.parse(resTeamMaxMembers.value).value;
                                    if (resGetSquadUser[0].length < TeamMaxMembers) {
                                        const resUpdateSquadJoinRequest = yield this.squadUserService.saveSquadUser(resGetSquadJoinRequest.squadId, resGetSquadJoinRequest.userId);
                                    }
                                    else {
                                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '小队人数已超过最大限制，请联系服主'));
                                    }
                                }
                                else {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '小队最大人数配置缺失，请联系服主'));
                                }
                            }
                            const resUpdateSquadJoinRequest = yield this.squadJoinRequestService.updateSquadJoinRequest({
                                id: body.id,
                                status: body.control
                            });
                            const resSaveSquadHistory = yield this.squadHistoryService.saveSquadHistory(resGetSquad.id, resGetSquadJoinRequest.userId, 'join');
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '只有队长才有权限处理入队申请'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该小队或小队已解散'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到申请记录'));
                }
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
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.SquadInfoDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('/createSquad'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.CreateSquadDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "createSquad", null);
__decorate([
    (0, common_1.Post)('/submitJoinSquad'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.SubmitJoinSquadDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "submitJoinSquad", null);
__decorate([
    (0, common_1.Get)('/locateSquadByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "locateSquadByUser", null);
__decorate([
    (0, common_1.Put)('/updateSquadName'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.UpdateSquadNameDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "updateSquadName", null);
__decorate([
    (0, common_1.Delete)('/disbandSquad'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.DisbandSquadDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "disbandSquad", null);
__decorate([
    (0, common_1.Delete)('/exitSquad'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.ExitSquadDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "exitSquad", null);
__decorate([
    (0, common_1.Get)('/listSquadUser'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        session_user_1.SessionUser,
        squad_1.ListSquadUserDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "listSquadUser", null);
__decorate([
    (0, common_1.Post)('/kickSquadUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.KickSquadUserDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "kickSquadUser", null);
__decorate([
    (0, common_1.Put)('/transferSquadCaptain'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.TransferSquadCaptainDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "transferSquadCaptain", null);
__decorate([
    (0, common_1.Put)('/addOrDeleteSquadViceCaptain'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.AddOrDeleteSquadViceCaptainDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "addOrDeleteSquadViceCaptain", null);
__decorate([
    (0, common_1.Get)('/listSquadJoinRequest'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        page_1.Page,
        squad_1.ListSquadJoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "listSquadJoinRequest", null);
__decorate([
    (0, common_1.Put)('/processSquadJoinRequest'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        squad_1.ProcessSquadJoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], SquadController.prototype, "processSquadJoinRequest", null);
SquadController = __decorate([
    (0, common_1.Controller)('/squad'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        squad_service_1.SquadService,
        squad_user_service_1.SquadUserService,
        squad_history_service_1.SquadHistoryService,
        squad_join_request_service_1.SquadJoinRequestService,
        server_config_service_1.ServerConfigService])
], SquadController);
exports.SquadController = SquadController;
//# sourceMappingURL=squad.controller.js.map