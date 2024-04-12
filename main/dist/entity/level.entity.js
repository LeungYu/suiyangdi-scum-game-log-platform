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
exports.Level = void 0;
const typeorm_1 = require("typeorm");
let Level = class Level {
    constructor(level, chargeDollars, discount, enableGesture, generalGesture, checkInPrize, onlinePrize, minRewardOnlineTime, enableLevelAnnounce) {
        this.level = level;
        this.chargeDollars = chargeDollars;
        this.discount = discount;
        this.enableGesture = enableGesture;
        if (generalGesture !== undefined) {
            this.generalGesture = generalGesture;
        }
        if (checkInPrize !== undefined) {
            this.checkInPrize = checkInPrize;
        }
        if (onlinePrize !== undefined) {
            this.onlinePrize = onlinePrize;
        }
        if (minRewardOnlineTime !== undefined) {
            this.minRewardOnlineTime = minRewardOnlineTime;
        }
        if (enableLevelAnnounce !== undefined) {
            this.enableLevelAnnounce = enableLevelAnnounce;
        }
        this.createdTimeStamp = Date.now() + '';
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Level.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, unique: true }),
    __metadata("design:type", Number)
], Level.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "chargeDollars", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: 0 }),
    __metadata("design:type", Boolean)
], Level.prototype, "enableGesture", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], Level.prototype, "generalGesture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: null }),
    __metadata("design:type", Number)
], Level.prototype, "checkInPrize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: null }),
    __metadata("design:type", Number)
], Level.prototype, "onlinePrize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: null }),
    __metadata("design:type", Number)
], Level.prototype, "minRewardOnlineTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: null }),
    __metadata("design:type", Boolean)
], Level.prototype, "enableLevelAnnounce", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Level.prototype, "createdTimeStamp", void 0);
Level = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, Number, Number, Boolean, String, Number, Number, Number, Boolean])
], Level);
exports.Level = Level;
//# sourceMappingURL=level.entity.js.map