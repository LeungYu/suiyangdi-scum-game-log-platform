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
exports.DeleteQueueItemSysDto = exports.RedoQueueSysDto = exports.updateAllStatusSysDto = exports.updateStatusSysDto = exports.AddQueueSysDto = exports.InfoQueueSysDto = exports.ListQueueSysDto = void 0;
const class_validator_1 = require("class-validator");
class ListQueueSysDto {
}
exports.ListQueueSysDto = ListQueueSysDto;
class InfoQueueSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InfoQueueSysDto.prototype, "id", void 0);
exports.InfoQueueSysDto = InfoQueueSysDto;
class AddQueueSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddQueueSysDto.prototype, "commands", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddQueueSysDto.prototype, "type", void 0);
exports.AddQueueSysDto = AddQueueSysDto;
class updateStatusSysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], updateStatusSysDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateStatusSysDto.prototype, "status", void 0);
exports.updateStatusSysDto = updateStatusSysDto;
class updateAllStatusSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateAllStatusSysDto.prototype, "status", void 0);
exports.updateAllStatusSysDto = updateAllStatusSysDto;
class RedoQueueSysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RedoQueueSysDto.prototype, "id", void 0);
exports.RedoQueueSysDto = RedoQueueSysDto;
class DeleteQueueItemSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteQueueItemSysDto.prototype, "id", void 0);
exports.DeleteQueueItemSysDto = DeleteQueueItemSysDto;
//# sourceMappingURL=queue-admin-sys.js.map