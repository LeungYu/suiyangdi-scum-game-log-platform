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
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    constructor(email, phone, steamId, userName, hasBoughtWelcomepack, buyWelcomeDidiCarTime, status) {
        this.email = email;
        this.phone = phone;
        this.steamId = steamId;
        this.userName = userName;
        this.createdTimeStamp = Date.now() + '';
        if (status) {
            this.status = status;
        }
        if (hasBoughtWelcomepack) {
            this.hasBoughtWelcomepack = hasBoughtWelcomepack;
        }
        if (buyWelcomeDidiCarTime) {
            this.buyWelcomeDidiCarTime = buyWelcomeDidiCarTime;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, unique: true }),
    __metadata("design:type", String)
], User.prototype, "steamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 6, default: 'normal' }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasBoughtWelcomepack", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "buyWelcomeDidiCarTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], User.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], User.prototype, "lastCheckInTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], User.prototype, "lastLoginTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], User.prototype, "lastLogoutTimeStamp", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Number, String])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map