"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectRedis = require("connect-redis");
const session = require("express-session");
const redis = require("redis");
const config_1 = require("../config/config");
const morgan_log_1 = require("./morgan-log");
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: config_1.Config.getConf('REDIS_HOST'),
    port: +config_1.Config.getConf('REDIS_PORT'),
    auth_pass: config_1.Config.getConf('REDIS_PASS') || null,
});
const sessionStore = new RedisStore({
    client: redisClient,
    host: config_1.Config.getConf('REDIS_HOST'),
    port: +config_1.Config.getConf('REDIS_PORT'),
    pass: config_1.Config.getConf('REDIS_PASS') || null,
    prefix: config_1.Config.getConf('SCUM_NO') ? `stool${config_1.Config.getConf('SCUM_NO')}-` : 'stool-',
});
redisClient.on('message', (channel, msg) => {
    (0, morgan_log_1.logBussiness)(`"${channel}" -> "${msg}"`);
});
exports.default = sessionStore;
//# sourceMappingURL=redisStore.js.map