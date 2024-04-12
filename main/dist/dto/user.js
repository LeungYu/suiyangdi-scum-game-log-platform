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
exports.UpdateUserLoginsDto = exports.UserCheckInDto = exports.UpdateUserPasswordDto = exports.UserDollarTransitionDto = exports.UpdateUserDto = exports.AddUserDto = exports.ListTopNUsersChargeDollarsDto = exports.ListTopNUsersDollarDto = void 0;
const class_validator_1 = require("class-validator");
const IsPassword_1 = require("../validation/IsPassword");
class ListTopNUsersDollarDto {
}
exports.ListTopNUsersDollarDto = ListTopNUsersDollarDto;
class ListTopNUsersChargeDollarsDto {
}
exports.ListTopNUsersChargeDollarsDto = ListTopNUsersChargeDollarsDto;
class AddUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(null),
    __metadata("design:type", String)
], AddUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(17, 17),
    __metadata("design:type", String)
], AddUserDto.prototype, "steamId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], AddUserDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    (0, IsPassword_1.IsPassword)(['password']),
    __metadata("design:type", String)
], AddUserDto.prototype, "password", void 0);
exports.AddUserDto = AddUserDto;
class UpdateUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "userName", void 0);
exports.UpdateUserDto = UpdateUserDto;
class UserDollarTransitionDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(17, 17),
    __metadata("design:type", String)
], UserDollarTransitionDto.prototype, "toSteamId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UserDollarTransitionDto.prototype, "dollar", void 0);
exports.UserDollarTransitionDto = UserDollarTransitionDto;
class UpdateUserPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    (0, IsPassword_1.IsPassword)(['originPassword']),
    __metadata("design:type", String)
], UpdateUserPasswordDto.prototype, "originPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(8, 16),
    (0, IsPassword_1.IsPassword)(['password']),
    __metadata("design:type", String)
], UpdateUserPasswordDto.prototype, "password", void 0);
exports.UpdateUserPasswordDto = UpdateUserPasswordDto;
class UserCheckInDto {
}
exports.UserCheckInDto = UserCheckInDto;
class UpdateUserLoginsDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateUserLoginsDto.prototype, "records", void 0);
exports.UpdateUserLoginsDto = UpdateUserLoginsDto;
//# sourceMappingURL=user.js.map