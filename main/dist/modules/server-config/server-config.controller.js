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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfigController = void 0;
const common_1 = require("@nestjs/common");
const response_builder_1 = require("../../common/response-builder");
const server_config_service_1 = require("./server-config.service");
const moment = require("moment");
let ServerConfigController = class ServerConfigController {
    constructor(serverConfigService) {
        this.serverConfigService = serverConfigService;
    }
    serverFirstTips(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resFirstVisitAnnouncement = yield this.serverConfigService.getServerConfig({ name: 'FirstVisitAnnouncement' });
            if (resFirstVisitAnnouncement && resFirstVisitAnnouncement.id) {
                resFirstVisitAnnouncement.value = JSON.parse(resFirstVisitAnnouncement.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { FirstVisitAnnouncement: resFirstVisitAnnouncement.value }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '内部错误，请联系服主(server-first-tips)'));
            }
        });
    }
    serverStatus(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
            const GameType = JSON.parse(resGameType.value).value;
            if (GameType === 'scum') {
                let resServerIP = yield this.serverConfigService.getServerConfig({ name: 'ServerIP' });
                let resServerOnlinePlayers = yield this.serverConfigService.getServerConfig({ name: 'ServerOnlinePlayers' });
                if (resServerIP && resServerIP.id && resServerOnlinePlayers && resServerOnlinePlayers.id) {
                    resServerIP.value = JSON.parse(resServerIP.value).value;
                    resServerOnlinePlayers.value = JSON.parse(resServerOnlinePlayers.value).value;
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { ServerIP: resServerIP.value, OnlinePlayers: resServerOnlinePlayers.value }));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '服务器状态缺失，请联系服主'));
                }
            }
            else if (GameType === 'thefront') {
                let resTheFrontServerUrl = yield this.serverConfigService.getServerConfig({ name: 'TheFrontServerUrl' });
                if (resTheFrontServerUrl && resTheFrontServerUrl.id) {
                    resTheFrontServerUrl.value = JSON.parse(resTheFrontServerUrl.value).value;
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { ServerIP: resTheFrontServerUrl.value, OnlinePlayers: '0/0' }));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '服务器状态缺失，请联系服主'));
                }
            }
            else {
                let resMOEServerUrl = yield this.serverConfigService.getServerConfig({ name: 'MOEServerUrl' });
                if (resMOEServerUrl && resMOEServerUrl.id) {
                    resMOEServerUrl.value = JSON.parse(resMOEServerUrl.value).value;
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { ServerIP: resMOEServerUrl.value, OnlinePlayers: '0/0' }));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '服务器状态缺失，请联系服主'));
                }
            }
        });
    }
    serverConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
            let resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            let resGPortalServerLogAsyncRecord = yield this.serverConfigService.getServerConfig({ name: 'GPortalServerLogAsyncRecord' });
            let resNitradoServerLogAsyncRecord = yield this.serverConfigService.getServerConfig({ name: 'NitradoServerLogAsyncRecord' });
            let resServerRestartTimeEachDay = yield this.serverConfigService.getServerConfig({ name: 'ServerRestartTimeEachDay' });
            let resStoreNotification = yield this.serverConfigService.getServerConfig({ name: 'StoreNotification' });
            let resTopAnnouncement = yield this.serverConfigService.getServerConfig({ name: 'TopAnnouncement' });
            let resUserCheckInPrize = yield this.serverConfigService.getServerConfig({ name: 'UserCheckInPrize' });
            let resOnlineRewardPerMinute = yield this.serverConfigService.getServerConfig({ name: 'OnlineRewardPerMinute' });
            let resMinRewardOnlineTime = yield this.serverConfigService.getServerConfig({ name: 'MinRewardOnlineTime' });
            let resMaxOnlineReward = yield this.serverConfigService.getServerConfig({ name: 'MaxOnlineReward' });
            let resHotZoneTeleportFreeTimes = yield this.serverConfigService.getServerConfig({ name: 'HotZoneTeleportFreeTimes' });
            let resEnableWelcomePackBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableWelcomePackBuy' });
            let resEnableWelcomeDidiVehicleBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableWelcomeDidiVehicleBuy' });
            let resEnableTeamTeleport = yield this.serverConfigService.getServerConfig({ name: 'EnableTeamTeleport' });
            let resEnableMapSelectLocation = yield this.serverConfigService.getServerConfig({ name: 'EnableMapSelectLocation' });
            let resEnableFamePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableFamePurchase' });
            let resEnableGameMessage = yield this.serverConfigService.getServerConfig({ name: 'EnableGameMessage' });
            let resEnableGetPrize = yield this.serverConfigService.getServerConfig({ name: 'EnableGetPrize' });
            let resEnablePurchaseMultiItem = yield this.serverConfigService.getServerConfig({ name: 'EnablePurchaseMultiItem' });
            let resEnableTransferGameDollarToStoreDollar = yield this.serverConfigService.getServerConfig({ name: 'EnableTransferGameDollarToStoreDollar' });
            let resTransferGameDollarToStoreDollarAccountID = yield this.serverConfigService.getServerConfig({ name: 'TransferGameDollarToStoreDollarAccountID' });
            let resTransferGameDollarToStoreDollarPercent = yield this.serverConfigService.getServerConfig({ name: 'TransferGameDollarToStoreDollarPercent' });
            let resEnableRealtimeKillRecord = yield this.serverConfigService.getServerConfig({ name: 'EnableRealtimeKillRecord' });
            let resEnableShowKillMap = yield this.serverConfigService.getServerConfig({ name: 'EnableShowKillMap' });
            if (resGameType && resGameType.id &&
                resGameServerType && resGameServerType.id &&
                resGPortalServerLogAsyncRecord && resGPortalServerLogAsyncRecord.id &&
                resNitradoServerLogAsyncRecord && resNitradoServerLogAsyncRecord.id &&
                resServerRestartTimeEachDay && resServerRestartTimeEachDay.id &&
                resStoreNotification && resStoreNotification.id &&
                resTopAnnouncement && resTopAnnouncement.id &&
                resUserCheckInPrize && resUserCheckInPrize.id &&
                resOnlineRewardPerMinute && resOnlineRewardPerMinute.id &&
                resMinRewardOnlineTime && resMinRewardOnlineTime.id &&
                resMaxOnlineReward && resMaxOnlineReward.id &&
                resHotZoneTeleportFreeTimes && resHotZoneTeleportFreeTimes.id &&
                resEnableWelcomePackBuy && resEnableWelcomePackBuy.id &&
                resEnableWelcomeDidiVehicleBuy && resEnableWelcomeDidiVehicleBuy.id &&
                resEnableTeamTeleport && resEnableTeamTeleport.id &&
                resEnableMapSelectLocation && resEnableMapSelectLocation.id &&
                resEnableFamePurchase && resEnableFamePurchase.id &&
                resEnableGameMessage && resEnableGameMessage.id &&
                resEnableGetPrize && resEnableGetPrize.id &&
                resEnablePurchaseMultiItem && resEnablePurchaseMultiItem.id &&
                resEnableTransferGameDollarToStoreDollar && resEnableTransferGameDollarToStoreDollar.id &&
                resTransferGameDollarToStoreDollarAccountID && resTransferGameDollarToStoreDollarAccountID.id &&
                resTransferGameDollarToStoreDollarPercent && resTransferGameDollarToStoreDollarPercent.id &&
                resEnableRealtimeKillRecord && resEnableRealtimeKillRecord.id) {
                resGameType.value = JSON.parse(resGameType.value).value;
                resGameServerType.value = JSON.parse(resGameServerType.value).value;
                resGPortalServerLogAsyncRecord.value = JSON.parse(resGPortalServerLogAsyncRecord.value).value;
                resNitradoServerLogAsyncRecord.value = JSON.parse(resNitradoServerLogAsyncRecord.value).value;
                resServerRestartTimeEachDay.value = JSON.parse(resServerRestartTimeEachDay.value).value;
                resStoreNotification.value = JSON.parse(resStoreNotification.value).value;
                resTopAnnouncement.value = JSON.parse(resTopAnnouncement.value).value;
                resUserCheckInPrize.value = JSON.parse(resUserCheckInPrize.value).value;
                resOnlineRewardPerMinute.value = JSON.parse(resOnlineRewardPerMinute.value).value;
                resMinRewardOnlineTime.value = JSON.parse(resMinRewardOnlineTime.value).value;
                resMaxOnlineReward.value = JSON.parse(resMaxOnlineReward.value).value;
                resHotZoneTeleportFreeTimes.value = JSON.parse(resHotZoneTeleportFreeTimes.value).value;
                resEnableWelcomePackBuy.value = JSON.parse(resEnableWelcomePackBuy.value).value;
                resEnableWelcomeDidiVehicleBuy.value = JSON.parse(resEnableWelcomeDidiVehicleBuy.value).value;
                resEnableTeamTeleport.value = JSON.parse(resEnableTeamTeleport.value).value;
                resEnableMapSelectLocation.value = JSON.parse(resEnableMapSelectLocation.value).value;
                resEnableFamePurchase.value = JSON.parse(resEnableFamePurchase.value).value;
                resEnableGameMessage.value = JSON.parse(resEnableGameMessage.value).value;
                resEnableGetPrize.value = JSON.parse(resEnableGetPrize.value).value;
                resEnablePurchaseMultiItem.value = JSON.parse(resEnablePurchaseMultiItem.value).value;
                resEnableTransferGameDollarToStoreDollar.value = JSON.parse(resEnableTransferGameDollarToStoreDollar.value).value;
                resTransferGameDollarToStoreDollarAccountID.value = JSON.parse(resTransferGameDollarToStoreDollarAccountID.value).value;
                resTransferGameDollarToStoreDollarPercent.value = JSON.parse(resTransferGameDollarToStoreDollarPercent.value).value;
                resEnableRealtimeKillRecord.value = JSON.parse(resEnableRealtimeKillRecord.value).value;
                resEnableShowKillMap.value = JSON.parse(resEnableShowKillMap.value).value;
                const GPortalServerLogAsyncRecordTs = moment(resGPortalServerLogAsyncRecord.value.recentTimeStamp).format('YYYY-MM-DD HH:mm:ss');
                const GPortalServerLogAsyncRecord = resGPortalServerLogAsyncRecord.value.result.indexOf('成功') ? '成功' : resGPortalServerLogAsyncRecord.value.result.indexOf('失败') ? '失败' : '无数据';
                const NitradoServerLogAsyncRecordTs = moment(resNitradoServerLogAsyncRecord.value.recentTimeStamp).format('YYYY-MM-DD HH:mm:ss');
                const NitradoServerLogAsyncRecord = resNitradoServerLogAsyncRecord.value.result.indexOf('成功') ? '成功' : resNitradoServerLogAsyncRecord.value.result.indexOf('失败') ? '失败' : '无数据';
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    GameType: resGameType.value,
                    LogAsyncResult: {
                        recentTime: resGameServerType.value === 'GPORTAL' ? GPortalServerLogAsyncRecordTs : NitradoServerLogAsyncRecordTs,
                        result: resGameServerType.value === 'GPORTAL' ? GPortalServerLogAsyncRecord : NitradoServerLogAsyncRecord
                    },
                    ServerRestartTimeEachDay: resServerRestartTimeEachDay.value,
                    StoreNotification: resStoreNotification.value,
                    TopAnnouncement: resTopAnnouncement.value,
                    UserCheckInPrize: resUserCheckInPrize.value,
                    OnlineRewardPerMinute: resOnlineRewardPerMinute.value,
                    MinRewardOnlineTime: resMinRewardOnlineTime.value,
                    MaxOnlineReward: resMaxOnlineReward.value,
                    HotZoneTeleportFreeTimes: resHotZoneTeleportFreeTimes.value,
                    EnableWelcomePackBuy: resEnableWelcomePackBuy.value,
                    EnableWelcomeDidiVehicleBuy: resEnableWelcomeDidiVehicleBuy.value,
                    EnableTeamTeleport: resEnableTeamTeleport.value,
                    EnableMapSelectLocation: resEnableMapSelectLocation.value,
                    EnableFamePurchase: resEnableFamePurchase.value,
                    EnableGameMessage: resEnableGameMessage.value,
                    EnableGetPrize: resEnableGetPrize.value,
                    EnablePurchaseMultiItem: resEnablePurchaseMultiItem.value,
                    EnableTransferGameDollarToStoreDollar: resEnableTransferGameDollarToStoreDollar.value,
                    TransferGameDollarToStoreDollarAccountID: resTransferGameDollarToStoreDollarAccountID.value,
                    TransferGameDollarToStoreDollarPercent: resTransferGameDollarToStoreDollarPercent.value,
                    EnableRealtimeKillRecord: resEnableRealtimeKillRecord.value,
                    EnableShowKillMap: resEnableShowKillMap.value,
                }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '服务器配置缺失，请联系服主'));
            }
        });
    }
    scumMapConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGameMapBorderInfo = yield this.serverConfigService.getServerConfig({ name: 'GameMapBorderInfo' });
            let resGameMapImageUrl = yield this.serverConfigService.getServerConfig({ name: 'GameMapImageUrl' });
            if (resGameMapBorderInfo && resGameMapBorderInfo.id && resGameMapImageUrl && resGameMapImageUrl.id) {
                resGameMapBorderInfo.value = JSON.parse(resGameMapBorderInfo.value).value;
                resGameMapImageUrl.value = JSON.parse(resGameMapImageUrl.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    GameMapBorderInfo: resGameMapBorderInfo.value,
                    GameMapImageUrl: resGameMapImageUrl.value,
                }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '服务器配置缺失，请联系服主'));
            }
        });
    }
    safeZoneConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resSafeZoneTeleportPoint = yield this.serverConfigService.getServerConfig({ name: 'SafeZoneTeleportPoint' });
            if (resSafeZoneTeleportPoint && resSafeZoneTeleportPoint.id) {
                resSafeZoneTeleportPoint.value = JSON.parse(resSafeZoneTeleportPoint.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { SafeZone: Object.keys(resSafeZoneTeleportPoint.value) }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '安全区配置缺失，请联系服主'));
            }
        });
    }
    hotPointConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resHotPointTeleportPoint = yield this.serverConfigService.getServerConfig({ name: 'HotPointTeleportPoint' });
            if (resHotPointTeleportPoint && resHotPointTeleportPoint.id) {
                resHotPointTeleportPoint.value = JSON.parse(resHotPointTeleportPoint.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { hotPointTeleportPoint: resHotPointTeleportPoint.value }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '热点区域配置缺失，请联系服主'));
            }
        });
    }
    prizeConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGetPrizePrice = yield this.serverConfigService.getServerConfig({ name: 'GetPrizePrice' });
            let resGetPrizePrice10 = yield this.serverConfigService.getServerConfig({ name: 'GetPrizePrice10' });
            if (resGetPrizePrice && resGetPrizePrice.id) {
                resGetPrizePrice.value = JSON.parse(resGetPrizePrice.value).value;
                if (resGetPrizePrice10 && resGetPrizePrice10.id) {
                    resGetPrizePrice10.value = JSON.parse(resGetPrizePrice10.value).value;
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    GetPrizePrice: resGetPrizePrice.value,
                    GetPrizePrice10: resGetPrizePrice10 && resGetPrizePrice10.id ? (typeof resGetPrizePrice10.value === 'number' ? resGetPrizePrice10.value : resGetPrizePrice.value) : resGetPrizePrice.value,
                }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '抽奖配置缺失，请联系服主'));
            }
        });
    }
    randomPrizeConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resStoreRandomPrizePool = yield this.serverConfigService.getServerConfig({ name: 'StoreRandomPrizePool' });
            if (resStoreRandomPrizePool && resStoreRandomPrizePool.id) {
                resStoreRandomPrizePool.value = JSON.parse(resStoreRandomPrizePool.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { StoreRandomPrizePool: resStoreRandomPrizePool.value.map(T => {
                        return {
                            prizeName: T.prizeName,
                            imgSrc: T.imgSrc,
                        };
                    }) }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '抽奖配置缺失，请联系服主'));
            }
        });
    }
    gameMessageConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resMessagePricePerLine = yield this.serverConfigService.getServerConfig({ name: 'MessagePricePerLine' });
            if (resMessagePricePerLine && resMessagePricePerLine.id) {
                resMessagePricePerLine.value = JSON.parse(resMessagePricePerLine.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { MessagePricePerLine: resMessagePricePerLine.value }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '游戏内消息配置缺失，请联系服主'));
            }
        });
    }
    FamesConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resFamesPrice = yield this.serverConfigService.getServerConfig({ name: 'FamesPrice' });
            if (resFamesPrice && resFamesPrice.id) {
                resFamesPrice.value = JSON.parse(resFamesPrice.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { FamesPrice: resFamesPrice.value }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '兑换声望配置缺失，请联系服主'));
            }
        });
    }
    robotConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
            let resTheFrontServerUrl = yield this.serverConfigService.getServerConfig({ name: 'TheFrontServerUrl' });
            let resMOEServerUrl = yield this.serverConfigService.getServerConfig({ name: 'MOEServerUrl' });
            let resDelayAfterNormalCommand = yield this.serverConfigService.getServerConfig({ name: 'DelayAfterNormalCommand' });
            let resDelayAfterTeleportToPlayer = yield this.serverConfigService.getServerConfig({ name: 'DelayAfterTeleportToPlayer' });
            let resDelayAfterLocatePlayer = yield this.serverConfigService.getServerConfig({ name: 'DelayAfterLocatePlayer' });
            let resDelayAfterListPlayers = yield this.serverConfigService.getServerConfig({ name: 'DelayAfterListPlayers' });
            let resDelayAfterListSpawnedVehicles = yield this.serverConfigService.getServerConfig({ name: 'DelayAfterListSpawnedVehicles' });
            let resDiDiVehicleType = yield this.serverConfigService.getServerConfig({ name: 'DiDiVehicleType' });
            if (resGameType && resGameType.id &&
                resTheFrontServerUrl && resTheFrontServerUrl.id &&
                resMOEServerUrl && resMOEServerUrl.id &&
                resDelayAfterNormalCommand && resDelayAfterNormalCommand.id &&
                resDelayAfterTeleportToPlayer && resDelayAfterTeleportToPlayer.id &&
                resDelayAfterLocatePlayer && resDelayAfterLocatePlayer.id &&
                resDelayAfterListPlayers && resDelayAfterListPlayers.id &&
                resDelayAfterListSpawnedVehicles && resDelayAfterListSpawnedVehicles.id &&
                resDiDiVehicleType && resDiDiVehicleType.id) {
                resGameType.value = JSON.parse(resGameType.value).value;
                resTheFrontServerUrl.value = JSON.parse(resTheFrontServerUrl.value).value;
                resMOEServerUrl.value = JSON.parse(resMOEServerUrl.value).value;
                resDelayAfterNormalCommand.value = JSON.parse(resDelayAfterNormalCommand.value).value;
                resDelayAfterTeleportToPlayer.value = JSON.parse(resDelayAfterTeleportToPlayer.value).value;
                resDelayAfterLocatePlayer.value = JSON.parse(resDelayAfterLocatePlayer.value).value;
                resDelayAfterListPlayers.value = JSON.parse(resDelayAfterListPlayers.value).value;
                resDelayAfterListSpawnedVehicles.value = JSON.parse(resDelayAfterListSpawnedVehicles.value).value;
                resDiDiVehicleType.value = JSON.parse(resDiDiVehicleType.value).value;
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    GameType: resGameType.value,
                    TheFrontServerUrl: resTheFrontServerUrl.value,
                    MOEServerUrl: resMOEServerUrl.value,
                    DelayAfterNormalCommand: resDelayAfterNormalCommand.value,
                    DelayAfterTeleportToPlayer: resDelayAfterTeleportToPlayer.value,
                    DelayAfterLocatePlayer: resDelayAfterLocatePlayer.value,
                    DelayAfterListPlayers: resDelayAfterListPlayers.value,
                    DelayAfterListSpawnedVehicles: resDelayAfterListSpawnedVehicles.value,
                    DiDiVehicleType: resDiDiVehicleType.value,
                    EnableRobotStableMode: false
                }));
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人配置缺失，请联系服主'));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/serverFirstTips'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "serverFirstTips", null);
__decorate([
    (0, common_1.Get)('/serverStatus'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "serverStatus", null);
__decorate([
    (0, common_1.Get)('/serverConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "serverConfigs", null);
__decorate([
    (0, common_1.Get)('/scumMapConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "scumMapConfigs", null);
__decorate([
    (0, common_1.Get)('/safeZoneConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "safeZoneConfigs", null);
__decorate([
    (0, common_1.Get)('/hotPointConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "hotPointConfigs", null);
__decorate([
    (0, common_1.Get)('/prizeConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "prizeConfigs", null);
__decorate([
    (0, common_1.Get)('/randomPrizeConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "randomPrizeConfigs", null);
__decorate([
    (0, common_1.Get)('/gameMessageConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "gameMessageConfigs", null);
__decorate([
    (0, common_1.Get)('/famesConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "FamesConfigs", null);
__decorate([
    (0, common_1.Get)('/robotConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigController.prototype, "robotConfigs", null);
ServerConfigController = __decorate([
    (0, common_1.Controller)('/serverConfig'),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService])
], ServerConfigController);
exports.ServerConfigController = ServerConfigController;
//# sourceMappingURL=server-config.controller.js.map