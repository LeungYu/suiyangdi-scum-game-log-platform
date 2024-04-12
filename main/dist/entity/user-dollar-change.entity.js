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
exports.UserDollarChange = void 0;
const typeorm_1 = require("typeorm");
let UserDollarChange = class UserDollarChange {
    constructor(userId, balance, reason) {
        this.userId = userId;
        this.balance = balance;
        this.createdTimeStamp = Date.now() + '';
        if (reason !== undefined) {
            this.reason = reason;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], UserDollarChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Object)
], UserDollarChange.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], UserDollarChange.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], UserDollarChange.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], UserDollarChange.prototype, "createdTimeStamp", void 0);
UserDollarChange = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object, Number, String])
], UserDollarChange);
exports.UserDollarChange = UserDollarChange;
//# sourceMappingURL=user-dollar-change.entity.js.map