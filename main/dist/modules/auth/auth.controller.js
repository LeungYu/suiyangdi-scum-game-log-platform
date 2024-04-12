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
exports.AuthController = exports.cookieCfg = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../../dto/auth");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const config_1 = require("../../config/config");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const user_password_service_1 = require("../user/user-password.service");
const md5_1 = require("../../common/md5");
const admin_service_1 = require("../admin/admin.service");
const morgan_log_1 = require("../../common/morgan-log");
exports.cookieCfg = {
    expires: new Date(0),
    domain: config_1.Config.getConf('COOKIE_DOMAIN'),
    maxAge: 0,
    httpOnly: true,
};
let AuthController = class AuthController {
    constructor(authService, userService, userPasswordService, adminService) {
        this.authService = authService;
        this.userService = userService;
        this.userPasswordService = userPasswordService;
        this.adminService = adminService;
    }
    login(query, body, req, res, sessionUser, session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sessionUser) {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, sessionUser));
            }
            else {
                const resCheckPhone = yield this.userService.getUser({ phone: body.user });
                if (resCheckPhone) {
                    const userId = resCheckPhone.id;
                    const md5Password = (0, md5_1.md5)(body.password);
                    const resCheckPassword = yield this.userPasswordService.getUserPassword(userId);
                    const sqlPassword = resCheckPassword.password;
                    if (md5Password === sqlPassword) {
                        const resCheckAdmin = yield this.adminService.getAdmin({ userId: userId });
                        const user = {
                            userId,
                            steamId: resCheckPhone.steamId,
                            permissions: resCheckAdmin ? (resCheckAdmin.isSysAdmin ? ['sysAdmin'] : (resCheckAdmin.isReadOnly ? ['adminReadOnly'] : ['admin'])) : [],
                            role: resCheckAdmin ? (resCheckAdmin.isSysAdmin ? 'sysAdmin' : (resCheckAdmin.isReadOnly ? 'adminReadOnly' : 'admin')) : 'user'
                        };
                        session.user = user;
                        res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, user));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '密码错误'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, '用户不存在'));
                }
            }
        });
    }
    checkValid(res, sessionUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sessionUser) {
                try {
                    const user = yield this.userService.getUser(sessionUser);
                    if (user && user.id && user.status === 'normal') {
                        user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                        user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
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
    logout(req, res, query, session, sessionUser) {
        return __awaiter(this, void 0, void 0, function* () {
            session.destroy(() => {
                res.cookie(`scum.store-${config_1.Config.getConf('SCUM_STORE_NO')}.sid`, '', exports.cookieCfg);
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            });
        });
    }
};
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, user_decorator_1.SessUser)()),
    __param(5, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.LoginUserDto,
        auth_1.LoginUserBodyDto, Object, Object, session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/checkValid'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkValid", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Session)()),
    __param(4, (0, user_decorator_1.SessUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, auth_1.LogoutUserDto, Object, session_user_1.SessionUser]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService,
        user_password_service_1.UserPasswordService,
        admin_service_1.AdminService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map