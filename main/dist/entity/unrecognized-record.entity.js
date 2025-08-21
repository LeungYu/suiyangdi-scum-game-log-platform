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
exports.UnrecognizedRecord = void 0;
const typeorm_1 = require("typeorm");
let UnrecognizedRecord = class UnrecognizedRecord {
    constructor(fileName, rawText, createdTimeStamp) {
        this.fileName = fileName;
        this.rawText = rawText;
        this.createdTimeStamp = createdTimeStamp;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], UnrecognizedRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], UnrecognizedRecord.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], UnrecognizedRecord.prototype, "rawText", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], UnrecognizedRecord.prototype, "createdTimeStamp", void 0);
UnrecognizedRecord = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String])
], UnrecognizedRecord);
exports.UnrecognizedRecord = UnrecognizedRecord;
//# sourceMappingURL=unrecognized-record.entity.js.map