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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const page_1 = require("../../dto/page");
const response_builder_1 = require("../../common/response-builder");
const page_data_builder_1 = require("../../common/page-data-builder");
const format_page_query_1 = require("../../common/format-page-query");
const user_decorator_1 = require("../../decorator/user.decorator");
const session_user_1 = require("../../dto/session-user");
const user_1 = require("../../dto/user");
const user_service_1 = require("./user.service");
const user_password_service_1 = require("./user-password.service");
const user_dollar_service_1 = require("./user-dollar.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const user_locations_service_1 = require("./user-locations.service");
const server_config_service_1 = require("../server-config/server-config.service");
const md5_1 = require("../../common/md5");
const admin_service_1 = require("../admin/admin.service");
const auth_controller_1 = require("../auth/auth.controller");
const config_1 = require("../../config/config");
const user_admin_sys_1 = require("../../dto/user-admin-sys");
const user_login_service_1 = require("./user-login.service");
const morgan_log_1 = require("../../common/morgan-log");
const moment = require("moment");
const item_service_1 = require("../item/item.service");
const level_service_1 = require("../level/level.service");
const configs_1 = require("../../utils/configs");
const queue_service_1 = require("../queue/queue.service");
let UserController = class UserController {
    constructor(userService, userLoginService, adminService, userPasswordService, userDollarService, userDollarChangeService, userLocationsService, serverConfigService, itemService, levelService, queueService) {
        this.userService = userService;
        this.userLoginService = userLoginService;
        this.adminService = adminService;
        this.userPasswordService = userPasswordService;
        this.userDollarService = userDollarService;
        this.userDollarChangeService = userDollarChangeService;
        this.userLocationsService = userLocationsService;
        this.serverConfigService = serverConfigService;
        this.itemService = itemService;
        this.levelService = levelService;
        this.queueService = queueService;
    }
    info(userInfo, session, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, morgan_log_1.logBussiness)(`temp, ${JSON.stringify(userInfo)}`);
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetAdmin = yield this.adminService.getAdmin({ userId: user.id });
                    user.role = resGetAdmin && resGetAdmin.id ? (resGetAdmin.isSysAdmin ? 'sysAdmin' : (resGetAdmin.isReadOnly ? 'adminReadOnly' : 'admin')) : 'user';
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, user));
                }
                else {
                    return session.destroy(() => {
                        res.cookie(`scum.store-${config_1.Config.getConf('SCUM_STORE_NO')}.sid`, '', auth_controller_1.cookieCfg);
                        res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                    });
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return session.destroy(() => {
                    res.cookie(`scum.store-${config_1.Config.getConf('SCUM_STORE_NO')}.sid`, '', auth_controller_1.cookieCfg);
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
                });
            }
        });
    }
    listTopNUserDollar(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: params.top && params.top <= 20 ? params.top : 20 });
            try {
                let resGetUserDollarList = yield this.userDollarService.getUserDollarList(page, {}, [{ sort: 'dollars', order: 'DESC' }]);
                resGetUserDollarList[0] = resGetUserDollarList[0].map((T) => {
                    const { id, userInfo, dollars, level, levelExpireTimeStamp } = T;
                    return { id, userName: userInfo.userName, dollars, level: levelExpireTimeStamp === null || levelExpireTimeStamp >= Date.now() ? level : 0 };
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetUserDollarList[0]));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listTopNUserChargeDollars(params, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: params.top && params.top <= 20 ? params.top : 20 });
            try {
                let resGetUserDollarList = yield this.userDollarService.getUserDollarList(page, {}, [{ sort: 'chargeDollars', order: 'DESC' }]);
                resGetUserDollarList[0] = resGetUserDollarList[0].map((T) => {
                    const { id, userInfo, chargeDollars, level, levelExpireTimeStamp } = T;
                    return { id, userName: userInfo.userName, chargeDollars, level: levelExpireTimeStamp === null || levelExpireTimeStamp >= Date.now() ? level : 0 };
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetUserDollarList[0]));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    infoUserLocation(userInfo, page, res) {
        return __awaiter(this, void 0, void 0, function* () {
            page = (0, format_page_query_1.formatPageQuery)(page);
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    const resGetUserLocationsList = yield this.userLocationsService.getUserLocationsList(page, {
                        userId: user.id
                    });
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetUserLocationsList, page)));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    checkUserLogin(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    const resGetLatestUserLoginListBySteamId = yield this.userLoginService.getLatestUserLoginListBySteamId(user.steamId);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                        result: resGetLatestUserLoginListBySteamId && resGetLatestUserLoginListBySteamId.id ? (resGetLatestUserLoginListBySteamId.logoutTimeStamp ? false : true) : false
                    }));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    add(body, res, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkUserName = yield this.userService.getUser({ userName: body.userName });
                if (checkUserName && checkUserName.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '该用户名已注册'));
                }
                const checkSteamId = yield this.userService.getUser({ steamId: body.steamId });
                if (checkSteamId && checkSteamId.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '该Steam ID已注册'));
                }
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                if (GameType === 'scum') {
                    const resEnableSignUpSteamIdValidation = yield this.serverConfigService.getServerConfig({ name: 'EnableSignUpSteamIdValidation' });
                    if (resEnableSignUpSteamIdValidation && resEnableSignUpSteamIdValidation.id && JSON.parse(resEnableSignUpSteamIdValidation.value).value) {
                        const checkLogin = yield this.userLoginService.getUserLogin({ steamId: body.steamId });
                        if (!(checkLogin && checkLogin.id)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '本服已开启注册防护，请先登录游戏服务器创建角色后再注册商城'));
                        }
                    }
                }
                const checkEmail = yield this.userService.getUser({ email: body.email });
                if (checkEmail && checkEmail.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '该邮箱已注册'));
                }
                const checkPhone = yield this.userService.getUser({ phone: body.phone });
                if (checkPhone && checkPhone.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '手机号已注册'));
                }
                const resEnableSignupAutoDollars = yield this.serverConfigService.getServerConfig({ name: 'EnableSignupAutoDollars' });
                const EnableSignupAutoDollars = resEnableSignupAutoDollars && resEnableSignupAutoDollars.id ? JSON.parse(resEnableSignupAutoDollars.value).value : null;
                const resSignupAutoDollars = yield this.serverConfigService.getServerConfig({ name: 'SignupAutoDollars' });
                const SignupAutoDollars = resSignupAutoDollars && resSignupAutoDollars.id ? JSON.parse(resSignupAutoDollars.value).value : null;
                let buyWelcomeDidiCarTime;
                try {
                    const welcomeDidiCarItem = yield this.itemService.getItem({ type: 'special-welcome-didi' });
                    const configs = JSON.parse(welcomeDidiCarItem.configs);
                    buyWelcomeDidiCarTime = configs.multiTime;
                }
                catch (e) {
                    console.log('注册 - 获取滴滴车配置错误: ');
                    console.log(e.toString());
                    buyWelcomeDidiCarTime = 7;
                }
                const resSaveUser = yield this.userService.saveUser(body.email, body.phone, body.steamId, body.userName, false, buyWelcomeDidiCarTime);
                const resSaveUserPassword = yield this.userPasswordService.saveUserPassword(resSaveUser.id, (0, md5_1.md5)(body.password));
                const resSaveUserDollar = yield this.userDollarService.saveUserDollar(resSaveUser.id, EnableSignupAutoDollars === true ? SignupAutoDollars : 0);
                const user = yield this.userService.getUser({ userId: resSaveUser.id });
                const sessionUser = {
                    userId: user.id,
                    steamId: user.steamId,
                    permissions: [],
                    role: 'user'
                };
                session.user = sessionUser;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, user, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateUser(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userInfo || !userInfo.userId || !((userInfo.userId + '').length)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
                else {
                    const originUser = yield this.userService.getUser({ userId: userInfo.userId });
                    if (originUser && originUser.id) {
                        const checkUserName = yield this.userService.getUser({ userName: body.userName });
                        if (checkUserName && checkUserName.id) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '该用户名已使用'));
                        }
                        const resUpdateUser = yield this.userService.updateUser({
                            id: userInfo.userId,
                            userName: body.userName
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.userService.getUser({ userId: userInfo.userId }), ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到用户'));
                    }
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateUserPassword(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userInfo || !userInfo.userId || !((userInfo.userId + '').length)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
                else {
                    const md5OriginPassword = (0, md5_1.md5)(body.originPassword);
                    const userPassword = yield this.userPasswordService.getUserPassword(userInfo.userId);
                    if (md5OriginPassword === userPassword.password) {
                        const md5Password = (0, md5_1.md5)(body.password);
                        const resUpdateUserPassword = yield this.userPasswordService.updateUserPassword({
                            id: userPassword.id,
                            userId: userPassword.userId,
                            password: md5Password,
                            updateTimeStamp: Date.now() + ''
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '原密码错误'));
                    }
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    userCheckIn(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTimeStamp = Date.now();
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    const resCheckInCDType = yield this.serverConfigService.getServerConfig({ name: 'CheckInCDType' });
                    const CheckInCDType = resCheckInCDType && resCheckInCDType.id ? JSON.parse(resCheckInCDType.value).value : null;
                    console.log(CheckInCDType);
                    console.log(currentTimeStamp);
                    console.log(parseInt(moment(parseInt(user.lastCheckInTimeStamp, 10)).endOf('day').format('x')));
                    if (!user.lastCheckInTimeStamp || (CheckInCDType === '24h' && (currentTimeStamp - user.lastCheckInTimeStamp >= 1000 * 60 * 60 * 24)) || (CheckInCDType === '0am' && (currentTimeStamp > parseInt(moment(parseInt(user.lastCheckInTimeStamp, 10)).endOf('day').format('x'))))) {
                        const resUpdateUserInfo = yield this.userService.updateUser({
                            id: user.id,
                            lastCheckInTimeStamp: currentTimeStamp + ''
                        });
                        const resUserCheckInPrize = yield this.serverConfigService.getServerConfig({ name: 'UserCheckInPrize' });
                        const UserCheckInPrize = JSON.parse(resUserCheckInPrize.value).value ? JSON.parse(resUserCheckInPrize.value).value : 0;
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelCheckInPrize = resGetLevel.checkInPrize;
                        const finalCheckInPrize = (levelCheckInPrize === null || levelCheckInPrize === undefined) ? UserCheckInPrize : levelCheckInPrize;
                        if (finalCheckInPrize > 0) {
                            const resUpdateUserInfo = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, finalCheckInPrize);
                            const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, finalCheckInPrize, '签到奖励');
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, `签到成功，奖励${finalCheckInPrize}美金`));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, CheckInCDType === '24h' ? '每次签到应间隔24小时' : '当天已经签到，请在次日零点后再签到'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateUserLogins(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let rawGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                let gameType = JSON.parse(rawGameType.value).value;
                if (gameType !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '当前游戏不可用'));
                }
                const illgealRecord = body.records.filter((T) => {
                    var _a, _b, _c;
                    return !(((_a = T === null || T === void 0 ? void 0 : T.scumId) === null || _a === void 0 ? void 0 : _a.length) &&
                        ((_b = T === null || T === void 0 ? void 0 : T.steamId) === null || _b === void 0 ? void 0 : _b.length) &&
                        ((T === null || T === void 0 ? void 0 : T.status) === 'login' || (T === null || T === void 0 ? void 0 : T.status) === 'logout') &&
                        ((_c = T === null || T === void 0 ? void 0 : T.timeStamp) === null || _c === void 0 ? void 0 : _c.length));
                });
                if (illgealRecord === null || illgealRecord === void 0 ? void 0 : illgealRecord.length) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '数据不合法'));
                }
                let rawEnableKill2LoginDollars = yield this.serverConfigService.getServerConfig({ name: 'EnableKill2LoginDollars' });
                let enableKill2LoginDollars = JSON.parse(rawEnableKill2LoginDollars.value).value;
                let resOnlineRewardPerMinute = yield this.serverConfigService.getServerConfig({ name: 'OnlineRewardPerMinute' });
                let rawOnlineRewardPerMinute = JSON.parse(resOnlineRewardPerMinute.value).value;
                let onlineRewardPerMinute = rawOnlineRewardPerMinute ? rawOnlineRewardPerMinute : 2;
                let resMinRewardOnlineTime = yield this.serverConfigService.getServerConfig({ name: 'MinRewardOnlineTime' });
                let rawMinRewardOnlineTime = JSON.parse(resMinRewardOnlineTime.value).value;
                let minRewardOnlineTime = rawMinRewardOnlineTime ? rawMinRewardOnlineTime : 30;
                let resMaxOnlineReward = yield this.serverConfigService.getServerConfig({ name: 'MaxOnlineReward' });
                let rawMaxOnlineReward = JSON.parse(resMaxOnlineReward.value).value;
                let maxOnlineReward = rawMaxOnlineReward ? rawMaxOnlineReward : 0;
                let IsLogUTCTime = yield this.serverConfigService.getServerConfig({ name: 'IsLogUTCTime' });
                IsLogUTCTime = JSON.parse(IsLogUTCTime.value).value;
                const resEnableLoginLogoutQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableLoginLogoutQueue' });
                const enableLoginLogoutQueue = resEnableLoginLogoutQueue && resEnableLoginLogoutQueue.id ? JSON.parse(resEnableLoginLogoutQueue.value).value : null;
                const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                const enableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                const results = [];
                for (const record of body.records) {
                    try {
                        if (record.status === 'login') {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【类型】登录记录 -【${record.scumId}】`);
                            const resRawGetUserLoginList = yield this.userLoginService.getUserLoginList((0, format_page_query_1.formatPageQuery)({
                                pageSize: 999999,
                                pageNum: 1
                            }), { steamId: record.steamId, status: 'login' });
                            const resGetUserLoginList = resRawGetUserLoginList[0];
                            if (resGetUserLoginList && resGetUserLoginList.length) {
                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【步骤】删除${record.scumId}的异常记录`);
                                const deletePromiseArray = [];
                                for (const illegalUserLogin of resGetUserLoginList) {
                                    deletePromiseArray.push(new Promise((resolvedDeleteUserLogin) => resolvedDeleteUserLogin(this.userLoginService.deleteUserLogin({ id: illegalUserLogin.id }))));
                                }
                                yield Promise.all(deletePromiseArray);
                            }
                            try {
                                const resSaveUserLogin = yield this.userLoginService.saveUserLogin(record.scumId, record.steamId, '1', 'N/A', record.status, record.timeStamp, undefined, {});
                                if (!resSaveUserLogin) {
                                    (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】保存登录记录到login表中失败, 关键词：${JSON.stringify(record)}`);
                                }
                            }
                            catch (e) {
                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】保存登录记录到login表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                            }
                            if (enableLoginLogoutQueue) {
                                if (enableKill2LoginDollars) {
                                    const resGetUser = yield this.userService.getUser({ steamId: record.steamId });
                                    try {
                                        let commands;
                                        if (resGetUser && resGetUser.id) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】注册用户登录：${resGetUser.userName}`);
                                            const resUpdateUser = yield this.userService.updateUser({
                                                id: resGetUser.id,
                                                lastLoginTimeStamp: record.timeStamp,
                                                lastLogoutTimeStamp: null,
                                            });
                                            const resGetUserDollar = yield this.userDollarService.getUserDollar(resGetUser.id);
                                            resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                                            resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                                            const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                                            const levelGeneralGesture = resGetLevel.generalGesture;
                                            const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                                            commands = (0, configs_1.createLogin2LogoutTips)(resGetUser.userName + '(v)', record.status, minRewardOnlineTime, false, undefined, undefined, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, undefined, enableEnglishQueue ? undefined : 'cn');
                                        }
                                        else {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】非注册用户登录：${record.scumId}`);
                                            commands = (0, configs_1.createLogin2LogoutTips)(record.scumId, record.status, minRewardOnlineTime, false, undefined, undefined, undefined, undefined, undefined, enableEnglishQueue ? undefined : 'cn');
                                        }
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】保存登录提示到queue表：${record.scumId}`);
                                        const resSaveLoginCommandsQueueItem = this.queueService.saveQueueItem(commands, 'loginMsg');
                                        if (!resSaveLoginCommandsQueueItem) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】保存登录提示到queue表中失败, 关键词：${JSON.stringify(record)}`);
                                        }
                                    }
                                    catch (e) {
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】保存登录提示到queue表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                                    }
                                }
                            }
                        }
                        else {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【类型】退出登录记录 - ${record.sessionId}`);
                            const resRawGetCurrentUserLoginList = yield this.userLoginService.getUserLoginList((0, format_page_query_1.formatPageQuery)({
                                pageSize: 999999,
                                pageNum: 1
                            }), { status: 'login', logoutTimeStamp: null });
                            const resGetCurrentUserLoginList = resRawGetCurrentUserLoginList[0];
                            if (resGetCurrentUserLoginList && resGetCurrentUserLoginList.length) {
                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】找到对应session - ${record.sessionId} - ${resGetCurrentUserLoginList[0].scumId}`);
                                const currentUserLogin = resGetCurrentUserLoginList[0];
                                const currentUserLogout = currentUserLogin;
                                currentUserLogout.status = record.status;
                                currentUserLogout.logoutTimeStamp = record.timeStamp;
                                try {
                                    const resSaveUserLogout = yield this.userLoginService.updateUserLogin(currentUserLogout);
                                    if (!resSaveUserLogout) {
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】保存退出登录记录到login表中失败, 关键词：${JSON.stringify(record)}`);
                                    }
                                }
                                catch (e) {
                                    (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】保存退出登录记录到login表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                                }
                                if (enableKill2LoginDollars) {
                                    const resGetUser = yield this.userService.getUser({ steamId: currentUserLogout.steamId });
                                    let resGetUserDollar;
                                    (0, morgan_log_1.logServerKill2LoginLog)(true, currentUserLogout.logoutTimeStamp, currentUserLogout.loginTimeStamp);
                                    let change;
                                    let finalMinRewardOnlineTime;
                                    let finalOnlineRewardPerMinute;
                                    let onlineTime;
                                    let sumCurrentLoginReward = 0;
                                    try {
                                        let commands;
                                        if (resGetUser && resGetUser.id) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】注册用户退出登录：${resGetUser.userName}`);
                                            const resUpdateUser = yield this.userService.updateUser({
                                                id: resGetUser.id,
                                                lastLogoutTimeStamp: record.timeStamp,
                                            });
                                            resGetUserDollar = yield this.userDollarService.getUserDollar(resGetUser.id);
                                            resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                                            resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                                            const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                                            const levelGeneralGesture = resGetLevel.generalGesture;
                                            const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                                            onlineTime = Math.floor((currentUserLogout.logoutTimeStamp - currentUserLogout.loginTimeStamp) / 1000 / 60);
                                            const levelMinRewardOnlineTime = resGetLevel.minRewardOnlineTime;
                                            const levelOnlinePrize = resGetLevel.onlinePrize;
                                            finalMinRewardOnlineTime = (levelMinRewardOnlineTime === null || levelMinRewardOnlineTime === undefined) ? minRewardOnlineTime : levelMinRewardOnlineTime;
                                            finalOnlineRewardPerMinute = (levelOnlinePrize === null || levelOnlinePrize === undefined) ? onlineRewardPerMinute : levelOnlinePrize;
                                            change = onlineTime * finalOnlineRewardPerMinute;
                                            let sumCurrentLoginReward = 0;
                                            if (maxOnlineReward > 0) {
                                                const checkDateStart = moment(currentUserLogout.loginTimeStamp).startOf('day').valueOf();
                                                const checkDateEnd = moment(currentUserLogout.loginTimeStamp).endOf('day').valueOf();
                                                const resGetLoginUserList = yield this.userLoginService.getLoginUserListLike({ pageNum: 1, pageSize: 99999 }, { steamId: resGetUser.steamId, timestampStart: checkDateStart, timestampEnd: checkDateEnd });
                                                for (const userLogin of resGetLoginUserList[0]) {
                                                    sumCurrentLoginReward += Math.floor((userLogin.logoutTimeStamp - userLogin.loginTimeStamp) / 1000 / 1000 / 60) * finalOnlineRewardPerMinute;
                                                }
                                            }
                                            if (enableLoginLogoutQueue) {
                                                commands = (0, configs_1.createLogin2LogoutTips)(resGetUser.userName + '(v)', record.status, finalMinRewardOnlineTime, !(!(maxOnlineReward) || (sumCurrentLoginReward + change <= maxOnlineReward)), onlineTime, change, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, undefined, enableEnglishQueue ? undefined : 'cn');
                                            }
                                        }
                                        else {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】非注册用户退出登录：${currentUserLogout.scumId}`);
                                            if (enableLoginLogoutQueue) {
                                                commands = (0, configs_1.createLogin2LogoutTips)(currentUserLogout.scumId, currentUserLogout.status, finalMinRewardOnlineTime, !(!(maxOnlineReward) || (sumCurrentLoginReward + change <= maxOnlineReward)), undefined, undefined, undefined, undefined, undefined, enableEnglishQueue ? undefined : 'cn');
                                            }
                                        }
                                        if (enableLoginLogoutQueue) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】保存登录提示到queue表：${currentUserLogout.scumId}`);
                                            const resSaveLoginCommandsQueueItem = this.queueService.saveQueueItem(commands, 'loginMsg');
                                            if (!resSaveLoginCommandsQueueItem) {
                                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】保存登录提示到queue表中失败, 关键词：${JSON.stringify(record)}`);
                                            }
                                        }
                                    }
                                    catch (e) {
                                        if (enableLoginLogoutQueue) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】保存登录提示到queue表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                                        }
                                    }
                                    if (resGetUser && resGetUser.id && onlineTime >= finalMinRewardOnlineTime) {
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, `【状态】记录奖励时长：${onlineTime} - ${resGetUser.userName}`);
                                        if (!maxOnlineReward || (sumCurrentLoginReward + change <= maxOnlineReward)) {
                                            try {
                                                const resUpdateDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, change);
                                                if (!resUpdateDollars) {
                                                    (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】更新在线时长奖励到user-dollar表中失败, 关键词：${JSON.stringify(record)}`);
                                                }
                                            }
                                            catch (e) {
                                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】更新在线时长奖励到user-dollar表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                                            }
                                            try {
                                                const resSaveDollarChange = yield this.userDollarChangeService.saveUserDollarChange(resGetUser.id, change, `在线时长：${onlineTime}分钟，奖励${change.toFixed(2)}美金`);
                                                if (!resSaveDollarChange) {
                                                    (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】保存在线时长奖励记录到user-dollar-change表中失败, 关键词：${JSON.stringify(record)}`);
                                                }
                                            }
                                            catch (e) {
                                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】保存在线时长奖励记录到user-dollar-change表中失败, 关键词：${JSON.stringify(record)}`, e.toString());
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                (0, morgan_log_1.logServerKill2LoginLog)(true, `【警告】${record.sessionId}没有已经登录的记录`);
                            }
                        }
                    }
                    catch (e) {
                        results.push(Object.assign(Object.assign({}, record), { error: e.toString() }));
                        (0, morgan_log_1.logServerKill2LoginLog)(true, `【错误】处理原生击杀日志`, e.toString());
                    }
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    results
                }, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, common_1.Get)('/listTopNUserDollar'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.ListTopNUsersDollarDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listTopNUserDollar", null);
__decorate([
    (0, common_1.Get)('/listTopNUserChargeDollars'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.ListTopNUsersChargeDollarsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listTopNUserChargeDollars", null);
__decorate([
    (0, common_1.Get)('/infoUserLocation'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        page_1.Page, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "infoUserLocation", null);
__decorate([
    (0, common_1.Get)('/checkUserLogin'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        user_admin_sys_1.CheckUserLoginSysDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkUserLogin", null);
__decorate([
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.AddUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/updateUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        user_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)('/updateUserPassword'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        user_1.UpdateUserPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserPassword", null);
__decorate([
    (0, common_1.Post)('/userCheckIn'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        user_1.UserCheckInDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userCheckIn", null);
__decorate([
    (0, common_1.Post)('/updateUserLogins'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        user_1.UpdateUserLoginsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserLogins", null);
UserController = __decorate([
    (0, common_1.Controller)('/user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_login_service_1.UserLoginService,
        admin_service_1.AdminService,
        user_password_service_1.UserPasswordService,
        user_dollar_service_1.UserDollarService,
        user_dollar_change_service_1.UserDollarChangeService,
        user_locations_service_1.UserLocationsService,
        server_config_service_1.ServerConfigService,
        item_service_1.ItemService,
        level_service_1.LevelService,
        queue_service_1.QueueService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map