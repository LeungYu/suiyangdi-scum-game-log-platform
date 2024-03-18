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
exports.Economy = void 0;
const typeorm_1 = require("typeorm");
let Economy = class Economy {
    constructor(scumId, steamId, type, trader, createdTimeStamp, otherConfig) {
        this.scumId = scumId;
        this.steamId = steamId;
        this.type = type;
        this.trader = trader;
        this.createdTimeStamp = createdTimeStamp;
        if (otherConfig) {
            this.otherConfig = otherConfig;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Economy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], Economy.prototype, "scumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], Economy.prototype, "steamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], Economy.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: null }),
    __metadata("design:type", String)
], Economy.prototype, "trader", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Economy.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null }),
    __metadata("design:type", Object)
], Economy.prototype, "otherConfig", void 0);
Economy = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, Object])
], Economy);
exports.Economy = Economy;
//# sourceMappingURL=economy.entity.js.map