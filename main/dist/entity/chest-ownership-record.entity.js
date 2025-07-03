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
exports.ChestOwnershipRecord = void 0;
const typeorm_1 = require("typeorm");
let ChestOwnershipRecord = class ChestOwnershipRecord {
    constructor(fromScumId, fromSteamId, toScumId, toSteamId, chestId, createdTimeStamp) {
        this.fromScumId = fromScumId;
        this.fromSteamId = fromSteamId;
        this.toScumId = toScumId;
        this.toSteamId = toSteamId;
        this.chestId = chestId;
        this.createdTimeStamp = createdTimeStamp;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], ChestOwnershipRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "fromScumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "fromSteamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "toScumId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "toSteamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10 }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "chestId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], ChestOwnershipRecord.prototype, "createdTimeStamp", void 0);
ChestOwnershipRecord = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, String, String])
], ChestOwnershipRecord);
exports.ChestOwnershipRecord = ChestOwnershipRecord;
//# sourceMappingURL=chest-ownership-record.entity.js.map