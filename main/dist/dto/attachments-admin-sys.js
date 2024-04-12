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
exports.ImportAttachmentsSysDto = exports.DeleteAttachmentsSysDto = exports.UpdateAttachmentsSysDto = exports.AddAttachmentsSysDto = exports.AttachmentsInfoSysDto = exports.SearchAttachmentsSysDto = exports.ListAttachmentsSysDto = void 0;
const class_validator_1 = require("class-validator");
class ListAttachmentsSysDto {
}
exports.ListAttachmentsSysDto = ListAttachmentsSysDto;
class SearchAttachmentsSysDto {
}
exports.SearchAttachmentsSysDto = SearchAttachmentsSysDto;
class AttachmentsInfoSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AttachmentsInfoSysDto.prototype, "id", void 0);
exports.AttachmentsInfoSysDto = AttachmentsInfoSysDto;
class AddAttachmentsSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddAttachmentsSysDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddAttachmentsSysDto.prototype, "url", void 0);
exports.AddAttachmentsSysDto = AddAttachmentsSysDto;
class UpdateAttachmentsSysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateAttachmentsSysDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAttachmentsSysDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAttachmentsSysDto.prototype, "url", void 0);
exports.UpdateAttachmentsSysDto = UpdateAttachmentsSysDto;
class DeleteAttachmentsSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteAttachmentsSysDto.prototype, "id", void 0);
exports.DeleteAttachmentsSysDto = DeleteAttachmentsSysDto;
class ImportAttachmentsSysDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ImportAttachmentsSysDto.prototype, "data", void 0);
exports.ImportAttachmentsSysDto = ImportAttachmentsSysDto;
//# sourceMappingURL=attachments-admin-sys.js.map