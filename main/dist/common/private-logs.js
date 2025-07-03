"use strict";
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
const scum_log_utils_1 = require("./scum-log-utils");
const morgan_log_1 = require("./morgan-log");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
class PrivateLogs {
    constructor(baseFolderPath, useType) {
        this.baseFolderPath = baseFolderPath;
    }
    generateNormalRequest(method, url, headers, params, data, logger, otherConfigs, toJson) {
        const _otherConfigs = otherConfigs ? otherConfigs : {};
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios(Object.assign({ method,
                    url,
                    headers,
                    params,
                    data }, _otherConfigs));
                resolve(toJson ? JSON.parse(res.data.toString('utf8')) : res.data);
            }
            catch (e) {
                res = undefined;
                logger(true, `[error]method: ${method} url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    getLogsFileNamesJSon() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveMainTask, rejectMainTask) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logPrivateProccessLog)(true, 'fetch file names in folder by local');
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logPrivateProccessLog)(true, '[process]fetch file names in folder');
                        const normalizedPath = path.resolve(this.baseFolderPath);
                        fs.readdir(normalizedPath, (err, files) => {
                            if (err) {
                                const errorDesc = `[error][read local folder] ${err.toString()}`;
                                (0, morgan_log_1.logPrivateProccessLog)(true, errorDesc);
                                reject({ status: false, message: errorDesc });
                                return;
                            }
                            const logsIndex = {};
                            for (const file of files) {
                                logsIndex[file] = file;
                            }
                            resolveMainTask(logsIndex);
                        });
                    }));
                }
                catch (e) {
                    const errorDesc = '[error][fetch file names in folder]' + e.toString();
                    (0, morgan_log_1.logPrivateProccessLog)(true, errorDesc);
                    rejectMainTask({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getKillLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] fetch kill log: ${fileName} from local`);
                try {
                    const filePath = path.resolve(this.baseFolderPath, fileName);
                    fs.readFile(filePath, 'utf16le', (err, strContent) => {
                        if (err) {
                            const errorDesc = `[error][read kill log] ${err.toString()}`;
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                        try {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] with kill log`);
                            const logs = strContent
                                .split('\n')
                                .map((line) => (0, scum_log_utils_1.tranferKillLog)(line, GameAreaRanges))
                                .filter((item) => item !== undefined);
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[done] fetch kill log`);
                            resolveAll(logs);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]parse kill log: ' + e.toString();
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                        }
                    });
                }
                catch (e) {
                    const errorDesc = '[error][read kill log exception] ' + e.toString();
                    (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                }
            });
        });
    }
    getLoginLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] fetch login log: ${fileName} from local`);
                try {
                    const filePath = path.resolve(this.baseFolderPath, fileName);
                    fs.readFile(filePath, 'utf16le', (err, strContent) => {
                        if (err) {
                            const errorDesc = `[error][read login log] ${err.toString()}`;
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                        try {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] with login log`);
                            const logs = strContent
                                .split('\n')
                                .filter((line, index) => line && line.length && index > 1)
                                .map(line => (0, scum_log_utils_1.tranferLoginLog)(line, GameAreaRanges))
                                .filter(item => item !== undefined);
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[done] fetch login log`);
                            resolveAll(logs);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]parse login log: ' + e.toString();
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                        }
                    });
                }
                catch (e) {
                    const errorDesc = '[error][read login log exception] ' + e.toString();
                    (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                }
            });
        });
    }
    getAdminLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] fetch admin log: ${fileName} from local`);
                try {
                    const filePath = path.resolve(this.baseFolderPath, fileName);
                    fs.readFile(filePath, 'utf16le', (err, strContent) => {
                        if (err) {
                            const errorDesc = `[error][read admin log] ${err.toString()}`;
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            reject({ status: false, message: errorDesc });
                            return;
                        }
                        try {
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] with admin log`);
                            const logs = strContent
                                .split('\n')
                                .filter((line, index) => line && line.length && index > 1 && !line.includes('Custom Zones updated by '))
                                .map(line => (0, scum_log_utils_1.tranferAdminCommandLog)(line, GameAreaRanges))
                                .filter(item => item !== undefined);
                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[done] fetch admin log`);
                            resolve(logs);
                        }
                        catch (e) {
                            const errorDesc = '[error][process] parse admin log: ' + e.toString();
                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                            reject({ status: false, message: errorDesc });
                        }
                    });
                }
                catch (e) {
                    const errorDesc = '[error][read admin log exception] ' + e.toString();
                    (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                    reject({ status: false, message: errorDesc });
                }
            });
        });
    }
    getChatLog(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process] fetch chat log: ${fileName} from local`);
                try {
                    const filePath = path.resolve(this.baseFolderPath, fileName);
                    fs.readFile(filePath, 'utf16le', (err, strContent) => {
                        if (err) {
                            const errorDesc = `[error][read chat log] ${err.toString()}`;
                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                        try {
                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process] with chat log`);
                            const logs = strContent
                                .split('\n')
                                .filter((line, index) => line && line.length && index > 1)
                                .map(line => (0, scum_log_utils_1.tranferChatMessageLog)(line))
                                .filter(item => item !== undefined);
                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[done] fetch chat log`);
                            resolveAll(logs);
                        }
                        catch (e) {
                            const errorDesc = '[error][process] parse chat log: ' + e.toString();
                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                        }
                    });
                }
                catch (e) {
                    const errorDesc = '[error][read chat log exception] ' + e.toString();
                    (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                }
            });
        });
    }
    getActionsLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch actions log:${fileName} FROM LOCAL FILE`);
                try {
                    const path = require('path');
                    const fs = require('fs');
                    const fullPath = path.join(this.baseFolderPath, fileName);
                    const strContent = fs.readFileSync(fullPath, 'utf16le');
                    try {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with actions log`);
                        const logs = strContent
                            .split('\n')
                            .filter((T, key) => T && T.length && key > 1)
                            .map((T) => {
                            try {
                                return (0, scum_log_utils_1.tranferActionRecordLog)(T, GameAreaRanges);
                            }
                            catch (e) {
                                const errorDesc = '[error][process]process with actions log' + e.toString();
                                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                return undefined;
                            }
                        })
                            .filter((T) => T !== undefined);
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch actions log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with actions log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                }
                catch (e) {
                    const errorDesc = '[error][read local actions log]' + e.toString();
                    (0, morgan_log_1.logPrivateProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getViolationsLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch violations log:${fileName} FROM LOCAL FILE`);
                try {
                    const path = require('path');
                    const fs = require('fs');
                    (0, morgan_log_1.logPrivateProccessLog)(true, '[process]fetch violations log');
                    const fullPath = path.join(this.baseFolderPath, fileName);
                    const strContent = fs.readFileSync(fullPath, 'utf16le');
                    try {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with violations log`);
                        const logs = strContent
                            .split('\n')
                            .filter((T, key) => T && T.length && key > 1)
                            .map((T) => {
                            try {
                                return (0, scum_log_utils_1.tranferViolationsRecordLog)(T, GameAreaRanges);
                            }
                            catch (e) {
                                const errorDesc = '[error][process]process with violations log' + e.toString();
                                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                return undefined;
                            }
                        })
                            .filter((T) => T !== undefined);
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch violations log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with violations log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                }
                catch (e) {
                    const errorDesc = '[error][read local violations log]' + e.toString();
                    (0, morgan_log_1.logPrivateProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getEconomyLog(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch economy log ${fileName} FROM LOCAL FILE`);
                try {
                    const path = require('path');
                    const fs = require('fs');
                    (0, morgan_log_1.logPrivateProccessLog)(true, '[process]fetch economy log');
                    const fullPath = path.join(this.baseFolderPath, fileName);
                    const strContent = fs.readFileSync(fullPath, 'utf16le');
                    try {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with economy log`);
                        const rawLog = strContent;
                        let logBlocks = (0, scum_log_utils_1.tranferRawEconomyRecordsToBlocks)(rawLog);
                        const logs = logBlocks
                            .map((T) => {
                            try {
                                return (0, scum_log_utils_1.tranferEconomyRecords)(T, GameAreaRanges);
                            }
                            catch (e) {
                                const errorDesc = '[error][process]process with economy log' + e.toString();
                                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                return undefined;
                            }
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch economy file`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with economy log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                }
                catch (e) {
                    const errorDesc = '[error][read local economy log]' + e.toString();
                    (0, morgan_log_1.logPrivateProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getServerStatus(battleMetricServerId) {
        return new Promise((resolve, rejectRequestStatus) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            (0, morgan_log_1.logServerStatus)(true, `[proccess]fetch server status`);
            try {
                const resGenerateNormalRequest = yield this.generateNormalRequest('GET', `https://www.battlemetrics.com/servers/scum/${battleMetricServerId}`, {}, undefined, undefined, morgan_log_1.logServerStatus, {}, false);
                const regex = /<script id="storeBootstrap" type="application\/json">(.*?)<\/script>/s;
                const match = regex.exec(resGenerateNormalRequest);
                if (match) {
                    const jsonData = JSON.parse(match[1]);
                    const serverInfo = ((_b = (_a = jsonData === null || jsonData === void 0 ? void 0 : jsonData.state) === null || _a === void 0 ? void 0 : _a.servers) === null || _b === void 0 ? void 0 : _b.servers) ? (_d = (_c = jsonData === null || jsonData === void 0 ? void 0 : jsonData.state) === null || _c === void 0 ? void 0 : _c.servers) === null || _d === void 0 ? void 0 : _d.servers[battleMetricServerId + ''] : undefined;
                    if ((serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.id) === battleMetricServerId + '') {
                        resolve(serverInfo);
                        (0, morgan_log_1.logServerStatus)(true, `[proccess]battlemetric json: ${JSON.stringify(serverInfo)}`);
                    }
                    else {
                        const errorDesc = '[error]battlemetric json error';
                        (0, morgan_log_1.logServerStatus)(true, errorDesc);
                        rejectRequestStatus({ status: false, message: errorDesc });
                    }
                }
                else {
                    const errorDesc = '[error]battlemetric web error';
                    (0, morgan_log_1.logServerStatus)(true, errorDesc);
                    rejectRequestStatus({ status: false, message: errorDesc });
                }
            }
            catch (e) {
                const errorDesc = '[error]fetch server status' + e.toString();
                (0, morgan_log_1.logServerStatus)(true, errorDesc);
                rejectRequestStatus({ status: false, message: errorDesc });
            }
        }));
    }
}
exports.default = PrivateLogs;
//# sourceMappingURL=private-logs.js.map