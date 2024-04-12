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
exports.ListSquadJoinRequestSysDto = exports.ListSquadHistorySysDto = exports.ListSquadUserSysDto = exports.DisbandSquadSysDto = exports.DeleteSquadSysDto = exports.SquadInfoSysDto = exports.UpdateSquadSysDto = exports.SearchSquadsSysDto = exports.ListSquadSysDto = void 0;
const class_validator_1 = require("class-validator");
class ListSquadSysDto {
}
exports.ListSquadSysDto = ListSquadSysDto;
class SearchSquadsSysDto {
}
exports.SearchSquadsSysDto = SearchSquadsSysDto;
class UpdateSquadSysDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateSquadSysDto.prototype, "id", void 0);
exports.UpdateSquadSysDto = UpdateSquadSysDto;
class SquadInfoSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SquadInfoSysDto.prototype, "id", void 0);
exports.SquadInfoSysDto = SquadInfoSysDto;
class DeleteSquadSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DeleteSquadSysDto.prototype, "id", void 0);
exports.DeleteSquadSysDto = DeleteSquadSysDto;
class DisbandSquadSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DisbandSquadSysDto.prototype, "id", void 0);
exports.DisbandSquadSysDto = DisbandSquadSysDto;
class ListSquadUserSysDto {
}
exports.ListSquadUserSysDto = ListSquadUserSysDto;
class ListSquadHistorySysDto {
}
exports.ListSquadHistorySysDto = ListSquadHistorySysDto;
class ListSquadJoinRequestSysDto {
}
exports.ListSquadJoinRequestSysDto = ListSquadJoinRequestSysDto;
//# sourceMappingURL=squad-admin-sys.js.map