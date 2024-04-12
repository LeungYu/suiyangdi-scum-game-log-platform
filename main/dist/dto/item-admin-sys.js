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
exports.ImportItemsSysDto = exports.deleteItemsSysDto = exports.deleteItemSysDto = exports.updateItemsPriceSysDto = exports.updateItemAllPriceSysDto = exports.updateItemAllTeleportSysDto = exports.updateItemSysDto = exports.addItemSysDto = exports.ItemInfoSysDto = exports.ListItemSysDto = void 0;
const class_validator_1 = require("class-validator");
class ListItemSysDto {
}
exports.ListItemSysDto = ListItemSysDto;
class ItemInfoSysDto {
}
exports.ItemInfoSysDto = ItemInfoSysDto;
class addItemSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addItemSysDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addItemSysDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], addItemSysDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addItemSysDto.prototype, "configType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], addItemSysDto.prototype, "isBlock", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addItemSysDto.prototype, "commands", void 0);
exports.addItemSysDto = addItemSysDto;
class updateItemSysDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], updateItemSysDto.prototype, "id", void 0);
exports.updateItemSysDto = updateItemSysDto;
class updateItemAllTeleportSysDto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], updateItemAllTeleportSysDto.prototype, "isTeleport", void 0);
exports.updateItemAllTeleportSysDto = updateItemAllTeleportSysDto;
class updateItemAllPriceSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateItemAllPriceSysDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], updateItemAllPriceSysDto.prototype, "param", void 0);
exports.updateItemAllPriceSysDto = updateItemAllPriceSysDto;
class updateItemsPriceSysDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], updateItemsPriceSysDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateItemsPriceSysDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], updateItemsPriceSysDto.prototype, "param", void 0);
exports.updateItemsPriceSysDto = updateItemsPriceSysDto;
class deleteItemSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], deleteItemSysDto.prototype, "id", void 0);
exports.deleteItemSysDto = deleteItemSysDto;
class deleteItemsSysDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], deleteItemsSysDto.prototype, "ids", void 0);
exports.deleteItemsSysDto = deleteItemsSysDto;
class ImportItemsSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportItemsSysDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ImportItemsSysDto.prototype, "data", void 0);
exports.ImportItemsSysDto = ImportItemsSysDto;
//# sourceMappingURL=item-admin-sys.js.map