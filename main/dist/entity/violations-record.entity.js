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
exports.ViolationsRecord = void 0;
const typeorm_1 = require("typeorm");
let ViolationsRecord = class ViolationsRecord {
    constructor(rawContent, createdTimeStamp, tag, steamId, count, otherConfig) {
        if (rawContent) {
            this.rawContent = rawContent;
        }
        if (createdTimeStamp) {
            this.createdTimeStamp = createdTimeStamp;
        }
        if (tag) {
            this.tag = tag;
        }
        if (steamId) {
            this.steamId = steamId;
        }
        if (count) {
            this.count = count;
        }
        if (otherConfig) {
            this.otherConfig = otherConfig;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], ViolationsRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ViolationsRecord.prototype, "rawContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], ViolationsRecord.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, default: null }),
    __metadata("design:type", String)
], ViolationsRecord.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 17, default: null }),
    __metadata("design:type", String)
], ViolationsRecord.prototype, "steamId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ViolationsRecord.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null }),
    __metadata("design:type", Object)
], ViolationsRecord.prototype, "otherConfig", void 0);
ViolationsRecord = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, Number, Object])
], ViolationsRecord);
exports.ViolationsRecord = ViolationsRecord;
//# sourceMappingURL=violations-record.entity.js.map