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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ServerSchedulesGportalServerLogQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSchedulesGportalServerLogQueueService = exports.ServerLogTaskType = void 0;
const common_1 = require("@nestjs/common");
const server_config_service_1 = require("../server-config/server-config.service");
const kill_service_1 = require("../kill/kill.service");
const task_qull_1 = require("../../common/task-qull");
const gportal_logs_1 = require("../../common/gportal-logs");
const format_page_query_1 = require("../../common/format-page-query");
const moment = require("moment");
const morgan_log_1 = require("../../common/morgan-log");
const user_login_service_1 = require("../user/user-login.service");
const admin_command_service_1 = require("../admin-command/admin-command.service");
const chat_message_service_1 = require("../chat-message/chat-message.service");
const actions_record_service_1 = require("../actions-record/actions-record.service");
const violations_record_service_1 = require("../violations-record/violations-record.service");
const economy_service_1 = require("../economy/economy.service");
const scum_log_utils_1 = require("../../common/scum-log-utils");
var ServerLogTaskType;
(function (ServerLogTaskType) {
    ServerLogTaskType[ServerLogTaskType["GET_GPORTAL_SERVER_LOG"] = 0] = "GET_GPORTAL_SERVER_LOG";
})(ServerLogTaskType = exports.ServerLogTaskType || (exports.ServerLogTaskType = {}));
const FAILURE_RETRY_INTERVAL = 3000;
let ServerSchedulesGportalServerLogQueueService = ServerSchedulesGportalServerLogQueueService_1 = class ServerSchedulesGportalServerLogQueueService {
    constructor(serverConfigService, userLoginService, killService, adminCommandService, chatMessageService, actionsRecordService, violationsRecordService, economyService) {
        this.serverConfigService = serverConfigService;
        this.userLoginService = userLoginService;
        this.killService = killService;
        this.adminCommandService = adminCommandService;
        this.chatMessageService = chatMessageService;
        this.actionsRecordService = actionsRecordService;
        this.violationsRecordService = violationsRecordService;
        this.economyService = economyService;
        this.serverLogQueueHandler();
        this.add({
            timeStamp: Date.now() + '',
            taskType: ServerLogTaskType.GET_GPORTAL_SERVER_LOG
        }, {
            delay: 0,
        });
    }
    add(task, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.getServerConfig({ name: 'GPortalLogsRollbackSingleTimeout' });
            const GPortalLogsRollbackSingleTimeout = JSON.parse(resGPortalLogsRollbackSingleTimeout.value).value;
            task_qull_1.SingleGPortalServerLogQueue.add(task, Object.assign(Object.assign({}, opts), { backoff: FAILURE_RETRY_INTERVAL, timeout: GPortalLogsRollbackSingleTimeout || 360000 }));
        });
    }
    serverLogQueueHandler() {
        task_qull_1.SingleGPortalServerLogQueue.on('completed', (job, result) => __awaiter(this, void 0, void 0, function* () {
            if (result.proccess) {
                (0, morgan_log_1.logGPortalProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]success`);
            }
            else {
                (0, morgan_log_1.logGPortalProccessLog)(false, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]skip`);
            }
            let GPortalLogsRollbackInterval = yield this.serverConfigService.getServerConfig({ name: 'GPortalLogsRollbackInterval' });
            GPortalLogsRollbackInterval = JSON.parse(GPortalLogsRollbackInterval.value).value;
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: ServerLogTaskType.GET_GPORTAL_SERVER_LOG,
            }, {
                delay: result.noGPortal === true ? 1000 * 60 : GPortalLogsRollbackInterval,
            });
            job.remove();
        }));
        task_qull_1.SingleGPortalServerLogQueue.on('failed', (job, err) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logGPortalProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]error, resaon:${err}`);
            (0, morgan_log_1.logGPortalProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]retry`);
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: ServerLogTaskType.GET_GPORTAL_SERVER_LOG,
            }, {
                delay: FAILURE_RETRY_INTERVAL,
            });
            job.remove();
        }));
        task_qull_1.SingleGPortalServerLogQueue.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            const { taskType } = job.data;
            let res = undefined;
            switch (taskType) {
                case ServerLogTaskType.GET_GPORTAL_SERVER_LOG:
                    res = yield this.getGPortalServerLog();
                    break;
                default:
                    break;
            }
            if (res.error === undefined) {
                done(null, res);
            }
            else {
                const { error } = res;
                done(new Error(typeof error === 'object' ? JSON.stringify(error) : error));
            }
        }));
    }
    getGPortalServerLog(initialize) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGetEnableGPortalLogsRollback = yield this.serverConfigService.getServerConfig({ name: 'EnableGPortalLogsRollback' });
            const EnableGPortalLogsRollback = JSON.parse(resGetEnableGPortalLogsRollback.value).value;
            let resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const GameServerType = JSON.parse(resGameServerType.value).value;
            if (EnableGPortalLogsRollback === false || GameServerType !== 'GPORTAL') {
                return {
                    proccess: false,
                    noGPortal: GameServerType !== 'GPORTAL'
                };
            }
            else {
                if (ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance === undefined || ServerSchedulesGportalServerLogQueueService_1.updateFlag === true) {
                    (0, morgan_log_1.logGPortalProccessLog)(true, '--------------------interlize--------------------');
                    yield this.initializeGetServerLogsSchedule();
                    const res = yield this.getServerLogsSchedule();
                    return res;
                }
                else {
                    const res = yield this.getServerLogsSchedule();
                    return res;
                }
            }
        });
    }
    initializeGetServerLogsSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            let ServerId = yield this.serverConfigService.getServerConfig({ name: 'ServerId' });
            ServerId = JSON.parse(ServerId.value).value;
            let GPortalFtpUrl = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPUrl' });
            GPortalFtpUrl = JSON.parse(GPortalFtpUrl.value).value;
            let GPortalFtpAccount = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPAccount' });
            GPortalFtpAccount = JSON.parse(GPortalFtpAccount.value).value;
            let GPortalFtpPassword = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPPassword' });
            GPortalFtpPassword = JSON.parse(GPortalFtpPassword.value).value;
            let ftpHost = '', ftpPort = '', ftpAccount = '', ftpPassword = '';
            let GPortalFtpUrlSplitTest = GPortalFtpUrl && GPortalFtpUrl.split ? GPortalFtpUrl.split(':') : [undefined, undefined];
            if (!!GPortalFtpAccount && !!GPortalFtpPassword &&
                !!GPortalFtpUrlSplitTest[0] && !isNaN(parseInt(GPortalFtpUrlSplitTest[1], 10)) &&
                GPortalFtpUrl !== 'NO_USED_CONFIG' &&
                GPortalFtpAccount !== 'NO_USED_CONFIG' &&
                GPortalFtpPassword !== 'NO_USED_CONFIG') {
                ftpHost = GPortalFtpUrlSplitTest[0];
                ftpPort = GPortalFtpUrlSplitTest[1];
                ftpAccount = GPortalFtpAccount;
                ftpPassword = GPortalFtpPassword;
            }
            ServerSchedulesGportalServerLogQueueService_1.updateFlag = false;
            ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance = new gportal_logs_1.default(ServerId, ftpHost, ftpPort, ftpAccount, ftpPassword, 'server-log');
        });
    }
    getServerLogsSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logGPortalProccessLog)(true, `call: ${new Date().toISOString()}`);
            try {
                yield this.userLoginService.limitAllUserLogin();
                yield this.killService.limitAllKill();
                yield this.adminCommandService.limitAllAdminCommand();
                yield this.chatMessageService.limitAllChatMessage();
                yield this.violationsRecordService.limitAllViolationsRecord();
                yield this.economyService.limitAllEconomy();
                const resGPortalPreservedCookies = yield this.serverConfigService.getServerConfig({ name: 'GPortalPreservedCookies' });
                const GPortalPreservedCookies = resGPortalPreservedCookies && resGPortalPreservedCookies.id ? JSON.parse(resGPortalPreservedCookies.value).value : '';
                const resGetLogsFileNamesJson = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getLogsFileNamesJSon(GPortalPreservedCookies);
                const resGetLogsFileNames = Object.keys(resGetLogsFileNamesJson).map((key) => resGetLogsFileNamesJson[key]);
                const allKillLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('kill') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allLoginLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('login') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allAdminLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('admin') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allChatLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('chat') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allActionsLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('gameplay') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allViolationsLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('violations') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allEconomyLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('economy') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const [resGetKill2LoginLogs, resGetAdmin2ChatLogs, resGetActions2ViolationsLogs, resGetServerStatus] = yield Promise.all([
                    yield this.proccessKill2LoginLogs(GPortalPreservedCookies, allLoginLogFileNames, allKillLogFileNames),
                    yield this.proccessAdmin2ChatLogs(GPortalPreservedCookies, allAdminLogFileNames, allChatLogFileNames),
                    yield this.proccessActions2ViolationsLogs(GPortalPreservedCookies, allActionsLogFileNames, allViolationsLogFileNames, allEconomyLogFileNames),
                    yield this.proccessServerStatus(),
                ]);
                (0, morgan_log_1.logServerKill2LoginLog)(true, `success: get kill/login log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerKill2LoginLog)(true, `result: get kill/login log, add ${resGetKill2LoginLogs.loginProccessedNum === undefined ? 0 : resGetKill2LoginLogs.loginProccessedNum} login logs, add ${resGetKill2LoginLogs.killProccessedNum === undefined ? 0 : resGetKill2LoginLogs.killProccessedNum}kill logs`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `success: get admin/chat log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `result: get admin/chat log, add ${resGetAdmin2ChatLogs.adminProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.adminProccessedNum}admin logs, add ${resGetAdmin2ChatLogs.chatProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.chatProccessedNum}chat logs`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `success: get action/violation log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `result: get action/violation/economy log, add ${resGetActions2ViolationsLogs.actionsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.actionsProccessedNum}action logs, add ${resGetActions2ViolationsLogs.violationsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.violationsProccessedNum}violation logs, add ${resGetActions2ViolationsLogs.economyProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.economyProccessedNum}economy log`);
                (0, morgan_log_1.logServerStatus)(true, `${new Date().toISOString()}`);
                (0, morgan_log_1.logServerStatus)(true, `IP:${resGetServerStatus.IP}OnlinePlayers:${resGetServerStatus.OnlinePlayers}`);
                const resUpdateGPortalServerLogAsyncRecord = this.serverConfigService.updateServerConfig({
                    name: 'GPortalServerLogAsyncRecord',
                    value: JSON.stringify({ value: { recentTimeStamp: Date.now() + '', result: `success: add ${resGetKill2LoginLogs.loginProccessedNum === undefined ? 0 : resGetKill2LoginLogs.loginProccessedNum} login logs, add ${resGetKill2LoginLogs.killProccessedNum === undefined ? 0 : resGetKill2LoginLogs.killProccessedNum}kill logs, add ${resGetAdmin2ChatLogs.adminProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.adminProccessedNum}admin logs, add ${resGetAdmin2ChatLogs.chatProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.chatProccessedNum}chat logs, add ${resGetActions2ViolationsLogs.actionsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.actionsProccessedNum} action log, add ${resGetActions2ViolationsLogs.violationsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.violationsProccessedNum}violation log, add ${resGetActions2ViolationsLogs.economyProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.economyProccessedNum}economy log, ip:${resGetServerStatus.IP}OnlinePlayers:${resGetServerStatus.OnlinePlayers}` } })
                });
                return { proccess: true };
            }
            catch (e) {
                const errorContent = e && e.message ? e.message : e.toString();
                let refreshCookieResult;
                const resUpdateGPortalServerLogAsyncRecord = this.serverConfigService.updateServerConfig({
                    name: 'GPortalServerLogAsyncRecord',
                    value: JSON.stringify({ value: { recentTimeStamp: Date.now() + '', result: `fetch log failed: ${errorContent} | ${refreshCookieResult ? `更新Cookie: ${refreshCookieResult}` : ''}` } })
                });
                (0, morgan_log_1.logGPortalProccessLog)(true, '[retry] get log / server status', e.toString());
                return { error: `[retry] get log / server status:${e.toString()}` };
            }
        });
    }
    proccessKill2LoginLogs(cookies, loginLogFileNames, killLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logServerKill2LoginLog)(true, `[task] process login/kill log`);
            try {
                (0, morgan_log_1.logServerKill2LoginLog)(true, '[process ] fetch login/kill log');
                const [rawLoginLogsJsonArray, rawKillLogsJsonArray] = yield Promise.all([
                    this.proccessLoginLogs(cookies, loginLogFileNames),
                    this.proccessKillLogs(cookies, killLogFileNames)
                ]);
                let binded2SortedQueueArray;
                if (rawLoginLogsJsonArray && rawLoginLogsJsonArray.length && rawKillLogsJsonArray && rawKillLogsJsonArray.length) {
                    (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]sort  login/kill log`);
                    binded2SortedQueueArray = yield this.bindAndSortLogsArrayToQueueArray(rawLoginLogsJsonArray, rawKillLogsJsonArray);
                }
                else if (rawLoginLogsJsonArray && rawLoginLogsJsonArray.length) {
                    binded2SortedQueueArray = rawLoginLogsJsonArray;
                }
                else if (rawKillLogsJsonArray && rawKillLogsJsonArray.length) {
                    binded2SortedQueueArray = rawKillLogsJsonArray;
                }
                if (binded2SortedQueueArray && binded2SortedQueueArray.length) {
                    (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]save sorted data`);
                    let loginProccessedNum = 0, killProccessedNum = 0;
                    for (let queueItem of binded2SortedQueueArray) {
                        if (queueItem.logType === 'login') {
                            loginProccessedNum++;
                            yield this.proccessLoginLog(queueItem);
                        }
                        else if (queueItem.logType === 'kill') {
                            killProccessedNum++;
                            yield this.proccessKillLog(queueItem);
                        }
                    }
                    resolveAll({ loginProccessedNum, killProccessedNum });
                }
                else {
                    resolveAll(binded2SortedQueueArray !== false);
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[error]process login and kill log`, e.toString());
                resolveAll(false);
            }
        }));
    }
    proccessLoginLogs(cookies, loginLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                (0, morgan_log_1.logServerKill2LoginLog)(true, '[filter] login / kill');
                resGetLatestRecordTime = yield this.userLoginService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < loginLogFileNames.length; index++) {
                        const splitBackslash = loginLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === loginLogFileNames.length) {
                        startIndex = loginLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? loginLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = loginLogFileNames;
                }
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[filter finished] login / kill`, resGetLatestRecordTime, targetFileNames);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, '[error][filter] login / kill', e.toString());
                resolve(false);
            }
            try {
                (0, morgan_log_1.logServerKill2LoginLog)(true, '[fetch]login and kill log');
                const rawLoginLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const loginLogs = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getLoginLog(GameAreaRanges, cookies, targetFileName);
                    for (let loginLog of loginLogs) {
                        if (resGetLatestRecordTime && loginLog && loginLog.createdTimeStamp && resGetLatestRecordTime > loginLog.createdTimeStamp) {
                            continue;
                        }
                        const checkUserLoginParams = {
                            sessionId: loginLog.sessionId,
                            status: loginLog.status,
                        };
                        checkUserLoginParams[loginLog.status === 'login' ? 'loginTimeStamp' : 'logoutTimeStamp'] = loginLog.createdTimeStamp;
                        const resCheckUserLogin = yield this.userLoginService.getUserLogin(checkUserLoginParams);
                        if (resCheckUserLogin && resCheckUserLogin.id) {
                            continue;
                        }
                        rawLoginLogsJsonArray.push(loginLog);
                    }
                }
                resolve(rawLoginLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessLoginLog(loginLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (loginLog.status === 'login') {
                    const resRawGetUserLoginList = yield this.userLoginService.getUserLoginList((0, format_page_query_1.formatPageQuery)({
                        pageSize: 999999,
                        pageNum: 1
                    }), { sessionId: loginLog.sessionId, steamId: loginLog.steamId, status: 'login' });
                    const resGetUserLoginList = resRawGetUserLoginList[0];
                    if (resGetUserLoginList && resGetUserLoginList.length) {
                        const deletePromiseArray = [];
                        for (const illegalUserLogin of resGetUserLoginList) {
                            deletePromiseArray.push(new Promise((resolvedDeleteUserLogin) => resolvedDeleteUserLogin(this.userLoginService.deleteUserLogin({ id: illegalUserLogin.id }))));
                        }
                        yield Promise.all(deletePromiseArray);
                    }
                    try {
                        const resSaveUserLogin = yield this.userLoginService.saveUserLogin(loginLog.scumId, loginLog.steamId, loginLog.sessionId, loginLog.loginIp, loginLog.status, loginLog.createdTimeStamp, undefined, loginLog.otherConfig);
                        if (!resSaveUserLogin) {
                        }
                    }
                    catch (e) {
                        (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                    }
                }
                else {
                    const resRawGetCurrentUserLoginList = yield this.userLoginService.getUserLoginList((0, format_page_query_1.formatPageQuery)({
                        pageSize: 999999,
                        pageNum: 1
                    }), { sessionId: loginLog.sessionId, status: 'login', logoutTimeStamp: null });
                    const resGetCurrentUserLoginList = resRawGetCurrentUserLoginList[0];
                    if (resGetCurrentUserLoginList && resGetCurrentUserLoginList.length) {
                        const currentUserLogin = resGetCurrentUserLoginList[0];
                        const currentUserLogout = currentUserLogin;
                        currentUserLogout.status = loginLog.status;
                        currentUserLogout.logoutTimeStamp = loginLog.createdTimeStamp;
                        try {
                            const resSaveUserLogout = yield this.userLoginService.updateUserLogin(currentUserLogout);
                            if (!resSaveUserLogout) {
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                        }
                    }
                    else {
                    }
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessKillLogs(cookies, killLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestKill, resGetLatestRecordTime;
            try {
                resGetLatestKill = yield this.killService.getLatestKill();
                resGetLatestRecordTime = resGetLatestKill && resGetLatestKill.occuredTimeStamp ? resGetLatestKill.occuredTimeStamp : null;
                if (resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < killLogFileNames.length; index++) {
                        const splitBackslash = killLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === killLogFileNames.length) {
                        startIndex = killLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? killLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = killLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawKillLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const killLogs = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getKillLog(GameAreaRanges, cookies, targetFileName);
                    for (let killLog of killLogs) {
                        if (resGetLatestKill && resGetLatestKill.occuredTimeStamp && killLog && killLog.occuredTimeStamp && killLog.occuredTimeStamp <= resGetLatestKill.occuredTimeStamp) {
                            continue;
                        }
                        const resCheckKill = yield this.killService.getKill({
                            killerSteamId: killLog.killerSteamId,
                            killerLocations: killLog.killerLocations,
                            victimSteamId: killLog.victimSteamId,
                            victimLocations: killLog.victimLocations,
                            weapon: killLog.weapon,
                            distance: killLog.distance,
                            occuredTimeStamp: killLog.occuredTimeStamp
                        });
                        if (resCheckKill && resCheckKill.id) {
                            continue;
                        }
                        rawKillLogsJsonArray.push(killLog);
                    }
                }
                resolve(rawKillLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessKillLog(killLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveKill = yield this.killService.saveKill(killLog.killerSteamId, killLog.killerName, killLog.killerLocations, killLog.killerArea || 'UNKNOWN', killLog.victimSteamId, killLog.victimName, killLog.victimLocations, killLog.victimArea || 'UNKNOWN', killLog.distance, killLog.weapon, killLog.isEventKill, killLog.occuredTimeStamp);
                    if (!resSaveKill) {
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[error]process with kill log`, e.toString());
                resolve(false);
            }
        }));
    }
    bindAndSortLogsArrayToQueueArray(rawLoginLogsJsonArray, rawKillLogsJsonArray) {
        return new Promise((resolve, reject) => {
            try {
                let loginLogIndex = 0, killLogIndex = 0;
                let queueArray = [];
                while (loginLogIndex < rawLoginLogsJsonArray.length && killLogIndex < rawKillLogsJsonArray.length) {
                    let compareLoginLog = rawLoginLogsJsonArray[loginLogIndex].createdTimeStamp;
                    let compareKillLog = rawKillLogsJsonArray[killLogIndex].occuredTimeStamp;
                    if (compareLoginLog < compareKillLog) {
                        queueArray.push(rawLoginLogsJsonArray[loginLogIndex]);
                        loginLogIndex++;
                    }
                    else if (compareLoginLog > compareKillLog) {
                        queueArray.push(rawKillLogsJsonArray[killLogIndex]);
                        killLogIndex++;
                    }
                    else if (compareLoginLog === compareKillLog) {
                        queueArray.push(rawLoginLogsJsonArray[killLogIndex]);
                        queueArray.push(rawLoginLogsJsonArray[loginLogIndex]);
                        loginLogIndex++, killLogIndex++;
                    }
                }
                if (loginLogIndex < rawLoginLogsJsonArray.length) {
                    resolve(queueArray.concat(rawLoginLogsJsonArray.splice(loginLogIndex)));
                    return;
                }
                else if (killLogIndex < rawKillLogsJsonArray.length) {
                    resolve(queueArray.concat(rawKillLogsJsonArray.splice(killLogIndex)));
                    return;
                }
                else {
                    resolve(queueArray);
                    return;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[error]sort  login/kill log`, e.toString());
                reject(false);
            }
        });
    }
    proccessAdmin2ChatLogs(cookies, adminLogFileNames, chatLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [rawAdminLogsJsonArray, rawChatLogsJsonArray] = yield Promise.all([
                    this.proccessAdminLogs(cookies, adminLogFileNames),
                    this.proccessChatLogs(cookies, chatLogFileNames)
                ]);
                let adminProccessedNum = 0, chatProccessedNum = 0;
                if (rawAdminLogsJsonArray && rawAdminLogsJsonArray.length) {
                    for (let rawAdminLogsJson of rawAdminLogsJsonArray) {
                        adminProccessedNum++;
                        yield this.proccessAdminLog(rawAdminLogsJson);
                    }
                }
                if (rawChatLogsJsonArray && rawChatLogsJsonArray.length) {
                    for (let rawChatLogsJson of rawChatLogsJsonArray) {
                        chatProccessedNum++;
                        yield this.proccessChatLog(rawChatLogsJson);
                    }
                }
                resolveAll({ adminProccessedNum, chatProccessedNum });
            }
            catch (e) {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                resolveAll(false);
            }
        }));
    }
    proccessAdminLogs(cookies, adminLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                resGetLatestRecordTime = yield this.adminCommandService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < adminLogFileNames.length; index++) {
                        const splitBackslash = adminLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === adminLogFileNames.length) {
                        startIndex = adminLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? adminLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = adminLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawAdminLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const adminLogs = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getAdminLog(GameAreaRanges, cookies, targetFileName);
                    for (let adminLog of adminLogs) {
                        if (resGetLatestRecordTime && adminLog && adminLog.sendTimeStamp && resGetLatestRecordTime > adminLog.sendTimeStamp) {
                            continue;
                        }
                        const checkAdminCommandParams = {
                            scumId: adminLog.scumId,
                            steamId: adminLog.steamId,
                            sessionId: adminLog.sessionId,
                            content: adminLog.content,
                            sendTimeStamp: adminLog.sendTimeStamp,
                        };
                        const resCheckAdminCommand = yield this.adminCommandService.getAdminCommand(checkAdminCommandParams);
                        if (resCheckAdminCommand && resCheckAdminCommand.id) {
                            continue;
                        }
                        rawAdminLogsJsonArray.push(adminLog);
                    }
                }
                resolve(rawAdminLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessAdminLog(adminLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveAdminCommand = yield this.adminCommandService.saveAdminCommand(adminLog.scumId, adminLog.steamId, adminLog.sessionId, adminLog.content, adminLog.sendTimeStamp, adminLog.otherConfig);
                    if (!resSaveAdminCommand) {
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessChatLogs(cookies, chatLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                resGetLatestRecordTime = yield this.chatMessageService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < chatLogFileNames.length; index++) {
                        const splitBackslash = chatLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === chatLogFileNames.length) {
                        startIndex = chatLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? chatLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = chatLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawrChatLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    const chatLogs = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getChatLog(cookies, targetFileName);
                    for (let chatLog of chatLogs) {
                        if (resGetLatestRecordTime && chatLog && chatLog.sendTimeStamp && resGetLatestRecordTime > chatLog.sendTimeStamp) {
                            continue;
                        }
                        const checkChatMessageParams = {
                            scumId: chatLog.scumId,
                            steamId: chatLog.steamId,
                            sessionId: chatLog.sessionId,
                            type: chatLog.type,
                            content: chatLog.content,
                            sendTimeStamp: chatLog.sendTimeStamp,
                        };
                        const resCheckChatMessage = yield this.chatMessageService.getChatMessage(checkChatMessageParams);
                        if (resCheckChatMessage && resCheckChatMessage.id) {
                            continue;
                        }
                        rawrChatLogsJsonArray.push(chatLog);
                    }
                }
                resolve(rawrChatLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessChatLog(chatLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveChatMessage = yield this.chatMessageService.saveChatMessage(chatLog.scumId, chatLog.steamId, chatLog.sessionId, chatLog.type, chatLog.content, chatLog.sendTimeStamp);
                    if (!resSaveChatMessage) {
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerKill2LoginLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessActions2ViolationsLogs(cookies, actionsLogFileNames, violationsLogFileNames, economyLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [rawActionsLogsJsonArray, rawViolationsLogsJsonArray, rawEconomyLogsJsonArray] = yield Promise.all([
                    this.proccessActionsLogs(cookies, actionsLogFileNames),
                    this.proccessViolationsLogs(cookies, violationsLogFileNames),
                    this.proccessEconomyLogs(cookies, economyLogFileNames)
                ]);
                let actionsProccessedNum = 0, violationsProccessedNum = 0, economyProccessedNum = 0;
                if (rawActionsLogsJsonArray && rawActionsLogsJsonArray.length) {
                    for (let rawActionsLogsJson of rawActionsLogsJsonArray) {
                        actionsProccessedNum++;
                        yield this.proccessActionsLog(rawActionsLogsJson);
                    }
                }
                if (rawViolationsLogsJsonArray && rawViolationsLogsJsonArray.length) {
                    for (let rawViolationsLogsJson of rawViolationsLogsJsonArray) {
                        violationsProccessedNum++;
                        yield this.proccessViolationsLog(rawViolationsLogsJson);
                    }
                }
                if (rawEconomyLogsJsonArray && rawEconomyLogsJsonArray.length) {
                    for (let rawEconomyLogsJson of rawEconomyLogsJsonArray) {
                        economyProccessedNum++;
                        yield this.proccessEconomyLog(rawEconomyLogsJson);
                    }
                }
                resolveAll({ actionsProccessedNum, violationsProccessedNum, economyProccessedNum });
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolveAll(false);
            }
        }));
    }
    proccessActionsLogs(cookies, actionsLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                resGetLatestRecordTime = yield this.actionsRecordService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < actionsLogFileNames.length; index++) {
                        const splitBackslash = actionsLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === actionsLogFileNames.length) {
                        startIndex = actionsLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? actionsLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = actionsLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawActionsLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const actionsLog = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getActionsLog(GameAreaRanges, cookies, targetFileName);
                    for (let actionLog of actionsLog) {
                        if (resGetLatestRecordTime && actionLog && actionLog.createdTimeStamp && resGetLatestRecordTime > actionLog.createdTimeStamp) {
                            continue;
                        }
                        const checkActionRecordParams = {
                            scumId: actionLog.scumId,
                            steamId: actionLog.steamId,
                            sessionId: actionLog.sessionId,
                            type: actionLog.type,
                            createdLocations: actionLog.createdLocations,
                            createdArea: actionLog.createdArea,
                            createdTimeStamp: actionLog.createdTimeStamp,
                            trapName: actionLog.trapName,
                        };
                        const resCheckActionRecord = yield this.actionsRecordService.getActionsRecord(checkActionRecordParams);
                        if (resCheckActionRecord && resCheckActionRecord.id) {
                            continue;
                        }
                        rawActionsLogsJsonArray.push(actionLog);
                    }
                }
                resolve(rawActionsLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessActionsLog(actionsLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveActionsRecord = yield this.actionsRecordService.saveActionsRecord(actionsLog.scumId, actionsLog.steamId, actionsLog.sessionId, actionsLog.type, actionsLog.createdLocations, actionsLog.createdArea, actionsLog.createdTimeStamp, actionsLog.targetName, actionsLog.otherConfig);
                    if (!resSaveActionsRecord) {
                    }
                    else {
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessViolationsLogs(cookies, violationsLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                resGetLatestRecordTime = yield this.violationsRecordService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < violationsLogFileNames.length; index++) {
                        const splitBackslash = violationsLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === violationsLogFileNames.length) {
                        startIndex = violationsLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? violationsLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = violationsLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawViolationsLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const violationsLog = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getViolationsLog(GameAreaRanges, cookies, targetFileName);
                    for (let violationLog of violationsLog) {
                        if (resGetLatestRecordTime && violationLog && violationLog.createdTimeStamp && resGetLatestRecordTime > violationLog.createdTimeStamp) {
                            continue;
                        }
                        const checkViolationRecordParams = {
                            tag: violationLog.tag,
                            rawContent: violationLog.rawContent,
                            createdTimeStamp: violationLog.createdTimeStamp,
                            steamId: violationLog.steamId,
                            count: violationLog.count,
                        };
                        const resCheckViolationRecord = yield this.violationsRecordService.getViolationsRecord(checkViolationRecordParams);
                        if (resCheckViolationRecord && resCheckViolationRecord.id) {
                            continue;
                        }
                        rawViolationsLogsJsonArray.push(violationLog);
                    }
                }
                resolve(rawViolationsLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessViolationsLog(violationsLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveViolationsRecord = yield this.violationsRecordService.saveViolationsRecord(violationsLog.rawContent, violationsLog.createdTimeStamp, violationsLog.tag, violationsLog.steamId, violationsLog.count, violationsLog.otherConfig);
                    if (!resSaveViolationsRecord) {
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessEconomyLogs(cookies, economyLogFileNames) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let targetFileNames = [], resGetLatestRecordTime = null;
            try {
                resGetLatestRecordTime = yield this.economyService.getLatestRecordTime();
                resGetLatestRecordTime = resGetLatestRecordTime ? resGetLatestRecordTime : null;
                if (resGetLatestRecordTime && resGetLatestRecordTime) {
                    let startIndex, index = 0;
                    for (index = 0; index < economyLogFileNames.length; index++) {
                        const splitBackslash = economyLogFileNames[index].split('\\');
                        const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
                        const timeStampString = (moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf() + 1000 * 60 * 60 * 8) + '';
                        if (timeStampString >= resGetLatestRecordTime) {
                            startIndex = index - 1 >= 0 ? index - 1 : 0;
                            break;
                        }
                    }
                    if (index === economyLogFileNames.length) {
                        startIndex = economyLogFileNames.length - 1;
                    }
                    targetFileNames = startIndex !== undefined ? economyLogFileNames.filter((T, index) => index >= startIndex) : [];
                }
                else {
                    targetFileNames = economyLogFileNames;
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
            try {
                const rawEconomyLogsJsonArray = [];
                for (let targetFileName of targetFileNames) {
                    let resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                    let GameAreaRanges = JSON.parse(resGameAreaRanges.value).value;
                    const economysLog = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getEconomyLog(GameAreaRanges, cookies, targetFileName);
                    for (let economyLog of economysLog) {
                        if (resGetLatestRecordTime && economyLog && economyLog.createdTimeStamp && resGetLatestRecordTime > economyLog.createdTimeStamp) {
                            continue;
                        }
                        const checkEconomyRecordParams = {
                            type: economyLog.type,
                            trader: economyLog.trader,
                            createdTimeStamp: economyLog.createdTimeStamp,
                            steamId: economyLog.steamId,
                            scumId: economyLog.scumId,
                        };
                        const resCheckEconomyRecord = yield this.economyService.getEconomy(checkEconomyRecordParams);
                        if (resCheckEconomyRecord && resCheckEconomyRecord.id) {
                            continue;
                        }
                        rawEconomyLogsJsonArray.push(economyLog);
                    }
                }
                resolve(rawEconomyLogsJsonArray);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessEconomyLog(economyLog) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const resSaveEconomyRecord = yield this.economyService.saveEconomy(economyLog.scumId, economyLog.steamId, economyLog.type, economyLog.trader, economyLog.createdTimeStamp, economyLog.otherConfig);
                    if (!resSaveEconomyRecord) {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[warning]save economy failed, keyword:${JSON.stringify(economyLog)}`);
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[error]save economy failed, keyword:${JSON.stringify(economyLog)}`, e.toString());
                }
                resolve(true);
            }
            catch (e) {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, e.toString());
                resolve(false);
            }
        }));
    }
    proccessServerStatus() {
        return new Promise((resolveAll, rejectServerStatus) => __awaiter(this, void 0, void 0, function* () {
            try {
                let BattleMetricServerId = yield this.serverConfigService.getServerConfig({ name: 'BattleMetricServerId' });
                BattleMetricServerId = JSON.parse(BattleMetricServerId.value).value;
                if (BattleMetricServerId === null || BattleMetricServerId === void 0 ? void 0 : BattleMetricServerId.length) {
                    (0, morgan_log_1.logServerStatus)(true, 'fetch server status');
                    const resGetServerStatus = yield ServerSchedulesGportalServerLogQueueService_1.gPortalLogsInstance.getServerStatus(BattleMetricServerId);
                    if (resGetServerStatus && resGetServerStatus.ip && resGetServerStatus.port && resGetServerStatus.players) {
                        (0, morgan_log_1.logServerStatus)(true, '[success] fetch server status');
                        const updateServerIP = yield this.serverConfigService.updateServerConfig({
                            name: 'ServerIP',
                            value: JSON.stringify({ value: `${resGetServerStatus.ip}:${resGetServerStatus.port}` })
                        });
                        const updateOnlinePlayers = yield this.serverConfigService.updateServerConfig({
                            name: 'ServerOnlinePlayers',
                            value: JSON.stringify({ value: resGetServerStatus.players })
                        });
                        const updateBattleMetricServerDetail = yield this.serverConfigService.updateServerConfig({
                            name: 'BattleMetricServerDetail',
                            value: JSON.stringify({ value: resGetServerStatus })
                        });
                        (0, morgan_log_1.logServerStatus)(true, '[success] update db');
                        updateServerIP && updateOnlinePlayers && resolveAll(resGetServerStatus);
                    }
                    else {
                        (0, morgan_log_1.logServerStatus)(true, `[warning] format error`);
                        rejectServerStatus(resGetServerStatus);
                    }
                }
                else {
                    (0, morgan_log_1.logServerStatus)(true, '[error] battlemetrics id required');
                }
            }
            catch (e) {
                (0, morgan_log_1.logServerStatus)(true, '[error] fetch server status', e.toString());
                rejectServerStatus(false);
            }
        }));
    }
};
ServerSchedulesGportalServerLogQueueService.updateFlag = false;
ServerSchedulesGportalServerLogQueueService = ServerSchedulesGportalServerLogQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService,
        user_login_service_1.UserLoginService,
        kill_service_1.KillService,
        admin_command_service_1.AdminCommandService,
        chat_message_service_1.ChatMessageService,
        actions_record_service_1.ActionsRecordService,
        violations_record_service_1.ViolationsRecordService,
        economy_service_1.EconomyService])
], ServerSchedulesGportalServerLogQueueService);
exports.ServerSchedulesGportalServerLogQueueService = ServerSchedulesGportalServerLogQueueService;
//# sourceMappingURL=server-schedules.gportal-server-log.queue.service.js.map