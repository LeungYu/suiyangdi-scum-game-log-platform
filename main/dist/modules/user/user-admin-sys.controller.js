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
exports.UserAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const page_1 = require("../../dto/page");
const response_builder_1 = require("../../common/response-builder");
const format_page_query_1 = require("../../common/format-page-query");
const user_login_service_1 = require("./user-login.service");
const user_admin_sys_1 = require("../../dto/user-admin-sys");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const config_1 = require("../../config/config");
const morgan_log_1 = require("../../common/morgan-log");
const auth_admin_sys_controller_1 = require("../auth/auth-admin-sys.controller");
const server_config_service_1 = require("../server-config/server-config.service");
const axios = require('axios');
let UserAdminSysController = class UserAdminSysController {
    constructor(userLoginService, serverConfigService) {
        this.userLoginService = userLoginService;
        this.serverConfigService = serverConfigService;
    }
    checkUserInfo(userInfo, session, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUsers = config_1.Config.adminUsers;
                const user = adminUsers.find(T => Number(T.id) === Number(userInfo.userId));
                if (user && user.id) {
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, user));
                }
                else {
                    return session.destroy(() => {
                        res.cookie(`scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`, '', auth_admin_sys_controller_1.cookieCfg);
                        res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'USER INVALID'));
                    });
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return session.destroy(() => {
                    res.cookie(`scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`, '', auth_admin_sys_controller_1.cookieCfg);
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
                });
            }
        });
    }
    infoUsers(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUsers = config_1.Config.adminUsers;
                const resGetUser = adminUsers.find(T => T.id === query.userId);
                if (resGetUser && (resGetUser === null || resGetUser === void 0 ? void 0 : resGetUser.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetUser));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'INVALID USER'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listUserLogin(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetLoginUserList = yield this.userLoginService.getLoginUserListLike(page, {
                    steamId: query.steamId,
                    userName: query.userName,
                    scumId: query.scumId,
                    timestampStart: query.timestampStart,
                    timestampEnd: query.timestampEnd,
                    type: query.type,
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetLoginUserList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    searchUserLogin(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetDistinctUserLoginList = yield this.userLoginService.getDistinctUserLoginList(query.keyword);
                let newRes = [];
                for (const item of resGetDistinctUserLoginList) {
                    if (newRes.find(T => T.steamId === item.steamId) === undefined) {
                        newRes.push(item);
                    }
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, newRes));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    searchUserLoginMulti(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMultiUserLoginArray = [];
                for (const keyword of query.keywords) {
                    getMultiUserLoginArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resGetDistinctUserLogin = yield this.userLoginService.getDistinctUserLogin(keyword);
                            resolve(resGetDistinctUserLogin);
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(e.toString());
                            resolve(null);
                        }
                    })));
                }
                const resAll = (yield Promise.all(getMultiUserLoginArray)).filter(T => T !== null);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resAll));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    getSteamInfo(query, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = {};
                const resSteamAPIToken = yield this.serverConfigService.getServerConfig({
                    name: 'SteamAPIToken'
                });
                if (resSteamAPIToken && resSteamAPIToken.id && ((_b = (_a = JSON.parse(resSteamAPIToken.value)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length)) {
                    const SteamAPIToken = JSON.parse(resSteamAPIToken.value).value;
                    const urlBasicInfo = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${SteamAPIToken}&steamids=${query.steamId}`;
                    const urlSteamLevelInfo = `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${SteamAPIToken}&steamid=${query.steamId}`;
                    const urlGamePlayInfo = `http://api.steampowered.com/IPlayerService/ClientGetLastPlayedTimes/v1/?key=${SteamAPIToken}&steamids=${query.steamId}`;
                    const urlPlayerBansInfo = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${SteamAPIToken}&steamids=${query.steamId}`;
                    try {
                        const resBasicInfo = yield axios({
                            method: 'GET',
                            url: urlBasicInfo,
                        });
                        if (((_e = (_d = (_c = resBasicInfo === null || resBasicInfo === void 0 ? void 0 : resBasicInfo.data) === null || _c === void 0 ? void 0 : _c.response) === null || _d === void 0 ? void 0 : _d.players) === null || _e === void 0 ? void 0 : _e.length) &&
                            ((_g = (_f = resBasicInfo === null || resBasicInfo === void 0 ? void 0 : resBasicInfo.data) === null || _f === void 0 ? void 0 : _f.response) === null || _g === void 0 ? void 0 : _g.players) instanceof Array &&
                            ((_k = (_j = (_h = resBasicInfo === null || resBasicInfo === void 0 ? void 0 : resBasicInfo.data) === null || _h === void 0 ? void 0 : _h.response) === null || _j === void 0 ? void 0 : _j.players) === null || _k === void 0 ? void 0 : _k.find((T) => T.steamid === query.steamId)) !== undefined) {
                            const targetBasicInfo = (_o = (_m = (_l = resBasicInfo === null || resBasicInfo === void 0 ? void 0 : resBasicInfo.data) === null || _l === void 0 ? void 0 : _l.response) === null || _m === void 0 ? void 0 : _m.players) === null || _o === void 0 ? void 0 : _o.find((T) => T.steamid === query.steamId);
                            results.steamId = targetBasicInfo.steamid;
                            results.personaname = targetBasicInfo.personaname;
                            results.profileUrl = targetBasicInfo.profileurl;
                            results.avatarFull = targetBasicInfo.avatarfull;
                            results.timeCreated = targetBasicInfo.timecreated * 1000;
                        }
                        else {
                            throw new Error(`找不到SteamId${query.steamId}的基本信息`);
                        }
                    }
                    catch (e) {
                        (0, morgan_log_1.logBussiness)(`steam API错误(基本信息): ${e.toString()}, Steam ID: ${query.steamId}`);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `steam API错误(基本信息): ${e.toString()}, Steam ID: ${query.steamId}`));
                    }
                    try {
                        const resSteamLevelInfo = yield axios({
                            method: 'GET',
                            url: urlSteamLevelInfo,
                        });
                        if (typeof ((_q = (_p = resSteamLevelInfo === null || resSteamLevelInfo === void 0 ? void 0 : resSteamLevelInfo.data) === null || _p === void 0 ? void 0 : _p.response) === null || _q === void 0 ? void 0 : _q.player_level) === 'number') {
                            results.playerLevel = (_s = (_r = resSteamLevelInfo === null || resSteamLevelInfo === void 0 ? void 0 : resSteamLevelInfo.data) === null || _r === void 0 ? void 0 : _r.response) === null || _s === void 0 ? void 0 : _s.player_level;
                        }
                        else {
                            throw new Error(`找不到SteamId${query.steamId}的等级信息`);
                        }
                    }
                    catch (e) {
                        (0, morgan_log_1.logBussiness)(`steam API错误(等级信息): ${e.toString()}, Steam ID: ${query.steamId}`);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `steam API错误(等级信息): ${e.toString()}, Steam ID: ${query.steamId}`));
                    }
                    try {
                        const resGamePlayInfo = yield axios({
                            method: 'GET',
                            url: urlGamePlayInfo,
                        });
                        if (((_v = (_u = (_t = resGamePlayInfo === null || resGamePlayInfo === void 0 ? void 0 : resGamePlayInfo.data) === null || _t === void 0 ? void 0 : _t.response) === null || _u === void 0 ? void 0 : _u.games) === null || _v === void 0 ? void 0 : _v.length) &&
                            ((_x = (_w = resGamePlayInfo === null || resGamePlayInfo === void 0 ? void 0 : resGamePlayInfo.data) === null || _w === void 0 ? void 0 : _w.response) === null || _x === void 0 ? void 0 : _x.games) instanceof Array &&
                            ((_0 = (_z = (_y = resGamePlayInfo === null || resGamePlayInfo === void 0 ? void 0 : resGamePlayInfo.data) === null || _y === void 0 ? void 0 : _y.response) === null || _z === void 0 ? void 0 : _z.games) === null || _0 === void 0 ? void 0 : _0.find((T) => T.appid === 513710)) !== undefined) {
                            const targetGamePlayInfo = (_3 = (_2 = (_1 = resGamePlayInfo === null || resGamePlayInfo === void 0 ? void 0 : resGamePlayInfo.data) === null || _1 === void 0 ? void 0 : _1.response) === null || _2 === void 0 ? void 0 : _2.games) === null || _3 === void 0 ? void 0 : _3.find((T) => T.appid === 513710);
                            results.lastPlayTime = targetGamePlayInfo.last_playtime * 1000;
                            results.playHours = targetGamePlayInfo.playtime_forever;
                        }
                        else {
                            throw new Error(`找不到SteamId${query.steamId}的SCUM游戏信息`);
                        }
                    }
                    catch (e) {
                        (0, morgan_log_1.logBussiness)(`steam API错误(SCUM游戏信息): ${e.toString()}, Steam ID: ${query.steamId}`);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `steam API错误(SCUM游戏信息): ${e.toString()}, Steam ID: ${query.steamId}`));
                    }
                    try {
                        const resPlayerBansInfo = yield axios({
                            method: 'GET',
                            url: urlPlayerBansInfo,
                        });
                        if (((_5 = (_4 = resPlayerBansInfo === null || resPlayerBansInfo === void 0 ? void 0 : resPlayerBansInfo.data) === null || _4 === void 0 ? void 0 : _4.players) === null || _5 === void 0 ? void 0 : _5.length) &&
                            ((_6 = resPlayerBansInfo === null || resPlayerBansInfo === void 0 ? void 0 : resPlayerBansInfo.data) === null || _6 === void 0 ? void 0 : _6.players) instanceof Array &&
                            ((_8 = (_7 = resPlayerBansInfo === null || resPlayerBansInfo === void 0 ? void 0 : resPlayerBansInfo.data) === null || _7 === void 0 ? void 0 : _7.players) === null || _8 === void 0 ? void 0 : _8.find((T) => T.SteamId === query.steamId)) !== undefined) {
                            const targetPlayerBansInfo = (_10 = (_9 = resPlayerBansInfo === null || resPlayerBansInfo === void 0 ? void 0 : resPlayerBansInfo.data) === null || _9 === void 0 ? void 0 : _9.players) === null || _10 === void 0 ? void 0 : _10.find((T) => T.SteamId === query.steamId);
                            results.vacBanned = targetPlayerBansInfo.VACBanned;
                            results.communityBanned = targetPlayerBansInfo.CommunityBanned;
                            results.economyBan = targetPlayerBansInfo.EconomyBan;
                            results.numberOfVACBans = targetPlayerBansInfo.NumberOfVACBans;
                            results.numberOfGameBans = targetPlayerBansInfo.NumberOfGameBans;
                            results.daysSinceLastBan = targetPlayerBansInfo.DaysSinceLastBan;
                        }
                        else {
                            throw new Error(`找不到SteamId${query.steamId}的封禁信息`);
                        }
                    }
                    catch (e) {
                        (0, morgan_log_1.logBussiness)(`steam API错误(封禁信息): ${e.toString()}, Steam ID: ${query.steamId}`);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `steam API错误(封禁信息): ${e.toString()}, Steam ID: ${query.steamId}`));
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { results }));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, '请先前往配置管理→服务器设置填写Steam API 密钥'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/checkUserInfo'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "checkUserInfo", null);
__decorate([
    (0, common_1.Get)('/infoUser'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "infoUsers", null);
__decorate([
    (0, common_1.Get)('/listUserLogin'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        user_admin_sys_1.ListUserLoginSysDto, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "listUserLogin", null);
__decorate([
    (0, common_1.Get)('/searchUserLogin'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_admin_sys_1.SearchUserLoginSysDto, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "searchUserLogin", null);
__decorate([
    (0, common_1.Get)('/searchUserLoginMulti'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_admin_sys_1.SearchUserLoginMultiSysDto, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "searchUserLoginMulti", null);
__decorate([
    (0, common_1.Get)('/getSteamInfo'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_admin_sys_1.GetSteamInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], UserAdminSysController.prototype, "getSteamInfo", null);
UserAdminSysController = __decorate([
    (0, common_1.Controller)('/userAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [user_login_service_1.UserLoginService,
        server_config_service_1.ServerConfigService])
], UserAdminSysController);
exports.UserAdminSysController = UserAdminSysController;
//# sourceMappingURL=user-admin-sys.controller.js.map