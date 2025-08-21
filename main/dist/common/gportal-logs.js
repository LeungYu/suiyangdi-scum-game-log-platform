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
const config_1 = require("../config/config");
const axios = require('axios');
class GPortalLogs {
    constructor(serverId, ftpHost, ftpPort, ftpAccount, ftpPassword, useType) {
        this.serverId = serverId;
        this.serverId = serverId;
        this.ftpHost = ftpHost;
        this.ftpPort = ftpPort;
        this.ftpAccount = ftpAccount;
        this.ftpPassword = ftpPassword;
    }
    generateNormalHeaders(cookies) {
        const DEFINED_GPORTAL_SERVER_INFO_DOMAIN = config_1.Config.getConf('DEFINED_GPORTAL_SERVER_INFO_DOMAIN');
        return {
            'authority': DEFINED_GPORTAL_SERVER_INFO_DOMAIN ? DEFINED_GPORTAL_SERVER_INFO_DOMAIN : 'api.g-portal.us',
            'method': 'GET',
            'path': `/int/server/scum/${this.serverId}/logs`,
            'scheme': 'https',
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip',
            'accept-language': 'zh-CN,zh;q=0.9',
            'origin': 'https://www.g-portal.com',
            'referer': `https://www.g-portal.com/int/server/scum/${this.serverId}/logs`,
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'cookie': cookies || ''
        };
    }
    generateLogHeaders(cookies) {
        return {
            'authority': 'www.g-portal.com',
            'method': 'POST',
            'path': `/int/server/scum/${this.serverId}/logs`,
            'scheme': 'https',
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'multipart/form-data',
            'cookie': cookies,
            'origin': 'https://www.g-portal.com',
            'referer': `https://www.g-portal.com/int/server/scum/${this.serverId}/logs`,
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
        };
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
    generateFormDataRequest(url, form, headers, logger, otherConfigs) {
        const _otherConfigs = otherConfigs ? otherConfigs : {};
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios.post(url, form, Object.assign({ headers, timeout: 60000 }, _otherConfigs));
                resolve(JSON.parse(res.data.toString('utf8')));
            }
            catch (e) {
                res = undefined;
                logger(true, `[error]url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    getLogsFileNamesJSon(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLogsFileNamesJSonFTP();
        });
    }
    getLogsFileNamesJSonFTP() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveMainTask, rejectMainTask) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logGPortalProccessLog)(true, 'fetch file names in folder by ftp');
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch file names in folder');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.list('SCUM/Saved/SaveFiles/Logs', function (e, list) {
                                    if (e) {
                                        const errorDesc = '[error][fetch file names in folder]' + e.toString();
                                        (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                        rejectMainTask({ status: false, message: errorDesc });
                                        return;
                                    }
                                    const logsIndex = {};
                                    for (const item of list) {
                                        logsIndex[item.name] = item.name;
                                    }
                                    resolveMainTask(logsIndex);
                                    client.end();
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][fetch file names in folder by ftp]' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectMainTask({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][fetch file names in folder]' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectMainTask({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error][fetch file names in folder]' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectMainTask({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getKillLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getKillLogFTP(GameAreaRanges, fileName);
        });
    }
    getKillLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]etch kill log${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch kill log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with kill log' + e.toString();
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[kill log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[kill log]stream closed: ` + e.toString());
                                        }
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
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with kill log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with kill log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getLoginLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLoginLogFTP(GameAreaRanges, fileName);
        });
    }
    getLoginLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]fetch login log: ${fileName} by ftp`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]获取登录日志文件');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with login log' + e.toString();
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[login log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[login log]stream closed: ` + e.toString());
                                        }
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
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with login log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with login log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getAdminLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAdminLogFTP(GameAreaRanges, fileName);
        });
    }
    getAdminLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerKill2LoginLog)(true, `[process]fetch admin log: ${fileName} by ftp`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch admin log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with admin log' + e.toString();
                                        (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[admin log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[admin log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
                                        try {
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[process] with admin log`);
                                            const logs = strContent
                                                .split('\n')
                                                .filter((T, key) => T && T.length && key > 1 && T.includes('Custom Zones updated by ') === false)
                                                .map((T) => {
                                                return (0, scum_log_utils_1.tranferAdminCommandLog)(T, GameAreaRanges);
                                            })
                                                .filter((T, key) => T !== undefined);
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, `[done] fetch admin file`);
                                            resolveAll(logs);
                                        }
                                        catch (e) {
                                            const errorDesc = '[error][process]process with admin log' + e.toString();
                                            (0, morgan_log_1.logServerKill2LoginLog)(true, errorDesc);
                                            rejectRequestLog({ status: false, message: errorDesc });
                                            return;
                                        }
                                    });
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]fetch admin log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with admin log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getChatLog(cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getChatLogFTP(fileName);
        });
    }
    getChatLogFTP(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process]fetch chat log: ${fileName} by ftp`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch chat log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]fetch log' + e.toString();
                                        (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[chat log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[chat log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
                                        try {
                                            (0, morgan_log_1.logServerAdmin2ChatLogLog)(true, `[process] with chat log`);
                                            const logs = strContent
                                                .split('\n')
                                                .filter((T, key) => T && T.length && key > 1)
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
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with chat log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with chat log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getActionsLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getActionsLogFTP(GameAreaRanges, fileName);
        });
    }
    getActionsLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch actions log:${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch actions log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with actions log' + e.toString();
                                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[actions log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[actions log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
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
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]fetch log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with actions log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getViolationsLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getViolationsLogFTP(GameAreaRanges, fileName);
        });
    }
    getViolationsLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch violations log:${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch violations log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with violations log' + e.toString();
                                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[violations log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[violations log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
                                        try {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with violations log`);
                                            const logs = strContent
                                                .split('\n')
                                                .filter((T, key) => T && T.length && key > 1)
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
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with violations log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with kill log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getEconomyLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getEconomyLogFTP(GameAreaRanges, fileName);
        });
    }
    getEconomyLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch economy log${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch economy log');
                        try {
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', function () {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with economy log' + e.toString();
                                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[economy log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[economy log]stream closed: ` + e.toString());
                                        }
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
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch economy file`);
                                            resolveAll(logs);
                                        }
                                        catch (e) {
                                            const errorDesc = '[error][process]process with economy log' + e.toString();
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                            rejectRequestLog({ status: false, message: errorDesc });
                                            return;
                                        }
                                    });
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with economy log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                rejectRequestLog({ status: false, message: errorDesc });
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with economy log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getChestOwnershipLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getChestOwnershipLogFTP(GameAreaRanges, fileName);
        });
    }
    getChestOwnershipLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch chest ownerhip log${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch chest ownerhip log');
                        try {
                            const path = require('path');
                            const fs = require('fs');
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', () => {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with chest ownerhip log' + e.toString();
                                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                        resolve(0);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[chest ownerhip log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[chest ownerhip log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
                                        try {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with chest ownerhip log`);
                                            const rawLog = strContent;
                                            const logs = rawLog
                                                .split('\n')
                                                .map((T) => {
                                                try {
                                                    return (0, scum_log_utils_1.tranferChestOwnershipRecordLog)(T, GameAreaRanges);
                                                }
                                                catch (e) {
                                                    const errorDesc = '[error][process]process with chest ownerhip log' + e.toString();
                                                    (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                                    return undefined;
                                                }
                                            })
                                                .filter((T, key) => T !== undefined);
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch chest ownerhip file`);
                                            resolve(0);
                                            resolveAll(logs);
                                            return;
                                        }
                                        catch (e) {
                                            const errorDesc = '[error][process]process with chest ownerhip log' + e.toString();
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                            resolve(0);
                                            rejectRequestLog({ status: false, message: errorDesc });
                                            return;
                                        }
                                    });
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with chest ownerhip log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                resolve(0);
                                rejectRequestLog({ status: false, message: errorDesc });
                                return;
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            resolve(0);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with chest ownerhip log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                    rejectRequestLog({ status: false, message: errorDesc });
                    return;
                }
            }));
        });
    }
    getVehicleDestructionLog(GameAreaRanges, cookies, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getVehicleDestructionLogFTP(GameAreaRanges, fileName);
        });
    }
    getVehicleDestructionLogFTP(GameAreaRanges, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolveAll, rejectRequestLog) => __awaiter(this, void 0, void 0, function* () {
                (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]fetch vehicle destruction log${fileName} BY FTP`);
                try {
                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        (0, morgan_log_1.logGPortalProccessLog)(true, '[process]fetch vehicle destruction log');
                        try {
                            const path = require('path');
                            const fs = require('fs');
                            const ftp = require('ftp');
                            const client = new ftp();
                            const connectionProperties = {
                                host: this.ftpHost,
                                port: this.ftpPort,
                                user: this.ftpAccount,
                                password: this.ftpPassword
                            };
                            client.on('ready', () => {
                                client.get(`SCUM/Saved/SaveFiles/Logs/${fileName}`, function (e, stream) {
                                    if (e) {
                                        const errorDesc = '[error][process]process with vehicle destruction log' + e.toString();
                                        (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                        resolve(0);
                                        rejectRequestLog({ status: false, message: errorDesc });
                                        return;
                                    }
                                    let strContent;
                                    let logFileBuffer = Buffer.from('', 'utf16le');
                                    let size = 0;
                                    stream.once('close', () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[vehicle destruction log]stream closed: ` + e.toString());
                                        }
                                    });
                                    stream.on("data", (data) => {
                                        size += data.length;
                                        logFileBuffer = Buffer.concat([logFileBuffer, data], size);
                                    });
                                    stream.on("end", () => {
                                        try {
                                            client.end();
                                        }
                                        catch (e) {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[vehicle destruction log]stream closed: ` + e.toString());
                                        }
                                        strContent = logFileBuffer.toString('utf16le');
                                        try {
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[process]process with vehicle destruction log`);
                                            const rawLog = strContent;
                                            const logs = rawLog
                                                .split('\n')
                                                .map((T) => {
                                                try {
                                                    return (0, scum_log_utils_1.tranferVehicleDestructionRecordLog)(T, GameAreaRanges);
                                                }
                                                catch (e) {
                                                    const errorDesc = '[error][process]process with vehicle destruction log' + e.toString();
                                                    (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                                    return undefined;
                                                }
                                            })
                                                .filter((T, key) => T !== undefined);
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, `[done]fetch vehicle destruction file`);
                                            resolve(0);
                                            resolveAll(logs);
                                            return;
                                        }
                                        catch (e) {
                                            const errorDesc = '[error][process]process with vehicle destruction log' + e.toString();
                                            (0, morgan_log_1.logServerActions2ViolationsLogLog)(true, errorDesc);
                                            resolve(0);
                                            rejectRequestLog({ status: false, message: errorDesc });
                                            return;
                                        }
                                    });
                                });
                            });
                            client.on('error', function (e) {
                                const errorDesc = '[error][process]process with vehicle destruction log' + e.toString();
                                (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                                resolve(0);
                                rejectRequestLog({ status: false, message: errorDesc });
                                return;
                            });
                            client.connect(connectionProperties);
                        }
                        catch (e) {
                            const errorDesc = '[error][process]fetch log' + e.toString();
                            (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
                            resolve(0);
                            rejectRequestLog({ status: false, message: errorDesc });
                            return;
                        }
                    }));
                }
                catch (e) {
                    const errorDesc = '[error]process with vehicle destruction log' + e.toString();
                    (0, morgan_log_1.logGPortalProccessLog)(true, errorDesc);
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
exports.default = GPortalLogs;
//# sourceMappingURL=gportal-logs.js.map