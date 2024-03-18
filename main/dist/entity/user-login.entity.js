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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = void 0;
const typeorm_1 = require("typeorm");
let UserLogin = class UserLogin {
    constructor(scumId, steamId, sessionId, loginIp, status, loginTimeStamp, logoutTimeStamp, otherConfig) {
        this.scumId = scumId;
        this.steamId = steamId;
        this.sessionId = sessionId;
        this.loginIp = loginIp;
        if (status !== undefined) {
            this.status = status;
        }
        if (loginTimeStamp !== undefined) {
            this.loginTimeStamp = loginTimeStamp;
        }
        if (logoutTimeStamp !== undefined) {
            this.logoutTimeStamp = logoutTimeStamp;
        }
        if (otherConfig !== undefined) {
            this.otherConfig = otherConfig;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], UserLogin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], UserLogin.prototype, "scumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17 }),
    __metadata("design:type", String)
], UserLogin.prototype, "steamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], UserLogin.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], UserLogin.prototype, "loginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: 'login' }),
    __metadata("design:type", String)
], UserLogin.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], UserLogin.prototype, "loginTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], UserLogin.prototype, "logoutTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null }),
    __metadata("design:type", Object)
], UserLogin.prototype, "otherConfig", void 0);
UserLogin = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object])
], UserLogin);
exports.UserLogin = UserLogin;
//# sourceMappingURL=user-login.entity.js.map