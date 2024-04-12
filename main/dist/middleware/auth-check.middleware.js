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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCheckMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config/config");
const response_builder_1 = require("../common/response-builder");
const auth_admin_sys_controller_1 = require("../modules/auth/auth-admin-sys.controller");
const server_config_service_1 = require("../modules/server-config/server-config.service");
const configs_1 = require("../utils/configs");
const busgb = require('buffer').Buffer;
const NO_AUTH_PATH = [
    '/authAdminSys/checkValid',
    '/authAdminSys/login',
    '/sys/updateMsg',
    '/serverConfigAdminSys/serverStatus',
];
let AuthCheckMiddleware = class AuthCheckMiddleware {
    constructor(serverConfigService) {
        this.serverConfigService = serverConfigService;
    }
    use(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.realScum === undefined) {
                const resRealScum = yield this.serverConfigService.getServerConfig({ name: busgb.from(configs_1.scumLog, configs_1.code).toString('utf-8') });
                this.realScum = resRealScum && resRealScum.id ? JSON.parse(resRealScum.value).value : null;
            }
            if (this.realScum !== false) {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.DEFINED_PERMISSION, {}, busgb.from(busgb.from(configs_1.cpd1, configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8') +
                    busgb.from(busgb.from(busgb.from(busgb.from(configs_1.ndxs3, configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8') +
                    busgb.from(busgb.from(busgb.from(configs_1.mdj2, configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8')));
            }
            if (NO_AUTH_PATH.find((T) => T === req.baseUrl) !== undefined) {
                return next();
            }
            else {
                if (!req.session || !req.session.user || !req.session.user.userId) {
                    req.session.destroy(() => {
                        res.cookie(`scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`, '', auth_admin_sys_controller_1.cookieCfg);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.NO_LOGIN, {}, 'NEED TO LOGIN'));
                    });
                }
                else {
                    let { userId } = req.session.user;
                    const checkSession = config_1.Config.adminUsers.find(T => Number(T.id) === Number(userId));
                    if (checkSession && (checkSession === null || checkSession === void 0 ? void 0 : checkSession.id)) {
                        return next();
                    }
                    else {
                        req.session.destroy(() => {
                            res.cookie(`scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`, '', auth_admin_sys_controller_1.cookieCfg);
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.NO_LOGIN, {}, 'LOGIN STATUS INVALID'));
                        });
                    }
                }
            }
        });
    }
};
AuthCheckMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService])
], AuthCheckMiddleware);
exports.AuthCheckMiddleware = AuthCheckMiddleware;
//# sourceMappingURL=auth-check.middleware.js.map