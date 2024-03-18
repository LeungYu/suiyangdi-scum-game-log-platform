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
exports.WriteAdminSysGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config/config");
let WriteAdminSysGuard = class WriteAdminSysGuard {
    constructor() { }
    canActivate(context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request = context.switchToHttp().getRequest();
            const userInfo = request.session.user;
            const resGetAdmin = config_1.Config.adminUsers.find(T => T.id === userInfo.userId);
            if (resGetAdmin && ((_a = resGetAdmin === null || resGetAdmin === void 0 ? void 0 : resGetAdmin.id) === null || _a === void 0 ? void 0 : _a.length) && (resGetAdmin === null || resGetAdmin === void 0 ? void 0 : resGetAdmin.role) !== 'adminReadOnly') {
                return true;
            }
            else {
                return false;
            }
        });
    }
};
WriteAdminSysGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WriteAdminSysGuard);
exports.WriteAdminSysGuard = WriteAdminSysGuard;
//# sourceMappingURL=write-admin-sys-access.guard.js.map