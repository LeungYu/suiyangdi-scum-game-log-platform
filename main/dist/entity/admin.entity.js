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
exports.Admin = void 0;
const typeorm_1 = require("typeorm");
let Admin = class Admin {
    constructor(userId, isSysAdmin, isReadOnly) {
        this.userId = userId;
        if (isSysAdmin !== undefined) {
            this.isSysAdmin = isSysAdmin;
        }
        if (isReadOnly !== undefined) {
            this.isReadOnly = isReadOnly;
        }
        this.createdTimeStamp = Date.now() + '';
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Admin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, unique: true }),
    __metadata("design:type", Object)
], Admin.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isReadOnly", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Admin.prototype, "isSysAdmin", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Admin.prototype, "createdTimeStamp", void 0);
Admin = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object, Boolean, Boolean])
], Admin);
exports.Admin = Admin;
//# sourceMappingURL=admin.entity.js.map