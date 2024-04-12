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
exports.ProcessSquadJoinRequestDto = exports.ListSquadJoinRequestDto = exports.AddOrDeleteSquadViceCaptainDto = exports.TransferSquadCaptainDto = exports.KickSquadUserDto = exports.ListSquadUserDto = exports.DisbandSquadDto = exports.ExitSquadDto = exports.SquadInfoDto = exports.UpdateSquadNameDto = exports.SubmitJoinSquadDto = exports.CreateSquadDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSquadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSquadDto.prototype, "name", void 0);
exports.CreateSquadDto = CreateSquadDto;
class SubmitJoinSquadDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SubmitJoinSquadDto.prototype, "id", void 0);
exports.SubmitJoinSquadDto = SubmitJoinSquadDto;
class UpdateSquadNameDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateSquadNameDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSquadNameDto.prototype, "name", void 0);
exports.UpdateSquadNameDto = UpdateSquadNameDto;
class SquadInfoDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SquadInfoDto.prototype, "id", void 0);
exports.SquadInfoDto = SquadInfoDto;
class ExitSquadDto {
}
exports.ExitSquadDto = ExitSquadDto;
class DisbandSquadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DisbandSquadDto.prototype, "id", void 0);
exports.DisbandSquadDto = DisbandSquadDto;
class ListSquadUserDto {
}
exports.ListSquadUserDto = ListSquadUserDto;
class KickSquadUserDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], KickSquadUserDto.prototype, "squadId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], KickSquadUserDto.prototype, "userId", void 0);
exports.KickSquadUserDto = KickSquadUserDto;
class TransferSquadCaptainDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TransferSquadCaptainDto.prototype, "squadId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TransferSquadCaptainDto.prototype, "userId", void 0);
exports.TransferSquadCaptainDto = TransferSquadCaptainDto;
class AddOrDeleteSquadViceCaptainDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddOrDeleteSquadViceCaptainDto.prototype, "squadId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddOrDeleteSquadViceCaptainDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddOrDeleteSquadViceCaptainDto.prototype, "action", void 0);
exports.AddOrDeleteSquadViceCaptainDto = AddOrDeleteSquadViceCaptainDto;
class ListSquadJoinRequestDto {
}
exports.ListSquadJoinRequestDto = ListSquadJoinRequestDto;
class ProcessSquadJoinRequestDto {
}
exports.ProcessSquadJoinRequestDto = ProcessSquadJoinRequestDto;
//# sourceMappingURL=squad.js.map