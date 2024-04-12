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
exports.ItemTypes = void 0;
const typeorm_1 = require("typeorm");
let ItemTypes = class ItemTypes {
    constructor(name, cnName, canBeDeleted, fatherItemTypeId) {
        this.name = name;
        const timeStamp = Date.now() + '';
        this.createdTimeStamp = timeStamp;
        this.topTimeStamp = timeStamp;
        if (cnName !== undefined) {
            this.cnName = cnName;
        }
        if (canBeDeleted !== undefined) {
            this.canBeDeleted = canBeDeleted;
        }
        if (fatherItemTypeId !== undefined) {
            this.fatherItemTypeId = fatherItemTypeId;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], ItemTypes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, unique: true }),
    __metadata("design:type", String)
], ItemTypes.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: null }),
    __metadata("design:type", String)
], ItemTypes.prototype, "cnName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ItemTypes.prototype, "canBeDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: null }),
    __metadata("design:type", String)
], ItemTypes.prototype, "fatherItemTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], ItemTypes.prototype, "topTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], ItemTypes.prototype, "createdTimeStamp", void 0);
ItemTypes = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Boolean, Object])
], ItemTypes);
exports.ItemTypes = ItemTypes;
//# sourceMappingURL=item-types.entity.js.map