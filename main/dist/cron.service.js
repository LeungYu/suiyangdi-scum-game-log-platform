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
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const nest_schedule_1 = require("nest-schedule");
const moment = require("moment");
const fs = require("fs");
const https = require("https");
const path = require("path");
const config_1 = require("./config/config");
const configs_1 = require("./utils/configs");
const morgan_log_1 = require("./common/morgan-log");
const files_1 = require("./common/files");
const typeorm_1 = require("typeorm");
const node_machine_id_1 = require("node-machine-id");
const si = require("systeminformation");
const server_config_service_1 = require("./modules/server-config/server-config.service");
const axios = require('axios');
let CronService = CronService_1 = class CronService extends nest_schedule_1.NestSchedule {
    constructor(serverConfigService) {
        super();
        this.serverConfigService = serverConfigService;
    }
    static checkToolHealth(serverConfigService) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (0, node_machine_id_1.machineIdSync)(true);
                const resGameServerType = yield serverConfigService.getServerConfig({ name: 'GameServerType' });
                const gameServerType = resGameServerType && resGameServerType.id ? JSON.parse(resGameServerType.value).value : null;
                let serverInfo = {};
                if (gameServerType === 'GPORTAL') {
                    const resServerId = yield serverConfigService.getServerConfig({ name: 'ServerId' });
                    const serverId = resServerId && resServerId.id ? JSON.parse(resServerId.value).value : null;
                    const resGPortalFTPUrl = yield serverConfigService.getServerConfig({ name: 'GPortalFTPUrl' });
                    const gPortalFTPUrl = resGPortalFTPUrl && resGPortalFTPUrl.id ? JSON.parse(resGPortalFTPUrl.value).value : null;
                    const resGPortalFTPAccount = yield serverConfigService.getServerConfig({ name: 'GPortalFTPAccount' });
                    const gPortalFTPAccount = resGPortalFTPAccount && resGPortalFTPAccount.id ? JSON.parse(resGPortalFTPAccount.value).value : null;
                    const resGPortalFTPPassword = yield serverConfigService.getServerConfig({ name: 'GPortalFTPPassword' });
                    const gPortalFTPPassword = resGPortalFTPPassword && resGPortalFTPPassword.id ? JSON.parse(resGPortalFTPPassword.value).value : null;
                    serverInfo = {
                        gameServerType,
                        serverId,
                        gPortalFTPUrl,
                        gPortalFTPAccount,
                        gPortalFTPPassword,
                    };
                }
                else if (gameServerType === 'NITRADO') {
                    const resNitradoAuthorizationToken = yield serverConfigService.getServerConfig({ name: 'NitradoAuthorizationToken' });
                    const nitradoAuthorizationToken = resNitradoAuthorizationToken && resNitradoAuthorizationToken.id ? JSON.parse(resNitradoAuthorizationToken.value).value : null;
                    serverInfo = {
                        gameServerType,
                        nitradoAuthorizationToken,
                    };
                }
                else if (gameServerType === 'GGHOST') {
                    const resGGHostServerDetail = yield serverConfigService.getServerConfig({ name: 'GGHostServerDetail' });
                    const gGHostServerDetail = resGGHostServerDetail && resGGHostServerDetail.id ? JSON.parse(resGGHostServerDetail.value).value : null;
                    const resGGHostFTPPath = yield serverConfigService.getServerConfig({ name: 'GGHostFTPPath' });
                    const gGHostFTPPath = resGGHostFTPPath && resGGHostFTPPath.id ? JSON.parse(resGGHostFTPPath.value).value : null;
                    const resGGHostFTPType = yield serverConfigService.getServerConfig({ name: 'GGHostFTPType' });
                    const gGHostFTPType = resGGHostFTPType && resGGHostFTPType.id ? JSON.parse(resGGHostFTPType.value).value : null;
                    const resGGHostFTPUrl = yield serverConfigService.getServerConfig({ name: 'GGHostFTPUrl' });
                    const gGHostFTPUrl = resGGHostFTPUrl && resGGHostFTPUrl.id ? JSON.parse(resGGHostFTPUrl.value).value : null;
                    const resGGHostFTPAccount = yield serverConfigService.getServerConfig({ name: 'GGHostFTPAccount' });
                    const gGHostFTPAccount = resGGHostFTPAccount && resGGHostFTPAccount.id ? JSON.parse(resGGHostFTPAccount.value).value : null;
                    const resGGHostFTPPassword = yield serverConfigService.getServerConfig({ name: 'GGHostFTPPassword' });
                    const gGHostFTPPassword = resGGHostFTPPassword && resGGHostFTPPassword.id ? JSON.parse(resGGHostFTPPassword.value).value : null;
                    serverInfo = {
                        gameServerType,
                        gGHostServerDetail,
                        gGHostFTPPath,
                        gGHostFTPType,
                        gGHostFTPUrl,
                        gGHostFTPAccount,
                        gGHostFTPPassword,
                    };
                }
                else if (gameServerType === 'PRIVATE') {
                    const resPrivateBaseFolderPath = yield serverConfigService.getServerConfig({ name: 'PrivateBaseFolderPath' });
                    const privateBaseFolderPath = resPrivateBaseFolderPath && resPrivateBaseFolderPath.id ? JSON.parse(resPrivateBaseFolderPath.value).value : null;
                    serverInfo = {
                        gameServerType,
                        privateBaseFolderPath,
                    };
                }
                const sysInfo = yield si.get({
                    cpu: 'manufacturer, brand, cores, physicalCores, speed',
                    mem: 'total, free',
                    osInfo: 'platform, distro, release',
                    networkInterfaces: 'iface, ip4, mac',
                });
                if (!!!(sysInfo === null || sysInfo === void 0 ? void 0 : sysInfo.networkInterfaces)) {
                    sysInfo.networkInterfaces = sysInfo === null || sysInfo === void 0 ? void 0 : sysInfo.networkInterfaces.filter(T => { var _a; return (_a = T === null || T === void 0 ? void 0 : T.ip4) === null || _a === void 0 ? void 0 : _a.length; });
                }
                let res;
                try {
                    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                    res = yield axios.post(configs_1.sentryNodeJsUrl, { id, serverInfo, sysInfo }, { httpsAgent, headers: { 'is-scum-tool': 'wrmfw' }, timeout: 60000 });
                }
                catch (e) {
                    res = undefined;
                    console.log('health check problem:', e.toString());
                }
            }
            catch (e) {
                console.log('health check problem:', e.toString());
            }
        });
    }
    delOutdateLogAndBackupCronJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const processResult = [];
            const timeStamp = Date.now();
            const date = new Date(timeStamp);
            const [year, month, day, hour] = [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                date.getHours(),
            ];
            const MYSQL_DATABASE = config_1.Config.getConf('MYSQL_DATABASE');
            const MORGAN_LOGS_PATH = config_1.Config.getConf('MORGAN_LOGS_PATH');
            try {
                const isMorganLogPathExist = yield (0, files_1.dirExists)(MORGAN_LOGS_PATH);
                if (isMorganLogPathExist) {
                    const deleteFilePromise = [];
                    const logFileList = yield (0, files_1.readDir)(MORGAN_LOGS_PATH);
                    const logFileTotal = logFileList.length;
                    for (const fileName of logFileList) {
                        const splitBarArray = fileName.split('-');
                        const splitDotArray = splitBarArray[splitBarArray.length - 1].split('.');
                        const targetYyyyMmDd = splitDotArray[0];
                        const targetTimeStamp = moment(targetYyyyMmDd).valueOf();
                        if (timeStamp - targetTimeStamp >= 1000 * 60 * 60 * 24 * 3) {
                            deleteFilePromise.push(yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    yield fs.unlinkSync(path.resolve(MORGAN_LOGS_PATH, fileName));
                                    resolve(true);
                                }
                                catch (e) {
                                    const errMsg = `delete file "${path.resolve(MORGAN_LOGS_PATH, fileName)}" with error: ${e.toString()}`;
                                    (0, morgan_log_1.logScheduleBackup)(errMsg);
                                    resolve(errMsg);
                                }
                            })));
                        }
                    }
                    try {
                        const deleteFileResults = yield Promise.all(deleteFilePromise);
                        processResult.push({
                            allLogFile: logFileTotal,
                            shouldDeleteFile: deleteFileResults.length,
                            successDeleteFile: deleteFileResults.filter(T => T === true).length,
                            errorDeleteFile: deleteFileResults.filter(T => T !== true).length,
                        });
                        (0, morgan_log_1.logScheduleBackup)({ deleteFileResults: deleteFileResults.filter(T => T !== true) });
                    }
                    catch (e) {
                        (0, morgan_log_1.logScheduleBackup)(`delete log file with error: ${e.toString()}`);
                    }
                }
                else {
                    (0, morgan_log_1.logScheduleBackup)(`path not exist: ${MORGAN_LOGS_PATH}`);
                }
                const entityManager = (0, typeorm_1.getManager)();
                const currentTimeStamp = Date.now();
                const runQuerys = [
                    `DELETE FROM ${MYSQL_DATABASE}.user_login where (status = 'logout' and loginTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5}) or (status = 'login' and unix_timestamp(CURRENT_TIMESTAMP()) * 1000 - loginTimeStamp > 1000 * 60 * 60 * 24) limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.\`kill\` where occuredTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.admin_command where sendTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.chat_message where sendTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.actions_record where createdTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.economy where createdTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `DELETE FROM ${MYSQL_DATABASE}.violations_record where createdTimeStamp < ${currentTimeStamp - 1000 * 60 * 60 * 24 * 5} limit 1000000`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.user_login`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.\`kill\``,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.admin_command`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.chat_message`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.actions_record`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.economy`,
                    `OPTIMIZE TABLE ${MYSQL_DATABASE}.violations_record`,
                ];
                const runQueryPromise = [];
                for (const runQuery of runQuerys) {
                    runQueryPromise.push(yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield entityManager.query(runQuery);
                            resolve(true);
                        }
                        catch (e) {
                            const errMsg = `run SQL "${runQuery}" with error: ${e.toString()}`;
                            (0, morgan_log_1.logScheduleBackup)(errMsg);
                            resolve(errMsg);
                        }
                    })));
                }
                try {
                    const rurnQueryResults = yield Promise.all(runQueryPromise);
                    processResult.push({
                        shouldDeleteFile: rurnQueryResults.length,
                        successDeleteFile: rurnQueryResults.filter(T => T === true).length,
                        errorDeleteFile: rurnQueryResults.filter(T => T !== true).length,
                    });
                    (0, morgan_log_1.logScheduleBackup)({ rurnQueryResults: rurnQueryResults.filter(T => T !== true) });
                }
                catch (e) {
                    (0, morgan_log_1.logScheduleBackup)(`error: ${e.toString()}`);
                }
            }
            catch (e) {
                (0, morgan_log_1.logScheduleBackup)(`error (${MYSQL_DATABASE}):` + e.toString());
                processResult.push({
                    target: MYSQL_DATABASE,
                    success: false,
                    content: `error (${MYSQL_DATABASE}):` + e.toString(),
                });
            }
            (0, morgan_log_1.logScheduleBackup)(`${year}-${month}-${day}-${hour} result:`);
            (0, morgan_log_1.logScheduleBackup)({ processResult });
        });
    }
    checkToolHealthCronJob() {
        return __awaiter(this, void 0, void 0, function* () {
            CronService_1.checkToolHealth(this.serverConfigService);
        });
    }
};
__decorate([
    (0, nest_schedule_1.Cron)('0 0 5 * * ? '),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "delOutdateLogAndBackupCronJob", null);
__decorate([
    (0, nest_schedule_1.Cron)('0 29 0,2,12 * * ? '),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "checkToolHealthCronJob", null);
CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService])
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map