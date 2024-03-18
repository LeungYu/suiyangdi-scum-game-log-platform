"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
let PermissionsGuard = class PermissionsGuard {
    canActivate(context) {
        const permissions = Reflect.getMetadata('permissions', context.getHandler());
        if (!permissions || !permissions.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userInfo = request.session.user;
        if (userInfo) {
            if (userInfo.role === 'admin' || userInfo.role === 'adminReadOnly' || userInfo.role === 'sysAdmin') {
                return true;
            }
            return userInfo.permissions.indexOf(permissions[0]) !== -1;
        }
        return false;
    }
};
PermissionsGuard = __decorate([
    (0, common_1.Injectable)()
], PermissionsGuard);
exports.PermissionsGuard = PermissionsGuard;
//# sourceMappingURL=permissions.guard.js.map