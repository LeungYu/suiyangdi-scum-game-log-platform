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
exports.Buy = void 0;
const typeorm_1 = require("typeorm");
let Buy = class Buy {
    constructor(userId, itemId, number, isPrePurchase, remainTimes, vehicleId, status, configs, updateTimeStamp) {
        const timeStamp = Date.now() + '';
        this.userId = userId;
        this.createdTimeStamp = timeStamp;
        this.itemId = itemId;
        this.number = number;
        this.updateTimeStamp = updateTimeStamp === undefined ? timeStamp : updateTimeStamp;
        if (isPrePurchase !== undefined) {
            this.isPrePurchase = isPrePurchase;
        }
        if (remainTimes !== undefined) {
            this.remainTimes = remainTimes;
        }
        if (vehicleId !== undefined) {
            this.vehicleId = vehicleId;
        }
        if (configs !== undefined) {
            this.configs = configs;
        }
        if (status !== undefined) {
            this.status = status;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Buy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Object)
], Buy.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Buy.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", String)
], Buy.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Buy.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Buy.prototype, "isPrePurchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Buy.prototype, "remainTimes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: null }),
    __metadata("design:type", Number)
], Buy.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, default: 'created' }),
    __metadata("design:type", String)
], Buy.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], Buy.prototype, "configs", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Buy.prototype, "updateTimeStamp", void 0);
Buy = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object, Object, Number, Boolean, Number, Number, String, String, String])
], Buy);
exports.Buy = Buy;
//# sourceMappingURL=buy.entity.js.map