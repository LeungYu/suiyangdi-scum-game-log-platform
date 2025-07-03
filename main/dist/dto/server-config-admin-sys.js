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
exports.UpdateScumLogSysDto = exports.UpdateGportalSettingsSysDto = exports.UpdateAllGportalSettingsSysDto = exports.ListServerConfigSysDto = void 0;
const class_validator_1 = require("class-validator");
const IsGPortalConfigs_1 = require("../validation/IsGPortalConfigs");
const IsNitradoConfigs_1 = require("../validation/IsNitradoConfigs");
const IsGGHostConfigs_1 = require("../validation/IsGGHostConfigs");
const IsPrivateConfigs_1 = require("../validation/IsPrivateConfigs");
class ListServerConfigSysDto {
}
exports.ListServerConfigSysDto = ListServerConfigSysDto;
class UpdateAllGportalSettingsSysDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GameServerType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "BattleMetricServerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['ServerId']),
    (0, IsNitradoConfigs_1.IsNitradoConfigs)(['ServerId']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "ServerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['GPortalFTPAccount']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GPortalFTPUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['GPortalFTPAccount']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GPortalFTPAccount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['GPortalFTPPassword']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GPortalFTPPassword", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['EnableGPortalLogsRollback']),
    __metadata("design:type", Boolean)
], UpdateAllGportalSettingsSysDto.prototype, "EnableGPortalLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['EnableGPortalLogsRollback']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "GPortalLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsGPortalConfigs_1.IsGPortalConfigs)(['GPortalLogsRollbackInterval']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "GPortalLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsNitradoConfigs_1.IsNitradoConfigs)(['NitradoAuthorizationToken']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "NitradoAuthorizationToken", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, IsNitradoConfigs_1.IsNitradoConfigs)(['EnableNitradoLogsRollback']),
    __metadata("design:type", Boolean)
], UpdateAllGportalSettingsSysDto.prototype, "EnableNitradoLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsNitradoConfigs_1.IsNitradoConfigs)(['NitradoLogsRollbackInterval']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "NitradoLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostServerDetail']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostServerDetail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostFTPPath']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostFTPPath", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostFTPType']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostFTPType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostFTPUrl']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostFTPUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostFTPAccount']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostFTPAccount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostFTPPassword']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostFTPPassword", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['EnableGGHostLogsRollback']),
    __metadata("design:type", Boolean)
], UpdateAllGportalSettingsSysDto.prototype, "EnableGGHostLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['EnableGGHostLogsRollback']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsGGHostConfigs_1.IsGGHostConfigs)(['GGHostLogsRollbackInterval']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "GGHostLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['PrivateBaseFolderPath']),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "PrivateBaseFolderPath", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['EnablePrivateLogsRollback']),
    __metadata("design:type", Boolean)
], UpdateAllGportalSettingsSysDto.prototype, "EnablePrivateLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['EnablePrivateLogsRollback']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "PrivateLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['PrivateLogsRollbackInterval']),
    __metadata("design:type", Number)
], UpdateAllGportalSettingsSysDto.prototype, "PrivateLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdateAllGportalSettingsSysDto.prototype, "GameMapBorderInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAllGportalSettingsSysDto.prototype, "GameMapImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdateAllGportalSettingsSysDto.prototype, "GameAreaRanges", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateAllGportalSettingsSysDto.prototype, "SteamAPIToken", void 0);
exports.UpdateAllGportalSettingsSysDto = UpdateAllGportalSettingsSysDto;
class UpdateGportalSettingsSysDto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGportalSettingsSysDto.prototype, "EnableGPortalLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "GPortalLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "GPortalLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGportalSettingsSysDto.prototype, "EnableNitradoLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "NitradoLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateGportalSettingsSysDto.prototype, "EnableGGHostLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "GGHostLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "GGHostLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['EnablePrivateLogsRollback']),
    __metadata("design:type", Boolean)
], UpdateGportalSettingsSysDto.prototype, "EnablePrivateLogsRollback", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['EnablePrivateLogsRollback']),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "PrivateLogsRollbackSingleTimeout", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, IsPrivateConfigs_1.IsPrivateConfigs)(['PrivateLogsRollbackInterval']),
    __metadata("design:type", Number)
], UpdateGportalSettingsSysDto.prototype, "PrivateLogsRollbackInterval", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdateGportalSettingsSysDto.prototype, "GameAreaRanges", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateGportalSettingsSysDto.prototype, "SteamAPIToken", void 0);
exports.UpdateGportalSettingsSysDto = UpdateGportalSettingsSysDto;
class UpdateScumLogSysDto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScumLogSysDto.prototype, "ScumLog", void 0);
exports.UpdateScumLogSysDto = UpdateScumLogSysDto;
//# sourceMappingURL=server-config-admin-sys.js.map