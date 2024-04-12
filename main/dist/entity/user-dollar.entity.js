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
exports.UserDollar = void 0;
const typeorm_1 = require("typeorm");
let UserDollar = class UserDollar {
    constructor(userId, dollars, chargeDollars, level, gesture) {
        this.userId = userId;
        this.dollars = dollars;
        this.chargeDollars = chargeDollars;
        this.updateTimeStamp = Date.now() + '';
        if (level !== undefined) {
            this.level = level;
        }
        if (gesture) {
            this.gesture = gesture;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], UserDollar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, unique: true }),
    __metadata("design:type", Object)
], UserDollar.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], UserDollar.prototype, "dollars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', default: 0 }),
    __metadata("design:type", Number)
], UserDollar.prototype, "chargeDollars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserDollar.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], UserDollar.prototype, "gesture", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], UserDollar.prototype, "levelExpireTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], UserDollar.prototype, "updateTimeStamp", void 0);
UserDollar = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String])
], UserDollar);
exports.UserDollar = UserDollar;
//# sourceMappingURL=user-dollar.entity.js.map