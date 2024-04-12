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
class NitradoLogs {
    constructor(serverId, nitradoAuthorizationToken, useType) {
        this.serverId = serverId;
        this.nitradoAuthorizationToken = nitradoAuthorizationToken;
    }
    generateNormalRequestUniversal(method, url, headers, params, data, logger, otherConfigs, toJson) {
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
                logger(true, `【错误】【请求出错】method: ${method} url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    generateNormalRequest(method, url, headers, params, data, logger) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios({
                    method,
                    url,
                    headers,
                    params,
                    data,
                });
                resolve(res.data);
            }
            catch (e) {
                res = undefined;
                logger(true, `[error]method: ${method} url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    generateDownloadRequest(method, url, headers, params, body, logger) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios({
                    method,
                    url,
                    headers,
                    params,
                    body,
                    responseType: 'stream',
                });
                resolve(res.data);
            }
            catch (e) {
                res = undefined;
                logger(true, `[error]method: ${method} url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    generateHeaders() {
        return {
            'connection': 'keep-alive',
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'authorization': `Bearer ${this.nitradoAuthorizationToken}`,
        };
    }
    getLogsFileNamesJSon() {
        return new Promise((resolveMainTask, rejectMainTask) => __awaiter(this, void 0, void 0, function* () {
            let basePath;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers`, this.generateHeaders(), undefined, undefined, morgan_log_1.logNitradoProccessLog);
                basePath = resGetGameserverInfo.data.gameserver.game_specific.path;
            }
            catch (e) {
                const errorDesc = `[error] base path: ${e.toString()}`;
                (0, morgan_log_1.logNitradoProccessLog)(true, errorDesc);
                rejectMainTask({ status: false, message: errorDesc });
                return;
            }
            let allFiles;
            try {
                console.log({ dir: `${basePath}scum/SCUM/Saved/SaveFiles/Logs` });
                const resGetAllFiles = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/list`, this.generateHeaders(), { dir: `${basePath}SCUM/Saved/SaveFiles/Logs` }, undefined, morgan_log_1.logNitradoProccessLog);
                allFiles = resGetAllFiles.data.entries.map(T => T.path);
                console.log(allFiles);
            }
            catch (e) {
                const errorDesc = `[error][process] path: ${e.toString()}`;
                (0, morgan_log_1.logNitradoProccessLog)(true, errorDesc);
                rejectMainTask({ status: false, message: errorDesc });
                return;
            }
            resolveMainTask(allFiles);
            return;
        }));
    }
    getKillLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]fetch kill log:${fileName}`);
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerKill2LoginLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerKill2LoginLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]process with kill log`);
                        const logs = strContent
                            .split('\n')
                            .map((T) => {
                            return (0, scum_log_utils_1.tranferKillLog)(T, GameAreaRanges);
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerKill2LoginLog)(true, `[done]fetch kill log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with kill log' + e.toString();
                        (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process] ${e.toString()}`;
                (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getLoginLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]fetch login file:${fileName}`);
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerKill2LoginLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerKill2LoginLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]process with login log`);
                        const logs = strContent
                            .split('\n')
                            .filter((T, key) => T && T.length && key > 1)
                            .map((T) => {
                            return (0, scum_log_utils_1.tranferLoginLog)(T, GameAreaRanges);
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerKill2LoginLog)(true, `[done]fetch login file`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with login log' + e.toString();
                        (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process] ${e.toString()}`;
                (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getAdminLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerKill2LoginLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerKill2LoginLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process] with admin log`);
                        const logs = strContent
                            .split('\n')
                            .filter((T, key) => T && T.length && key > 1 && T.includes('Custom Zones updated by ') === false)
                            .map((T) => {
                            return (0, scum_log_utils_1.tranferAdminCommandLog)(T, GameAreaRanges);
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[done] fetch admin file`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with admin log' + e.toString();
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process] ${e.toString()}`;
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getChatLog(fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerKill2LoginLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerKill2LoginLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process] with chat log`);
                        const logs = strContent
                            .split('\n')
                            .filter((T, key) => T && T.length && key > 1 && T.includes('Custom Zones updated by ') === false)
                            .map((T) => {
                            return (0, scum_log_utils_1.tranferChatMessageLog)(T);
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[done]fetch chat log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process] with chat log' + e.toString();
                        (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process] ${e.toString()}`;
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getActionsLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with actions log`);
                        const logs = strContent
                            .split('\n')
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
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch actions log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with actions log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process] ${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getViolationsLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
                    try {
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with violations log`);
                        const logs = strContent
                            .split('\n')
                            .map((T) => {
                            return (0, scum_log_utils_1.tranferViolationsRecordLog)(T, GameAreaRanges);
                        })
                            .filter((T, key) => T !== undefined);
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch violations log`);
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with violations log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process]${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getEconomyLog(GameAreaRanges, fileName) {
        return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch economy log${fileName}`);
            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `-------------------- url--------------------`);
            let downloadUrl;
            try {
                const resGetGameserverInfo = yield this.generateNormalRequest('GET', `https://api.nitrado.net/services/${this.serverId}/gameservers/file_server/download`, this.generateHeaders(), { file: fileName }, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                downloadUrl = resGetGameserverInfo.data.token.url;
            }
            catch (e) {
                const errorDesc = `[error] url: ${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
            let strContent;
            try {
                const resGetFiles = yield this.generateDownloadRequest('GET', `${downloadUrl}`, {}, undefined, undefined, morgan_log_1.logServerActions2ViolationsLogLog);
                const stream = require('stream');
                const logFileBufferStream = new stream.PassThrough();
                let logFileBuffer = Buffer.from('', 'utf16le');
                yield resGetFiles.pipe(logFileBufferStream);
                let size = 0;
                logFileBufferStream.on("data", (data) => {
                    size += data.length;
                    logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                });
                logFileBufferStream.on("end", () => {
                    strContent = logFileBuffer.toString('utf16le');
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
                        resolveAll(logs);
                    }
                    catch (e) {
                        const errorDesc = '[error][process]process with economy log' + e.toString();
                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                        rejectRequestLog({ status: false, message: errorDesc });
                        return;
                    }
                });
            }
            catch (e) {
                const errorDesc = `[error][process]${e.toString()}`;
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                rejectRequestLog({ status: false, message: errorDesc });
                return;
            }
        }));
    }
    getServerStatus(battleMetricServerId) {
        return new Promise((resolve, rejectRequestStatus) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            (0, morgan_log_1.logServerStatus)(true, `[proccess]fetch server status`);
            try {
                const resGenerateNormalRequest = yield this.generateNormalRequestUniversal('GET', `https://www.battlemetrics.com/servers/scum/${battleMetricServerId}`, {}, undefined, undefined, morgan_log_1.logServerStatus, {}, false);
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
exports.default = NitradoLogs;
//# sourceMappingURL=nitrado-logs.js.map