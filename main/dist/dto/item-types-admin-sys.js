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
exports.ImportItemTypesSysDto = exports.DeleteItemsTypesSysDto = exports.DeleteItemTypesSysDto = exports.UpdateItemTypesSysDto = exports.AddItemTypesSysDto = exports.ItemTypesInfoSysDto = exports.ListItemTypesSysDto = void 0;
const class_validator_1 = require("class-validator");
class ListItemTypesSysDto {
}
exports.ListItemTypesSysDto = ListItemTypesSysDto;
class ItemTypesInfoSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ItemTypesInfoSysDto.prototype, "id", void 0);
exports.ItemTypesInfoSysDto = ItemTypesInfoSysDto;
class AddItemTypesSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddItemTypesSysDto.prototype, "name", void 0);
exports.AddItemTypesSysDto = AddItemTypesSysDto;
class UpdateItemTypesSysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateItemTypesSysDto.prototype, "id", void 0);
exports.UpdateItemTypesSysDto = UpdateItemTypesSysDto;
class DeleteItemTypesSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteItemTypesSysDto.prototype, "id", void 0);
exports.DeleteItemTypesSysDto = DeleteItemTypesSysDto;
class DeleteItemsTypesSysDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], DeleteItemsTypesSysDto.prototype, "ids", void 0);
exports.DeleteItemsTypesSysDto = DeleteItemsTypesSysDto;
class ImportItemTypesSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportItemTypesSysDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ImportItemTypesSysDto.prototype, "data", void 0);
exports.ImportItemTypesSysDto = ImportItemTypesSysDto;
//# sourceMappingURL=item-types-admin-sys.js.map