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
exports.Kill = void 0;
const typeorm_1 = require("typeorm");
let Kill = class Kill {
    constructor(killerSteamId, killerName, killerLocations, killerArea, victimSteamId, victimName, victimLocations, victimArea, distance, weapon, isEventKill, occuredTimeStamp) {
        this.killerSteamId = killerSteamId;
        this.killerName = killerName;
        this.killerLocations = killerLocations;
        this.killerArea = killerArea;
        this.victimSteamId = victimSteamId;
        this.victimName = victimName;
        this.victimLocations = victimLocations;
        this.victimArea = victimArea;
        this.distance = distance;
        this.weapon = weapon;
        this.isEventKill = isEventKill;
        this.occuredTimeStamp = occuredTimeStamp;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Kill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17 }),
    __metadata("design:type", String)
], Kill.prototype, "killerSteamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], Kill.prototype, "killerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60 }),
    __metadata("design:type", String)
], Kill.prototype, "killerLocations", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], Kill.prototype, "killerArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17 }),
    __metadata("design:type", String)
], Kill.prototype, "victimSteamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], Kill.prototype, "victimName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60 }),
    __metadata("design:type", String)
], Kill.prototype, "victimLocations", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], Kill.prototype, "victimArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Kill.prototype, "weapon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Kill.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Kill.prototype, "isEventKill", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Kill.prototype, "occuredTimeStamp", void 0);
Kill = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Number, String, Boolean, String])
], Kill);
exports.Kill = Kill;
//# sourceMappingURL=kill.entity.js.map