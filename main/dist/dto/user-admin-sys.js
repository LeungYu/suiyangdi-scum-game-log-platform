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
exports.GetSteamInfoSysDto = exports.CleanUserLoginSysDto = exports.SearchUserLoginSysDto = exports.ListUserLoginSysDto = exports.SearchUserLoginMultiSysDto = void 0;
const class_validator_1 = require("class-validator");
class SearchUserLoginMultiSysDto {
}
exports.SearchUserLoginMultiSysDto = SearchUserLoginMultiSysDto;
class ListUserLoginSysDto {
}
exports.ListUserLoginSysDto = ListUserLoginSysDto;
class SearchUserLoginSysDto {
}
exports.SearchUserLoginSysDto = SearchUserLoginSysDto;
class CleanUserLoginSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CleanUserLoginSysDto.prototype, "userId", void 0);
exports.CleanUserLoginSysDto = CleanUserLoginSysDto;
class GetSteamInfoSysDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(17, 17),
    __metadata("design:type", String)
], GetSteamInfoSysDto.prototype, "steamId", void 0);
exports.GetSteamInfoSysDto = GetSteamInfoSysDto;
//# sourceMappingURL=user-admin-sys.js.map