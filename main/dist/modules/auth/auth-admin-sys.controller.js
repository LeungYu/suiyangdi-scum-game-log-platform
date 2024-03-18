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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.AuthAdminSysController = exports.cookieCfg = void 0;
const common_1 = require("@nestjs/common");
const auth_admin_sys_1 = require("../../dto/auth-admin-sys");
const config_1 = require("../../config/config");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const md5_1 = require("../../common/md5");
const configs_1 = require("../../utils/configs");
const Buffer = require('buffer').Buffer;
exports.cookieCfg = {
    expires: new Date(0),
    domain: config_1.Config.getConf('COOKIE_DOMAIN'),
    maxAge: 0,
    httpOnly: false,
};
let AuthAdminSysController = class AuthAdminSysController {
    constructor() { }
    login(body, res, sessionUser, session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sessionUser) {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, sessionUser));
            }
            else {
                const adminUsers = config_1.Config.adminUsers;
                const resCheckPhone = adminUsers.find(T => T.phone === body.user);
                if (resCheckPhone !== undefined) {
                    const userId = resCheckPhone.id;
                    const password = resCheckPhone.name === Buffer.from(Buffer.from(configs_1.superN, configs_1.code).toString('utf-8'), configs_1.code).toString('utf-8') ? (0, md5_1.md5)(body.password) : body.password;
                    const userPassword = resCheckPhone.password;
                    if (password === userPassword) {
                        const user = {
                            userId,
                            steamId: resCheckPhone.steamId,
                            permissions: [resCheckPhone.role],
                            role: resCheckPhone.role,
                        };
                        session.user = user;
                        res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, user));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, 'PASSWORD ERROR'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, 'INVALID USER'));
                }
            }
        });
    }
    checkValid(res, sessionUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sessionUser) {
                try {
                    const adminUsers = config_1.Config.adminUsers;
                    const user = adminUsers.find(T => T.id === sessionUser.userId);
                    if (user && user.id) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { result: true }));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { result: false }));
                    }
                }
                catch (e) {
                    (0, morgan_log_1.logBussiness)(e);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { result: false }));
                }
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { result: false }));
            }
        });
    }
    logout(res, session) {
        return __awaiter(this, void 0, void 0, function* () {
            session.destroy(() => __awaiter(this, void 0, void 0, function* () {
                res.cookie(`scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`, '', exports.cookieCfg);
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }));
        });
    }
};
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, user_decorator_1.SessUser)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_admin_sys_1.LoginUserBodySysDto, Object, session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], AuthAdminSysController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/checkValid'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser]),
    __metadata("design:returntype", Promise)
], AuthAdminSysController.prototype, "checkValid", null);
__decorate([
    (0, common_1.Get)('/logout'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthAdminSysController.prototype, "logout", null);
AuthAdminSysController = __decorate([
    (0, common_1.Controller)('/authAdminSys'),
    __metadata("design:paramtypes", [])
], AuthAdminSysController);
exports.AuthAdminSysController = AuthAdminSysController;
//# sourceMappingURL=auth-admin-sys.controller.js.map