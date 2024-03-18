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
var ServerSchedulesGGHostServerLogQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSchedulesGGHostServerLogQueueService = exports.ServerLogTaskType = void 0;
const common_1 = require("@nestjs/common");
const server_config_service_1 = require("../server-config/server-config.service");
const kill_service_1 = require("../kill/kill.service");
const task_qull_1 = require("../../common/task-qull");
const gghost_logs_1 = require("../../common/gghost-logs");
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
    ServerLogTaskType[ServerLogTaskType["GET_GGHOST_SERVER_LOG"] = 0] = "GET_GGHOST_SERVER_LOG";
})(ServerLogTaskType = exports.ServerLogTaskType || (exports.ServerLogTaskType = {}));
const FAILURE_RETRY_INTERVAL = 3000;
let ServerSchedulesGGHostServerLogQueueService = ServerSchedulesGGHostServerLogQueueService_1 = class ServerSchedulesGGHostServerLogQueueService {
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
            taskType: ServerLogTaskType.GET_GGHOST_SERVER_LOG
        }, {
            delay: 0,
        });
    }
    add(task, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.getServerConfig({ name: 'GGHostLogsRollbackSingleTimeout' });
            const GGHostLogsRollbackSingleTimeout = JSON.parse(resGGHostLogsRollbackSingleTimeout.value).value;
            task_qull_1.SingleGGHostServerLogQueue.add(task, Object.assign(Object.assign({}, opts), { backoff: FAILURE_RETRY_INTERVAL, timeout: GGHostLogsRollbackSingleTimeout || 360000 }));
        });
    }
    serverLogQueueHandler() {
        task_qull_1.SingleGGHostServerLogQueue.on('completed', (job, result) => __awaiter(this, void 0, void 0, function* () {
            if (result.proccess) {
                (0, morgan_log_1.logGGHostProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]success`);
            }
            else {
                (0, morgan_log_1.logGGHostProccessLog)(false, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]skip`);
            }
            let GGHostLogsRollbackInterval = yield this.serverConfigService.getServerConfig({ name: 'GGHostLogsRollbackInterval' });
            GGHostLogsRollbackInterval = JSON.parse(GGHostLogsRollbackInterval.value).value;
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: ServerLogTaskType.GET_GGHOST_SERVER_LOG,
            }, {
                delay: result.noGGHost === true ? 1000 * 60 : GGHostLogsRollbackInterval,
            });
            job.remove();
        }));
        task_qull_1.SingleGGHostServerLogQueue.on('failed', (job, err) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logGGHostProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]error, resaon:${err}`);
            (0, morgan_log_1.logGGHostProccessLog)(true, `[gportal][timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} ]retry`);
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: ServerLogTaskType.GET_GGHOST_SERVER_LOG,
            }, {
                delay: FAILURE_RETRY_INTERVAL,
            });
            job.remove();
        }));
        task_qull_1.SingleGGHostServerLogQueue.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logGGHostProccessLog)(false, `catch gghost task: ${job.data.taskType}`);
            const { taskType } = job.data;
            let res = undefined;
            switch (taskType) {
                case ServerLogTaskType.GET_GGHOST_SERVER_LOG:
                    res = yield this.getGGHostServerLog();
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
    getGGHostServerLog(initialize) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGetEnableGGHostLogsRollback = yield this.serverConfigService.getServerConfig({ name: 'EnableGGHostLogsRollback' });
            const EnableGGHostLogsRollback = JSON.parse(resGetEnableGGHostLogsRollback.value).value;
            let resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const GameServerType = JSON.parse(resGameServerType.value).value;
            if (EnableGGHostLogsRollback === false || GameServerType !== 'GGHOST') {
                return {
                    proccess: false,
                    noGGHost: GameServerType !== 'GGHOST'
                };
            }
            else {
                if (ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance === undefined) {
                    (0, morgan_log_1.logGGHostProccessLog)(true, '--------------------interlize--------------------');
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
            let GGHostServerDetail = yield this.serverConfigService.getServerConfig({ name: 'GGHostServerDetail' });
            GGHostServerDetail = JSON.parse(GGHostServerDetail.value).value;
            let GGHostFTPPath = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPPath' });
            GGHostFTPPath = JSON.parse(GGHostFTPPath.value).value;
            let GGHostFTPType = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPType' });
            GGHostFTPType = JSON.parse(GGHostFTPType.value).value;
            let GGHostFtpUrl = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPUrl' });
            GGHostFtpUrl = JSON.parse(GGHostFtpUrl.value).value;
            let GGHostFtpAccount = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPAccount' });
            GGHostFtpAccount = JSON.parse(GGHostFtpAccount.value).value;
            let GGHostFtpPassword = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPPassword' });
            GGHostFtpPassword = JSON.parse(GGHostFtpPassword.value).value;
            let serverHost = '', serverPort = '', ftpPath = GGHostFTPPath, ftpType = GGHostFTPType;
            let GGHostServerUrlSplitTest = GGHostServerDetail && GGHostServerDetail.split ? GGHostServerDetail.split(':') : [undefined, undefined];
            if (!!GGHostServerUrlSplitTest[0] && !isNaN(parseInt(GGHostServerUrlSplitTest[1], 10))) {
                serverHost = GGHostServerUrlSplitTest[0];
                serverPort = GGHostServerUrlSplitTest[1];
            }
            let ftpHost = '', ftpPort = '', ftpAccount = '', ftpPassword = '';
            let GGHostFtpUrlSplitTest = GGHostFtpUrl && GGHostFtpUrl.split ? GGHostFtpUrl.split(':') : [undefined, undefined];
            if (!!GGHostFtpAccount && !!GGHostFtpPassword &&
                !!GGHostFtpUrlSplitTest[0] && !isNaN(parseInt(GGHostFtpUrlSplitTest[1], 10)) &&
                GGHostFtpUrl !== 'NO_USED_CONFIG' &&
                GGHostFtpAccount !== 'NO_USED_CONFIG' &&
                GGHostFtpPassword !== 'NO_USED_CONFIG') {
                ftpHost = GGHostFtpUrlSplitTest[0];
                ftpPort = GGHostFtpUrlSplitTest[1];
                ftpAccount = GGHostFtpAccount;
                ftpPassword = GGHostFtpPassword;
            }
            ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance = new gghost_logs_1.default(serverHost, serverPort, ftpPath, ftpType, ftpHost, ftpPort, ftpAccount, ftpPassword, 'server-log');
        });
    }
    getServerLogsSchedule() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logGGHostProccessLog)(true, `call: ${new Date().toISOString()}`);
            try {
                yield this.userLoginService.limitAllUserLogin();
                yield this.killService.limitAllKill();
                yield this.adminCommandService.limitAllAdminCommand();
                yield this.chatMessageService.limitAllChatMessage();
                yield this.violationsRecordService.limitAllViolationsRecord();
                yield this.economyService.limitAllEconomy();
                const resGetLogsFileNamesJson = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getLogsFileNamesJSon();
                const resGetLogsFileNames = Object.keys(resGetLogsFileNamesJson).map((key) => resGetLogsFileNamesJson[key]);
                const allKillLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('kill') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allLoginLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('login') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allAdminLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('admin') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allChatLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('chat') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allActionsLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('gameplay') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allViolationsLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('violations') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const allEconomyLogFileNames = resGetLogsFileNames.filter((T) => T.indexOf('economy') !== -1 && (0, scum_log_utils_1.isLaterThanLegalDaysAgo)(T));
                const [resGetKill2LoginLogs, resGetAdmin2ChatLogs, resGetActions2ViolationsLogs] = yield Promise.all([
                    yield this.proccessKill2LoginLogs(allLoginLogFileNames, allKillLogFileNames),
                    yield this.proccessAdmin2ChatLogs(allAdminLogFileNames, allChatLogFileNames),
                    yield this.proccessActions2ViolationsLogs(allActionsLogFileNames, allViolationsLogFileNames, allEconomyLogFileNames),
                ]);
                (0, morgan_log_1.logServerKill2LoginLog)(true, `success: get kill/login log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerKill2LoginLog)(true, `result: get kill/login log, add ${resGetKill2LoginLogs.loginProccessedNum === undefined ? 0 : resGetKill2LoginLogs.loginProccessedNum} login logs, add ${resGetKill2LoginLogs.killProccessedNum === undefined ? 0 : resGetKill2LoginLogs.killProccessedNum}kill logs`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `success: get admin/chat log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `result: get admin/chat log, add ${resGetAdmin2ChatLogs.adminProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.adminProccessedNum}admin logs, add ${resGetAdmin2ChatLogs.chatProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.chatProccessedNum}chat logs`);
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `success: get action/violation log${new Date().toISOString()}`);
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `result: get action/violation/economy log, add ${resGetActions2ViolationsLogs.actionsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.actionsProccessedNum}action logs, add ${resGetActions2ViolationsLogs.violationsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.violationsProccessedNum}violation logs, add ${resGetActions2ViolationsLogs.economyProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.economyProccessedNum}economy log`);
                const resUpdateGGHostServerLogAsyncRecord = this.serverConfigService.updateServerConfig({
                    name: 'GGHostServerLogAsyncRecord',
                    value: JSON.stringify({ value: { recentTimeStamp: Date.now() + '', result: `success: add ${resGetKill2LoginLogs.loginProccessedNum === undefined ? 0 : resGetKill2LoginLogs.loginProccessedNum} login logs, add ${resGetKill2LoginLogs.killProccessedNum === undefined ? 0 : resGetKill2LoginLogs.killProccessedNum}kill logs, add ${resGetAdmin2ChatLogs.adminProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.adminProccessedNum}admin logs, add ${resGetAdmin2ChatLogs.chatProccessedNum === undefined ? 0 : resGetAdmin2ChatLogs.chatProccessedNum}chat logs, add ${resGetActions2ViolationsLogs.actionsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.actionsProccessedNum} action log, add ${resGetActions2ViolationsLogs.violationsProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.violationsProccessedNum}violation log, add ${resGetActions2ViolationsLogs.economyProccessedNum === undefined ? 0 : resGetActions2ViolationsLogs.economyProccessedNum}economy log` } })
                });
                return { proccess: true };
            }
            catch (e) {
                const errorContent = e && e.message ? e.message : e.toString();
                const resUpdateGGHostServerLogAsyncRecord = this.serverConfigService.updateServerConfig({
                    name: 'GGHostServerLogAsyncRecord',
                    value: JSON.stringify({ value: { recentTimeStamp: Date.now() + '', result: `fetch log failed: ${errorContent}` } })
                });
                (0, morgan_log_1.logGGHostProccessLog)(true, '[retry] get log / server status', e.toString());
                return { error: `[retry] get log / server status:${e.toString()}` };
            }
        });
    }
    proccessKill2LoginLogs(loginLogFileNames, killLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logServerKill2LoginLog)(true, `[task] process login/kill log`);
            try {
                (0, morgan_log_1.logServerKill2LoginLog)(true, '[process ] fetch login/kill log');
                const [rawLoginLogsJsonArray, rawKillLogsJsonArray] = yield Promise.all([
                    this.proccessLoginLogs(loginLogFileNames),
                    this.proccessKillLogs(killLogFileNames)
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
    proccessLoginLogs(loginLogFileNames) {
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
                    const loginLogs = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getLoginLog(GameAreaRanges, targetFileName);
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
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[error]process with kill log`, e.toString());
                resolve(false);
            }
        }));
    }
    proccessKillLogs(killLogFileNames) {
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
                    const killLogs = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getKillLog(GameAreaRanges, targetFileName);
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
    proccessAdmin2ChatLogs(adminLogFileNames, chatLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [rawAdminLogsJsonArray, rawChatLogsJsonArray] = yield Promise.all([
                    this.proccessAdminLogs(adminLogFileNames),
                    this.proccessChatLogs(chatLogFileNames)
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
    proccessAdminLogs(adminLogFileNames) {
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
                    const adminLogs = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getAdminLog(GameAreaRanges, targetFileName);
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
    proccessChatLogs(chatLogFileNames) {
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
                    const chatLogs = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getChatLog(targetFileName);
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
    proccessActions2ViolationsLogs(actionsLogFileNames, violationsLogFileNames, economyLogFileNames) {
        return new Promise((resolveAll) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [rawActionsLogsJsonArray, rawViolationsLogsJsonArray, rawEconomyLogsJsonArray] = yield Promise.all([
                    this.proccessActionsLogs(actionsLogFileNames),
                    this.proccessViolationsLogs(violationsLogFileNames),
                    this.proccessEconomyLogs(economyLogFileNames)
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
    proccessActionsLogs(actionsLogFileNames) {
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
                    const actionsLog = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getActionsLog(GameAreaRanges, targetFileName);
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
    proccessViolationsLogs(violationsLogFileNames) {
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
                    const violationsLog = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getViolationsLog(GameAreaRanges, targetFileName);
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
    proccessEconomyLogs(economyLogFileNames) {
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
                    const economysLog = yield ServerSchedulesGGHostServerLogQueueService_1.ggHostLogsInstance.getEconomyLog(GameAreaRanges, targetFileName);
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
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(e.toString());
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
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[error]处理npc日志`, e.toString());
                resolve(false);
            }
        }));
    }
};
ServerSchedulesGGHostServerLogQueueService = ServerSchedulesGGHostServerLogQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService,
        user_login_service_1.UserLoginService,
        kill_service_1.KillService,
        admin_command_service_1.AdminCommandService,
        chat_message_service_1.ChatMessageService,
        actions_record_service_1.ActionsRecordService,
        violations_record_service_1.ViolationsRecordService,
        economy_service_1.EconomyService])
], ServerSchedulesGGHostServerLogQueueService);
exports.ServerSchedulesGGHostServerLogQueueService = ServerSchedulesGGHostServerLogQueueService;
//# sourceMappingURL=server-schedules.gghost-server-log.queue.service.js.map