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
exports.AddDollarAddBuyDto = exports.AddRandomPrizeBuyDto = exports.AddSquadMemberTeleportBuyDto = exports.AddUserLocationTeleportBuyDto = exports.AddMapTeleportBuyDto = exports.AddHotPointTeleportBuyDto = exports.AddSafeZoneTeleportBuyDto = exports.AddMessagesBuyDto = exports.AddFamesBuyDto = exports.CommitPrePurchaseSetBuyDto = exports.AddPrePurchaseSetBuyDto = exports.AddWelcomePackBuyDto = exports.AddMultiBuyDto = exports.AddNormalBuyDto = exports.ListBuyByUserDto = void 0;
const class_validator_1 = require("class-validator");
class ListBuyByUserDto {
}
exports.ListBuyByUserDto = ListBuyByUserDto;
class AddNormalBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddNormalBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], AddNormalBuyDto.prototype, "number", void 0);
exports.AddNormalBuyDto = AddNormalBuyDto;
class AddMultiBuyDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AddMultiBuyDto.prototype, "items", void 0);
exports.AddMultiBuyDto = AddMultiBuyDto;
class AddWelcomePackBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddWelcomePackBuyDto.prototype, "itemId", void 0);
exports.AddWelcomePackBuyDto = AddWelcomePackBuyDto;
class AddPrePurchaseSetBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddPrePurchaseSetBuyDto.prototype, "itemId", void 0);
exports.AddPrePurchaseSetBuyDto = AddPrePurchaseSetBuyDto;
class CommitPrePurchaseSetBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CommitPrePurchaseSetBuyDto.prototype, "id", void 0);
exports.CommitPrePurchaseSetBuyDto = CommitPrePurchaseSetBuyDto;
class AddFamesBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddFamesBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddFamesBuyDto.prototype, "fame", void 0);
exports.AddFamesBuyDto = AddFamesBuyDto;
class AddMessagesBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddMessagesBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddMessagesBuyDto.prototype, "messages", void 0);
exports.AddMessagesBuyDto = AddMessagesBuyDto;
class AddSafeZoneTeleportBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddSafeZoneTeleportBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddSafeZoneTeleportBuyDto.prototype, "zone", void 0);
exports.AddSafeZoneTeleportBuyDto = AddSafeZoneTeleportBuyDto;
class AddHotPointTeleportBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddHotPointTeleportBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddHotPointTeleportBuyDto.prototype, "name", void 0);
exports.AddHotPointTeleportBuyDto = AddHotPointTeleportBuyDto;
class AddMapTeleportBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddMapTeleportBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddMapTeleportBuyDto.prototype, "location", void 0);
exports.AddMapTeleportBuyDto = AddMapTeleportBuyDto;
class AddUserLocationTeleportBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddUserLocationTeleportBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddUserLocationTeleportBuyDto.prototype, "userLocationId", void 0);
exports.AddUserLocationTeleportBuyDto = AddUserLocationTeleportBuyDto;
class AddSquadMemberTeleportBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddSquadMemberTeleportBuyDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddSquadMemberTeleportBuyDto.prototype, "toUserId", void 0);
exports.AddSquadMemberTeleportBuyDto = AddSquadMemberTeleportBuyDto;
class AddRandomPrizeBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddRandomPrizeBuyDto.prototype, "itemId", void 0);
exports.AddRandomPrizeBuyDto = AddRandomPrizeBuyDto;
class AddDollarAddBuyDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AddDollarAddBuyDto.prototype, "itemId", void 0);
exports.AddDollarAddBuyDto = AddDollarAddBuyDto;
//# sourceMappingURL=buy.js.map