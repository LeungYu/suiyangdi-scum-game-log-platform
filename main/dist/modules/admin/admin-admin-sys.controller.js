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
exports.AdminAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const admin_admin_sys_1 = require("../../dto/admin-admin-sys");
const user_service_1 = require("../user/user.service");
const response_builder_1 = require("../../common/response-builder");
const admin_service_1 = require("../admin/admin.service");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
let AdminAdminSysController = class AdminAdminSysController {
    constructor(adminService, userService) {
        this.adminService = adminService;
        this.userService = userService;
    }
    add(userInfo, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetUser = yield this.userService.getUser({ userId: body.userId });
                if (!(resGetUser && resGetUser.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在'));
                }
                resGetUser.userDollar.level = resGetUser.userDollar.levelExpireTimeStamp === null || resGetUser.userDollar.levelExpireTimeStamp >= Date.now() ? resGetUser.userDollar.level : 0;
                resGetUser.userDollar.chargeDollars = resGetUser.userDollar.levelExpireTimeStamp === null || resGetUser.userDollar.levelExpireTimeStamp >= Date.now() ? resGetUser.userDollar.chargeDollars : 0;
                const resGetAdmin = yield this.adminService.getAdmin({ userId: body.userId });
                if (resGetAdmin && resGetAdmin.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '条目已存在'));
                }
                else {
                    const resAddAdmin = yield this.adminService.saveAdmin(body.userId, body.isSysAdmin, body.isReadOnly);
                    if (resAddAdmin && resAddAdmin.id) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resAddAdmin));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, resAddAdmin, '新增出错'));
                    }
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    update(userInfo, res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetUser = yield this.userService.getUser({ userId: body.userId });
                if (!(resGetUser && resGetUser.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在'));
                }
                const resGetAdmin = yield this.adminService.getAdmin({ userId: body.userId });
                if (resGetAdmin && resGetAdmin.id) {
                    const resUpdateAdmin = yield this.adminService.updateAdmin(body.userId, body.isSysAdmin, (body.isReadOnly === undefined || body.isReadOnly === null) ? false : body.isReadOnly);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.adminService.getAdmin({ userId: body.userId })));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '条目不存在'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    delete(userInfo, res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetUser = yield this.userService.getUser({ userId: query.userId });
                if (!(resGetUser && resGetUser.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在'));
                }
                const resGetAdmin = yield this.adminService.getAdmin({ userId: query.userId });
                if (resGetAdmin && resGetAdmin.id) {
                    const resDeleteAdmin = yield this.adminService.deleteAdmin({ userId: query.userId });
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '条目不存在'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, admin_admin_sys_1.AddAdminSysDto]),
    __metadata("design:returntype", Promise)
], AdminAdminSysController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/update'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, admin_admin_sys_1.UpdateAdminSysDto]),
    __metadata("design:returntype", Promise)
], AdminAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, admin_admin_sys_1.DeleteAdminSysDto]),
    __metadata("design:returntype", Promise)
], AdminAdminSysController.prototype, "delete", null);
AdminAdminSysController = __decorate([
    (0, common_1.Controller)('/adminAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        user_service_1.UserService])
], AdminAdminSysController);
exports.AdminAdminSysController = AdminAdminSysController;
//# sourceMappingURL=admin-admin-sys.controller.js.map