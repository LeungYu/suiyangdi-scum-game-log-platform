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
exports.ServerConfigAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const server_config_admin_sys_1 = require("../../dto/server-config-admin-sys");
const moment = require("moment");
const morgan_log_1 = require("../../common/morgan-log");
const response_builder_1 = require("../../common/response-builder");
const server_config_service_1 = require("./server-config.service");
const configs_1 = require("../../utils/configs");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const user_login_service_1 = require("../user/user-login.service");
const kill_service_1 = require("../kill/kill.service");
const admin_command_service_1 = require("../admin-command/admin-command.service");
const chat_message_service_1 = require("../chat-message/chat-message.service");
const actions_record_service_1 = require("../actions-record/actions-record.service");
const violations_record_service_1 = require("../violations-record/violations-record.service");
const economy_service_1 = require("../economy/economy.service");
const server_schedules_gportal_server_log_queue_service_1 = require("../server-schedules/server-schedules.gportal-server-log.queue.service");
const server_schedules_gghost_server_log_queue_service_1 = require("../server-schedules/server-schedules.gghost-server-log.queue.service");
const server_schedules_nitrado_server_log_queue_service_1 = require("../server-schedules/server-schedules.nitrado-server-log.queue.service");
const vuf = require('buffer').Buffer;
const axios = require('axios');
let ServerConfigAdminSysController = class ServerConfigAdminSysController {
    constructor(serverConfigService, userLoginService, killService, adminCommandService, chatMessageService, actionsRecordService, violationsRecordService, economyService) {
        this.serverConfigService = serverConfigService;
        this.userLoginService = userLoginService;
        this.killService = killService;
        this.adminCommandService = adminCommandService;
        this.chatMessageService = chatMessageService;
        this.actionsRecordService = actionsRecordService;
        this.violationsRecordService = violationsRecordService;
        this.economyService = economyService;
    }
    generateNormalRequest(method, url, headers, params, data, logger, otherConfigs, toJson) {
        const _otherConfigs = otherConfigs ? otherConfigs : {};
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield axios(Object.assign({ method,
                    url,
                    headers,
                    params,
                    data }, _otherConfigs));
                resolve(toJson ? JSON.parse(res.data.toString('utf8')) : res.data);
            }
            catch (e) {
                res = undefined;
                logger(true, `[fetch error]method: ${method} url: ${url} error:${e.toString()}`);
                reject(e);
            }
        }));
    }
    serverStatus(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const resServerIP = yield this.serverConfigService.getServerConfig({ name: 'ServerIP' });
            const resServerOnlinePlayers = yield this.serverConfigService.getServerConfig({ name: 'ServerOnlinePlayers' });
            const resBattleMetricServerDetail = yield this.serverConfigService.getServerConfig({ name: 'BattleMetricServerDetail' });
            const results = {
                ServerIP: resServerIP && resServerIP.id ? JSON.parse(resServerIP.value).value : null,
                OnlinePlayers: resServerOnlinePlayers && resServerOnlinePlayers.id ? JSON.parse(resServerOnlinePlayers.value).value : null,
                ServerDetail: resBattleMetricServerDetail && resBattleMetricServerDetail.id ? JSON.parse(resBattleMetricServerDetail.value).value : null,
            };
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, results));
        });
    }
    rankHistory(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let BattleMetricServerId = yield this.serverConfigService.getServerConfig({ name: 'BattleMetricServerId' });
                BattleMetricServerId = JSON.parse(BattleMetricServerId.value).value;
                if (BattleMetricServerId === null || BattleMetricServerId === void 0 ? void 0 : BattleMetricServerId.length) {
                    const resGenerateNormalRequest = yield this.generateNormalRequest('GET', `https://api.battlemetrics.com/servers/${BattleMetricServerId}/rank-history`, {}, {
                        start: `${moment().subtract(1, 'month').format('YYYY-MM-DD')}T00:00:00.000Z`,
                        stop: `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`,
                    }, undefined, morgan_log_1.logBussiness, {}, false);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGenerateNormalRequest));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'BattleMetric ID required'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    playerCountHistory(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let BattleMetricServerId = yield this.serverConfigService.getServerConfig({ name: 'BattleMetricServerId' });
                BattleMetricServerId = JSON.parse(BattleMetricServerId.value).value;
                if (BattleMetricServerId === null || BattleMetricServerId === void 0 ? void 0 : BattleMetricServerId.length) {
                    const resGenerateNormalRequest = yield this.generateNormalRequest('GET', `https://api.battlemetrics.com/servers/${BattleMetricServerId}/player-count-history`, {}, {
                        start: `${moment().subtract(1, 'month').format('YYYY-MM-DD')}T00:00:00.000Z`,
                        stop: `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`,
                        resolution: '30'
                    }, undefined, morgan_log_1.logBussiness, {}, false);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGenerateNormalRequest));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'BattleMetric ID required'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    gameAreaList(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
            const GameAreaRanges = resGameAreaRanges && resGameAreaRanges.id ? JSON.parse(resGameAreaRanges.value).value : {};
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, configs_1.getAreaList)(GameAreaRanges)));
        });
    }
    gameAreaData(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
            const GameAreaRanges = resGameAreaRanges && resGameAreaRanges.id ? JSON.parse(resGameAreaRanges.value).value : {};
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, configs_1.getAreaData)(GameAreaRanges)));
        });
    }
    gportalSettings(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const resBattleMetricServerId = yield this.serverConfigService.getServerConfig({ name: 'BattleMetricServerId' });
            const resServerId = yield this.serverConfigService.getServerConfig({ name: 'ServerId' });
            const resGPortalFTPUrl = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPUrl' });
            const resGPortalFTPAccount = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPAccount' });
            const resGPortalFTPPassword = yield this.serverConfigService.getServerConfig({ name: 'GPortalFTPPassword' });
            const resEnableGPortalLogsRollback = yield this.serverConfigService.getServerConfig({ name: 'EnableGPortalLogsRollback' });
            const resGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.getServerConfig({ name: 'GPortalLogsRollbackSingleTimeout' });
            const resGPortalLogsRollbackInterval = yield this.serverConfigService.getServerConfig({ name: 'GPortalLogsRollbackInterval' });
            const resGPortalServerLogAsyncRecord = yield this.serverConfigService.getServerConfig({ name: 'GPortalServerLogAsyncRecord' });
            const resNitradoAuthorizationToken = yield this.serverConfigService.getServerConfig({ name: 'NitradoAuthorizationToken' });
            const resEnableNitradoLogsRollback = yield this.serverConfigService.getServerConfig({ name: 'EnableNitradoLogsRollback' });
            const resNitradoLogsRollbackInterval = yield this.serverConfigService.getServerConfig({ name: 'NitradoLogsRollbackInterval' });
            const resNitradoServerLogAsyncRecord = yield this.serverConfigService.getServerConfig({ name: 'NitradoServerLogAsyncRecord' });
            const resGGHostServerDetail = yield this.serverConfigService.getServerConfig({ name: 'GGHostServerDetail' });
            const resGGHostFTPPath = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPPath' });
            const resGGHostFTPType = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPType' });
            const resGGHostFTPUrl = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPUrl' });
            const resGGHostFTPAccount = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPAccount' });
            const resGGHostFTPPassword = yield this.serverConfigService.getServerConfig({ name: 'GGHostFTPPassword' });
            const resEnableGGHostLogsRollback = yield this.serverConfigService.getServerConfig({ name: 'EnableGGHostLogsRollback' });
            const resGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.getServerConfig({ name: 'GGHostLogsRollbackSingleTimeout' });
            const resGGHostLogsRollbackInterval = yield this.serverConfigService.getServerConfig({ name: 'GGHostLogsRollbackInterval' });
            const resGGHostServerLogAsyncRecord = yield this.serverConfigService.getServerConfig({ name: 'GGHostServerLogAsyncRecord' });
            const resGameMapBorderInfo = yield this.serverConfigService.getServerConfig({ name: 'GameMapBorderInfo' });
            const resGameMapImageUrl = yield this.serverConfigService.getServerConfig({ name: 'GameMapImageUrl' });
            const resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
            const resSteamAPIToken = yield this.serverConfigService.getServerConfig({ name: 'SteamAPIToken' });
            const results = {
                GameServerType: resGameServerType && resGameServerType.id ? JSON.parse(resGameServerType.value).value : null,
                BattleMetricServerId: resBattleMetricServerId && resBattleMetricServerId.id ? JSON.parse(resBattleMetricServerId.value).value : null,
                ServerId: resServerId && resServerId.id ? JSON.parse(resServerId.value).value : null,
                GPortalFTPUrl: resGPortalFTPUrl && resGPortalFTPUrl.id ? JSON.parse(resGPortalFTPUrl.value).value : null,
                GPortalFTPAccount: resGPortalFTPAccount && resGPortalFTPAccount.id ? JSON.parse(resGPortalFTPAccount.value).value : null,
                GPortalFTPPassword: resGPortalFTPPassword && resGPortalFTPPassword.id ? JSON.parse(resGPortalFTPPassword.value).value : null,
                EnableGPortalLogsRollback: resEnableGPortalLogsRollback && resEnableGPortalLogsRollback.id ? JSON.parse(resEnableGPortalLogsRollback.value).value : null,
                GPortalLogsRollbackSingleTimeout: resGPortalLogsRollbackSingleTimeout && resGPortalLogsRollbackSingleTimeout.id ? JSON.parse(resGPortalLogsRollbackSingleTimeout.value).value : null,
                GPortalLogsRollbackInterval: resGPortalLogsRollbackInterval && resGPortalLogsRollbackInterval.id ? JSON.parse(resGPortalLogsRollbackInterval.value).value : null,
                GPortalServerLogAsyncRecord: resGPortalServerLogAsyncRecord && resGPortalServerLogAsyncRecord.id ? JSON.parse(resGPortalServerLogAsyncRecord.value).value : null,
                NitradoAuthorizationToken: resNitradoAuthorizationToken && resNitradoAuthorizationToken.id ? JSON.parse(resNitradoAuthorizationToken.value).value : null,
                EnableNitradoLogsRollback: resEnableNitradoLogsRollback && resEnableNitradoLogsRollback.id ? JSON.parse(resEnableNitradoLogsRollback.value).value : null,
                NitradoLogsRollbackInterval: resNitradoLogsRollbackInterval && resNitradoLogsRollbackInterval.id ? JSON.parse(resNitradoLogsRollbackInterval.value).value : null,
                NitradoServerLogAsyncRecord: resNitradoServerLogAsyncRecord && resNitradoServerLogAsyncRecord.id ? JSON.parse(resNitradoServerLogAsyncRecord.value).value : null,
                GGHostServerDetail: resGGHostServerDetail && resGGHostServerDetail.id ? JSON.parse(resGGHostServerDetail.value).value : null,
                GGHostFTPPath: resGGHostFTPPath && resGGHostFTPPath.id ? JSON.parse(resGGHostFTPPath.value).value : null,
                GGHostFTPType: resGGHostFTPType && resGGHostFTPType.id ? JSON.parse(resGGHostFTPType.value).value : null,
                GGHostFTPUrl: resGGHostFTPUrl && resGGHostFTPUrl.id ? JSON.parse(resGGHostFTPUrl.value).value : null,
                GGHostFTPAccount: resGGHostFTPAccount && resGGHostFTPAccount.id ? JSON.parse(resGGHostFTPAccount.value).value : null,
                GGHostFTPPassword: resGGHostFTPPassword && resGGHostFTPPassword.id ? JSON.parse(resGGHostFTPPassword.value).value : null,
                EnableGGHostLogsRollback: resEnableGGHostLogsRollback && resEnableGGHostLogsRollback.id ? JSON.parse(resEnableGGHostLogsRollback.value).value : null,
                GGHostLogsRollbackSingleTimeout: resGGHostLogsRollbackSingleTimeout && resGGHostLogsRollbackSingleTimeout.id ? JSON.parse(resGGHostLogsRollbackSingleTimeout.value).value : null,
                GGHostLogsRollbackInterval: resGGHostLogsRollbackInterval && resGGHostLogsRollbackInterval.id ? JSON.parse(resGGHostLogsRollbackInterval.value).value : null,
                GGHostServerLogAsyncRecord: resGGHostServerLogAsyncRecord && resGGHostServerLogAsyncRecord.id ? JSON.parse(resGGHostServerLogAsyncRecord.value).value : null,
                GameMapBorderInfo: resGameMapBorderInfo && resGameMapBorderInfo.id ? JSON.parse(resGameMapBorderInfo.value).value : null,
                GameMapImageUrl: resGameMapImageUrl && resGameMapImageUrl.id ? JSON.parse(resGameMapImageUrl.value).value : null,
                GameAreaRanges: resGameAreaRanges && resGameAreaRanges.id ? JSON.parse(resGameAreaRanges.value).value : null,
                SteamAPIToken: resSteamAPIToken && resSteamAPIToken.id ? JSON.parse(resSteamAPIToken.value).value : null,
            };
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, results));
        });
    }
    updateAllGportalSettings(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resOriginalGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const OriginalGameServerType = resOriginalGameServerType && resOriginalGameServerType.id ? JSON.parse(resOriginalGameServerType.value).value : null;
            if (OriginalGameServerType.trim() && OriginalGameServerType !== body.GameServerType) {
                yield this.userLoginService.cleanAllUserLogin();
                yield this.killService.cleanKill();
                yield this.adminCommandService.clearAdminCommand();
                yield this.chatMessageService.clearChatMessage();
                yield this.actionsRecordService.clearActionsRecord();
                yield this.violationsRecordService.clearViolationsRecord();
                yield this.economyService.clearEconomy();
                if (body.GameServerType === 'NITRADO') {
                    const resUpdateEnableGPortalLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGPortalLogsRollback', value: JSON.stringify({ value: false }) });
                    const resUpdateGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GPortalLogsRollbackSingleTimeout }) });
                    const resUpdateGPortalServerLogAsyncRecord = yield this.serverConfigService.updateServerConfig({ name: 'GPortalServerLogAsyncRecord', value: JSON.stringify({ value: { recentTimeStamp: '', result: '' } }) });
                    const resUpdateEnableGGHostLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGGHostLogsRollback', value: JSON.stringify({ value: false }) });
                    const resUpdateGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GGHostLogsRollbackSingleTimeout }) });
                    const resUpdateGGHostServerLogAsyncRecord = yield this.serverConfigService.updateServerConfig({ name: 'GGHostServerLogAsyncRecord', value: JSON.stringify({ value: { recentTimeStamp: '', result: '' } }) });
                    const resUpdateGPortalAccount = yield this.serverConfigService.updateServerConfig({ name: 'GPortalAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalPassword = yield this.serverConfigService.updateServerConfig({ name: 'GPortalPassword', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPUrl', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPPassword', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostServerDetail = yield this.serverConfigService.updateServerConfig({ name: 'GGHostServerDetail', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPPath = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPath', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPType = yield this.serverConfigService.updateServerConfig({ name: 'GGHostGGHostFTPType', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPUrl', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPassword', value: JSON.stringify({ value: '' }) });
                }
                else if (body.GameServerType === 'GPORTAL') {
                    const resUpdateEnableGGHostLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGGHostLogsRollback', value: JSON.stringify({ value: false }) });
                    const resUpdateGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GGHostLogsRollbackSingleTimeout }) });
                    const resUpdateGGHostServerLogAsyncRecord = yield this.serverConfigService.updateServerConfig({ name: 'GGHostServerLogAsyncRecord', value: JSON.stringify({ value: { recentTimeStamp: '', result: '' } }) });
                    const resUpdateEnableNitradoLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableNitradoLogsRollback', value: JSON.stringify({ value: false }) });
                    const resUpdateNitradoServerLogAsyncRecord = yield this.serverConfigService.updateServerConfig({ name: 'NitradoServerLogAsyncRecord', value: JSON.stringify({ value: { recentTimeStamp: '', result: '' } }) });
                    const resUpdateNitradoAuthorizationToken = yield this.serverConfigService.updateServerConfig({ name: 'NitradoAuthorizationToken', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostServerDetail = yield this.serverConfigService.updateServerConfig({ name: 'GGHostServerDetail', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPPath = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPath', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPType = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPType', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPUrl', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGGHostFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPassword', value: JSON.stringify({ value: '' }) });
                }
                else if (body.GameServerType === 'GGHOST') {
                    const resUpdateEnableGPortalLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGPortalLogsRollback', value: JSON.stringify({ value: false }) });
                    const resUpdateGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GPortalLogsRollbackSingleTimeout }) });
                    const resUpdateGPortalServerLogAsyncRecord = yield this.serverConfigService.updateServerConfig({ name: 'GPortalServerLogAsyncRecord', value: JSON.stringify({ value: { recentTimeStamp: '', result: '' } }) });
                    const resUpdateGPortalAccount = yield this.serverConfigService.updateServerConfig({ name: 'GPortalAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalPassword = yield this.serverConfigService.updateServerConfig({ name: 'GPortalPassword', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPUrl', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPAccount', value: JSON.stringify({ value: '' }) });
                    const resUpdateGPortalFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPPassword', value: JSON.stringify({ value: '' }) });
                    const resUpdateNitradoAuthorizationToken = yield this.serverConfigService.updateServerConfig({ name: 'NitradoAuthorizationToken', value: JSON.stringify({ value: '' }) });
                }
                const resUpdateServerIP = yield this.serverConfigService.updateServerConfig({ name: 'ServerIP', value: JSON.stringify({ value: '' }) });
                const resUpdateServerOnlinePlayers = yield this.serverConfigService.updateServerConfig({ name: 'ServerOnlinePlayers', value: JSON.stringify({ value: '0/0' }) });
            }
            else {
                const resUpdateEnableGPortalLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGPortalLogsRollback', value: JSON.stringify({ value: body.EnableGPortalLogsRollback }) });
                const resUpdateGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GPortalLogsRollbackSingleTimeout }) });
                const resUpdateEnableNitradoLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableNitradoLogsRollback', value: JSON.stringify({ value: body.EnableNitradoLogsRollback }) });
                const resUpdateEnableGGHostLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGGHostLogsRollback', value: JSON.stringify({ value: body.EnableGGHostLogsRollback }) });
                const resUpdateGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GGHostLogsRollbackSingleTimeout }) });
            }
            const resUpdateGameServerType = yield this.serverConfigService.updateServerConfig({ name: 'GameServerType', value: JSON.stringify({ value: body.GameServerType }) });
            const resUpdateServerId = yield this.serverConfigService.updateServerConfig({ name: 'ServerId', value: JSON.stringify({ value: body.ServerId }) });
            const resUpdateGPortalFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPUrl', value: JSON.stringify({ value: body.GPortalFTPUrl }) });
            const resUpdateGPortalFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPAccount', value: JSON.stringify({ value: body.GPortalFTPAccount }) });
            const resUpdateGPortalFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GPortalFTPPassword', value: JSON.stringify({ value: body.GPortalFTPPassword }) });
            const resUpdateGPortalLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackInterval', value: JSON.stringify({ value: body.GPortalLogsRollbackInterval }) });
            const resUpdateNitradoAuthorizationToken = yield this.serverConfigService.updateServerConfig({ name: 'NitradoAuthorizationToken', value: JSON.stringify({ value: body.NitradoAuthorizationToken }) });
            const resUpdateNitradoLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'NitradoLogsRollbackInterval', value: JSON.stringify({ value: body.NitradoLogsRollbackInterval }) });
            const resUpdateGGHostServerDetail = yield this.serverConfigService.updateServerConfig({ name: 'GGHostServerDetail', value: JSON.stringify({ value: body.GGHostServerDetail }) });
            const resUpdateGGHostFTPPath = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPath', value: JSON.stringify({ value: body.GGHostFTPPath }) });
            const resUpdateGGHostFTPType = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPType', value: JSON.stringify({ value: body.GGHostFTPType }) });
            const resUpdateGGHostFTPUrl = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPUrl', value: JSON.stringify({ value: body.GGHostFTPUrl }) });
            const resUpdateGGHostFTPAccount = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPAccount', value: JSON.stringify({ value: body.GGHostFTPAccount }) });
            const resUpdateGGHostFTPPassword = yield this.serverConfigService.updateServerConfig({ name: 'GGHostFTPPassword', value: JSON.stringify({ value: body.GGHostFTPPassword }) });
            const resUpdateGGHostLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackInterval', value: JSON.stringify({ value: body.GGHostLogsRollbackInterval }) });
            const resUpdateBattleMetricServerId = yield this.serverConfigService.updateServerConfig({ name: 'BattleMetricServerId', value: JSON.stringify({ value: body.BattleMetricServerId }) });
            const resUpdateGameMapBorderInfo = yield this.serverConfigService.updateServerConfig({ name: 'GameMapBorderInfo', value: JSON.stringify({ value: body.GameMapBorderInfo }) });
            const resUpdateGameMapImageUrl = yield this.serverConfigService.updateServerConfig({ name: 'GameMapImageUrl', value: JSON.stringify({ value: body.GameMapImageUrl }) });
            const resUpdateGameAreaRanges = yield this.serverConfigService.updateServerConfig({ name: 'GameAreaRanges', value: JSON.stringify({ value: body.GameAreaRanges }) });
            const resUpdateSteamAPIToken = yield this.serverConfigService.updateServerConfig({ name: 'SteamAPIToken', value: JSON.stringify({ value: body.SteamAPIToken }) });
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
        });
    }
    updateGportalSettings(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resUpdateEnableGPortalLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGPortalLogsRollback', value: JSON.stringify({ value: body.EnableGPortalLogsRollback }) });
            const resUpdateGPortalLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GPortalLogsRollbackSingleTimeout }) });
            const resUpdateGPortalLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'GPortalLogsRollbackInterval', value: JSON.stringify({ value: body.GPortalLogsRollbackInterval }) });
            const resUpdateEnableNitradoLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableNitradoLogsRollback', value: JSON.stringify({ value: body.EnableNitradoLogsRollback }) });
            const resUpdateNitradoLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'NitradoLogsRollbackInterval', value: JSON.stringify({ value: body.NitradoLogsRollbackInterval }) });
            const resUpdateEnableGGHostLogsRollback = yield this.serverConfigService.updateServerConfig({ name: 'EnableGGHostLogsRollback', value: JSON.stringify({ value: body.EnableGGHostLogsRollback }) });
            const resUpdateGGHostLogsRollbackSingleTimeout = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackSingleTimeout', value: JSON.stringify({ value: body.GGHostLogsRollbackSingleTimeout }) });
            const resUpdateGGHostLogsRollbackInterval = yield this.serverConfigService.updateServerConfig({ name: 'GGHostLogsRollbackInterval', value: JSON.stringify({ value: body.GGHostLogsRollbackInterval }) });
            const resUpdateGameAreaRanges = yield this.serverConfigService.updateServerConfig({ name: 'GameAreaRanges', value: JSON.stringify({ value: body.GameAreaRanges }) });
            const resUpdateSteamAPIToken = yield this.serverConfigService.updateServerConfig({ name: 'SteamAPIToken', value: JSON.stringify({ value: body.SteamAPIToken }) });
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
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
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'map config lost'));
            }
        });
    }
    updateScumLog(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resUpdateScumLog = yield this.serverConfigService.updateServerConfig({ name: vuf.from(configs_1.scumLog, configs_1.code).toString('utf-8'), value: JSON.stringify({ value: body.ScumLog }) });
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
        });
    }
    refreshFTPConfigs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGameServerType = yield this.serverConfigService.getServerConfig({ name: 'GameServerType' });
            const GameServerType = resGameServerType && resGameServerType.id ? JSON.parse(resGameServerType.value).value : null;
            if (GameServerType === 'GPORTAL') {
                server_schedules_gportal_server_log_queue_service_1.ServerSchedulesGportalServerLogQueueService.updateFlag = true;
            }
            else if (GameServerType === 'GGHOST') {
                server_schedules_gghost_server_log_queue_service_1.ServerSchedulesGGHostServerLogQueueService.updateFlag = true;
            }
            else if (GameServerType === 'NITRADO') {
                server_schedules_nitrado_server_log_queue_service_1.ServerSchedulesNitradoServerLogQueueService.updateFlag = true;
            }
            else {
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '还没选择服务器类型'));
            }
            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
        });
    }
};
__decorate([
    (0, common_1.Get)('/serverStatus'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "serverStatus", null);
__decorate([
    (0, common_1.Get)('/rankHistory'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "rankHistory", null);
__decorate([
    (0, common_1.Get)('/playerCountHistory'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "playerCountHistory", null);
__decorate([
    (0, common_1.Get)('/gameAreaList'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "gameAreaList", null);
__decorate([
    (0, common_1.Get)('/gameAreaData'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "gameAreaData", null);
__decorate([
    (0, common_1.Get)('/gportalSettings'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "gportalSettings", null);
__decorate([
    (0, common_1.Put)('/updateAllGportalSettings'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_config_admin_sys_1.UpdateAllGportalSettingsSysDto, Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "updateAllGportalSettings", null);
__decorate([
    (0, common_1.Put)('/updateGportalSettings'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_config_admin_sys_1.UpdateGportalSettingsSysDto, Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "updateGportalSettings", null);
__decorate([
    (0, common_1.Get)('/scumMapConfigs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "scumMapConfigs", null);
__decorate([
    (0, common_1.Put)('/updateScumLog'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [server_config_admin_sys_1.UpdateScumLogSysDto, Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "updateScumLog", null);
__decorate([
    (0, common_1.Post)('/refreshFTPConfigs'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerConfigAdminSysController.prototype, "refreshFTPConfigs", null);
ServerConfigAdminSysController = __decorate([
    (0, common_1.Controller)('/serverConfigAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService,
        user_login_service_1.UserLoginService,
        kill_service_1.KillService,
        admin_command_service_1.AdminCommandService,
        chat_message_service_1.ChatMessageService,
        actions_record_service_1.ActionsRecordService,
        violations_record_service_1.ViolationsRecordService,
        economy_service_1.EconomyService])
], ServerConfigAdminSysController);
exports.ServerConfigAdminSysController = ServerConfigAdminSysController;
//# sourceMappingURL=server-config-admin-sys.controller.js.map