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
exports.CleanVehiclesSysDto = exports.DeleteBuySysDto = exports.RefundBuySysDto = exports.ResendBuySysDto = exports.updateStatusSysDto = exports.InfoBuySysDto = exports.ListBuySysDto = void 0;
const class_validator_1 = require("class-validator");
class ListBuySysDto {
}
exports.ListBuySysDto = ListBuySysDto;
class InfoBuySysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InfoBuySysDto.prototype, "id", void 0);
exports.InfoBuySysDto = InfoBuySysDto;
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
class ResendBuySysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ResendBuySysDto.prototype, "id", void 0);
exports.ResendBuySysDto = ResendBuySysDto;
class RefundBuySysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RefundBuySysDto.prototype, "id", void 0);
exports.RefundBuySysDto = RefundBuySysDto;
class DeleteBuySysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteBuySysDto.prototype, "id", void 0);
exports.DeleteBuySysDto = DeleteBuySysDto;
class CleanVehiclesSysDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CleanVehiclesSysDto.prototype, "vehicleIds", void 0);
exports.CleanVehiclesSysDto = CleanVehiclesSysDto;
//# sourceMappingURL=buy-admin-sys.js.map