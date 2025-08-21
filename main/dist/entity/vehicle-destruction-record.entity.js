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
exports.VehicleDestructionRecord = void 0;
const typeorm_1 = require("typeorm");
let VehicleDestructionRecord = class VehicleDestructionRecord {
    constructor(ownerScumId, ownerSteamId, ownerSessionId, actionType, vehicleType, vehicleId, locations, area, createdTimeStamp, rawText) {
        this.ownerScumId = ownerScumId;
        this.ownerSteamId = ownerSteamId;
        this.ownerSessionId = ownerSessionId;
        this.actionType = actionType;
        this.vehicleType = vehicleType;
        this.vehicleId = vehicleId;
        this.locations = locations;
        this.area = area;
        this.createdTimeStamp = createdTimeStamp;
        if (rawText) {
            this.rawText = rawText;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], VehicleDestructionRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "ownerScumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "ownerSteamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "ownerSessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60 }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], VehicleDestructionRecord.prototype, "rawText", void 0);
VehicleDestructionRecord = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String])
], VehicleDestructionRecord);
exports.VehicleDestructionRecord = VehicleDestructionRecord;
//# sourceMappingURL=vehicle-destruction-record.entity.js.map