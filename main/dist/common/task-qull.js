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
exports.SinglePrivateServerLogQueue = exports.SingleGGHostServerLogQueue = exports.NitradoServerLogQueue = exports.SingleGPortalServerLogQueue = void 0;
const os = require("os");
const Queue = require("bull");
const config_1 = require("../config/config");
const morgan_log_1 = require("./morgan-log");
function cleanRedisKeys(timeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            let interval = setInterval(() => {
                if (morgan_log_1.logBussiness) {
                    clearInterval(interval);
                    resolve(1);
                }
            }, 500);
        });
        const shell = require('node-powershell');
        const powerShell = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        const redisHost = config_1.Config.getConf('REDIS_HOST');
        const redisPort = config_1.Config.getConf('REDIS_PORT');
        const redisPass = config_1.Config.getConf('REDIS_PASS');
        try {
            if (os.platform() === 'win32') {
                (0, morgan_log_1.logBussiness)('cd "C:\\Program Files\\Redis"');
                powerShell.addCommand('cd "C:\\Program Files\\Redis"');
                const resCdRedisPath = yield powerShell.invoke();
                (0, morgan_log_1.logBussiness)(`$rdkeys=.\\redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} keys "bull:${config_1.Config.getConf('SCUM_NO')}-*"`);
                powerShell.addCommand(`$rdkeys=.\\redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} keys "bull:${config_1.Config.getConf('SCUM_NO')}-*"`);
                const resListTargetRedisKeys = yield powerShell.invoke();
                (0, morgan_log_1.logBussiness)(`if($rdkeys.length -gt 0){foreach ($keyitem in $rdkeys) {if (-not $keyitem.Contains("-${timeStamp}")) { .\\\\redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} del $keyitem }}}`);
                powerShell.addCommand(`if($rdkeys.length -gt 0){foreach ($keyitem in $rdkeys) {if (-not $keyitem.Contains("-${timeStamp}")) { .\\\\redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} del $keyitem }}}`);
                const resCleanTargetRedisKeys = yield powerShell.invoke();
                powerShell.dispose();
                setTimeout(() => {
                    (0, morgan_log_1.logBussiness)('[process]clean unused redis key:', { resCdRedisPath, resListTargetRedisKeys, resCleanTargetRedisKeys });
                    process.title = `${config_1.Config.getConf('SCUM_NO')}`;
                });
            }
            else {
                const REDIS_PATH = config_1.Config.getConf('REDIS_PATH');
                const resCdRedisPath = yield powerShell.invoke();
                (0, morgan_log_1.logBussiness)(`$rdkeys=${REDIS_PATH}redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} keys "bull:${config_1.Config.getConf('SCUM_NO')}-*"`);
                powerShell.addCommand(`$rdkeys=${REDIS_PATH}redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} keys "bull:${config_1.Config.getConf('SCUM_NO')}-*"`);
                const resListTargetRedisKeys = yield powerShell.invoke();
                (0, morgan_log_1.logBussiness)(`if($rdkeys.length -gt 0){foreach ($keyitem in $rdkeys) {if (-not $keyitem.Contains("-${timeStamp}")) { ${REDIS_PATH}redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} del $keyitem }}}`);
                powerShell.addCommand(`if($rdkeys.length -gt 0){foreach ($keyitem in $rdkeys) {if (-not $keyitem.Contains("-${timeStamp}")) { ${REDIS_PATH}redis-cli${redisHost ? ` -h ${redisHost}` : ''}${redisPort ? ` -p ${redisPort}` : ''}${redisPass ? ` -a ${redisPass}` : ''} del $keyitem }}}`);
                const resCleanTargetRedisKeys = yield powerShell.invoke();
                powerShell.dispose();
                setTimeout(() => {
                    (0, morgan_log_1.logBussiness)('[process]clean unused redis key:', { resCdRedisPath, resListTargetRedisKeys, resCleanTargetRedisKeys });
                    process.title = `${config_1.Config.getConf('SCUM_NO')}`;
                });
            }
        }
        catch (e) {
            (0, morgan_log_1.logBussiness)({ e });
            powerShell.dispose();
        }
    });
}
const redis = {
    redis: {
        port: config_1.Config.getConf('REDIS_PORT'),
        host: config_1.Config.getConf('REDIS_HOST'),
        password: config_1.Config.getConf('REDIS_PASS'),
    },
};
const timeStamp = Date.now();
cleanRedisKeys(timeStamp);
exports.SingleGPortalServerLogQueue = new Queue(`${config_1.Config.getConf('SCUM_NO')}-SingleGPortalServerLog-${timeStamp}`, redis);
exports.NitradoServerLogQueue = new Queue(`${config_1.Config.getConf('SCUM_NO')}-NitradoServerLog-${timeStamp}`, redis);
exports.SingleGGHostServerLogQueue = new Queue(`${config_1.Config.getConf('SCUM_NO')}-SingleGGHostServerLog-${timeStamp}`, redis);
exports.SinglePrivateServerLogQueue = new Queue(`${config_1.Config.getConf('SCUM_NO')}-SinglePrivateServerLog-${timeStamp}`, redis);
//# sourceMappingURL=task-qull.js.map