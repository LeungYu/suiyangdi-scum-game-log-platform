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
exports.getMorgan = exports.logServerStatus = exports.logServerActions2ViolationsLogLog = exports.logServerAdmin2ChatLogLog = exports.logServerKill2LoginLog = exports.logPrivateProccessLog = exports.logGGHostProccessOtherLog = exports.logGGHostProccessLog = exports.logNitradoProccessLog = exports.logGPortalProccessOtherLog = exports.logGPortalProccessLog = exports.logScheduleBackup = exports.logBussiness = exports.createMorgan = void 0;
const morgan = require("morgan");
const moment = require("moment");
const config_1 = require("../config/config");
const path = require("path");
const FileStreamRotator = require('file-stream-rotator');
let accessLogStream;
let bussinessLogStream;
let logScheduleBackupLogStream;
let scheduleGPortalProccessLogLogStream;
let scheduleGPortalProccessOtherLogLogStream;
let scheduleNitradoProccessLogLogStream;
let scheduleGGHostProccessLogLogStream;
let scheduleGGHostProccessOtherLogLogStream;
let schedulePrivateProccessLogLogStream;
let scheduleServerKill2LoginLogLogStream;
let scheduleServerAdmin2ChatLogLogStream;
let scheduleServerActions2ViolationsLogLogStream;
let scheduleServerStatusLogStream;
function createMorgan() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.SERVER_NODE_ENV === 'production') {
            accessLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./access-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            bussinessLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./bussiness-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            logScheduleBackupLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./backup-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleGPortalProccessLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./gportal-proccess-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleGPortalProccessOtherLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./gportal-proccess-other-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleNitradoProccessLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./nitrado-proccess-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleGGHostProccessLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./gghost-proccess-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleGGHostProccessOtherLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./gghost-proccess-other-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            schedulePrivateProccessLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./private-proccess-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleServerKill2LoginLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./server-log-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleServerAdmin2ChatLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./server-message-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleServerActions2ViolationsLogLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./server-record-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
            scheduleServerStatusLogStream = FileStreamRotator.getStream({
                date_format: 'YYYYMMDD',
                filename: path.resolve(config_1.Config.getConf('MORGAN_LOGS_PATH'), `./server-status-%DATE%.log`),
                frequency: 'daily',
                size: '2m',
                verbose: false
            });
        }
    });
}
exports.createMorgan = createMorgan;
function logBussiness(...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                bussinessLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logBussiness = logBussiness;
function logScheduleBackup(...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (const content of contents) {
                logScheduleBackupLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logScheduleBackup = logScheduleBackup;
function logGPortalProccessLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleGPortalProccessLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logGPortalProccessLog = logGPortalProccessLog;
function logGPortalProccessOtherLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleGPortalProccessOtherLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logGPortalProccessOtherLog = logGPortalProccessOtherLog;
function logNitradoProccessLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleNitradoProccessLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logNitradoProccessLog = logNitradoProccessLog;
function logGGHostProccessLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleGGHostProccessLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logGGHostProccessLog = logGGHostProccessLog;
function logGGHostProccessOtherLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleGGHostProccessOtherLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logGGHostProccessOtherLog = logGGHostProccessOtherLog;
function logPrivateProccessLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                schedulePrivateProccessLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logPrivateProccessLog = logPrivateProccessLog;
function logServerKill2LoginLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleServerKill2LoginLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logServerKill2LoginLog = logServerKill2LoginLog;
function logServerAdmin2ChatLogLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleServerAdmin2ChatLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logServerAdmin2ChatLogLog = logServerAdmin2ChatLogLog;
function logServerActions2ViolationsLogLog(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleServerActions2ViolationsLogLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logServerActions2ViolationsLogLog = logServerActions2ViolationsLogLog;
function logServerStatus(print, ...contents) {
    return __awaiter(this, void 0, void 0, function* () {
        print && console.log.apply(this, contents);
        if (process.env.SERVER_NODE_ENV === 'production') {
            for (let content of contents) {
                scheduleServerStatusLogStream.write(`[${moment().format('YYYY-MM-DD HH:mm:ss ZZ')}] ${(typeof content === 'object' ? JSON.stringify(content) : content)}\n`, 'utf-8');
            }
        }
    });
}
exports.logServerStatus = logServerStatus;
morgan.token('localdate', () => {
    return moment().format('YYYY-MM-DD HH:mm:ss ZZ');
});
morgan.token('serverId', (req) => {
    return req.headers['scum-log-tool-server-id'];
});
morgan.token('ip', (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
});
function getMorgan() {
    const developmentMorgan = morgan(function (tokens, req, res) {
        return [
            tokens.date(req, res, 'iso'),
            tokens.req(req, res, 'remote-addr'),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens['response-time'](req, res), 'ms',
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens.referrer(req, res),
            tokens['user-agent'](req, res),
            'cookie:', tokens.req(req, res, 'cookie'),
            'ip:', tokens['ip'](req, res),
        ].join(' ');
    });
    const productionMorgan = morgan(function (tokens, req, res) {
        return [
            tokens.date(req, res, 'iso'),
            tokens.req(req, res, 'remote-addr'),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens['response-time'](req, res), 'ms',
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens.referrer(req, res),
            tokens['user-agent'](req, res),
            'cookie:', tokens.req(req, res, 'cookie'),
            'ip:', tokens['ip'](req, res),
        ].join(' ');
    }, { stream: accessLogStream });
    return process.env.SERVER_NODE_ENV === 'development' ? developmentMorgan : productionMorgan;
}
exports.getMorgan = getMorgan;
//# sourceMappingURL=morgan-log.js.map