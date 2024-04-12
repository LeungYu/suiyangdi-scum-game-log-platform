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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const queue_1 = require("../../dto/queue");
const queue_service_1 = require("./queue.service");
const response_builder_1 = require("../../common/response-builder");
const format_page_query_1 = require("../../common/format-page-query");
const buy_service_1 = require("../buy/buy.service");
const morgan_log_1 = require("../../common/morgan-log");
const moment = require("moment");
const server_config_service_1 = require("../server-config/server-config.service");
const user_login_service_1 = require("../user/user-login.service");
const config_1 = require("../../config/config");
let QueueController = class QueueController {
    constructor(queueService, buyService, serverConfigService, userLoginService) {
        this.queueService = queueService;
        this.buyService = buyService;
        this.serverConfigService = serverConfigService;
        this.userLoginService = userLoginService;
    }
    nextPending(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTimeStamp = Date.now();
                const currentYYYYMMDD = moment(currentTimeStamp).format('YYYY-MM-DD');
                const resServerRestartTimeEachDay = yield this.serverConfigService.getServerConfig({ name: 'ServerRestartTimeEachDay' });
                const serverRestartTimeEachDay = resServerRestartTimeEachDay && resServerRestartTimeEachDay.id ? JSON.parse(resServerRestartTimeEachDay.value).value : null;
                const resGameServerRestartBeforeAfterProtectTime = yield this.serverConfigService.getServerConfig({ name: 'GameServerRestartBeforeAfterProtectTime' });
                const gameServerRestartBeforeAfterProtectTime = resGameServerRestartBeforeAfterProtectTime && resGameServerRestartBeforeAfterProtectTime.id ? JSON.parse(resGameServerRestartBeforeAfterProtectTime.value).value : null;
                let findTargetHHmmStatus;
                const findTargetHHmm = serverRestartTimeEachDay.find((T) => {
                    const tTimeStamp = moment(`${currentYYYYMMDD} ${T}:00`).valueOf();
                    if (tTimeStamp - currentTimeStamp >= 0 && tTimeStamp - currentTimeStamp <= 1000 * 60 * (gameServerRestartBeforeAfterProtectTime.before || 2)) {
                        findTargetHHmmStatus = -1;
                    }
                    else if (currentTimeStamp - tTimeStamp >= 0 && currentTimeStamp - tTimeStamp <= 1000 * 60 * (gameServerRestartBeforeAfterProtectTime.after || 2)) {
                        findTargetHHmmStatus = 1;
                    }
                    return findTargetHHmmStatus !== undefined;
                });
                if (findTargetHHmm !== undefined) {
                    const returnJson = {
                        action: 'restart'
                    };
                    if (findTargetHHmmStatus === -1) {
                        returnJson.before = gameServerRestartBeforeAfterProtectTime.before;
                    }
                    else if (findTargetHHmmStatus === 1) {
                        returnJson.after = gameServerRestartBeforeAfterProtectTime.after;
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, returnJson));
                }
                const resEnableVipPriority = yield this.serverConfigService.getServerConfig({ name: 'EnableVipPriority' });
                const enableVipPriority = resEnableVipPriority && resEnableVipPriority.id ? JSON.parse(resEnableVipPriority.value).value : null;
                const page = (0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 99999 });
                const resGetQueueList = yield this.queueService.getQueueList(page, { order: 'ASC', status: 'created', enableVipPriority });
                const ENABLE_MULTI_ROBOTS = config_1.Config.getConf('ENABLE_MULTI_ROBOTS');
                if (ENABLE_MULTI_ROBOTS !== undefined) {
                    if (query.filterMultiRobot && query.filterMultiRobotTotal && query.filterMultiRobotNum) {
                        resGetQueueList[0] = resGetQueueList[0].filter((T) => {
                            const createdTimeStamp = T.createdTimeStamp;
                            return createdTimeStamp % Number(query.filterMultiRobotTotal) === (Number(query.filterMultiRobotNum) === Number(query.filterMultiRobotTotal) ? 0 : Number(query.filterMultiRobotNum)) || (T.type === 'adminMsg' && T.commands === `<tab-${query.filterMultiRobotNum}>`);
                        });
                    }
                    if (query.filterDoubleSingle) {
                        resGetQueueList[0] = query.filterDoubleSingle === 'single' ?
                            resGetQueueList[0].filter((T) => {
                                const createdTimeStamp = T.createdTimeStamp;
                                return (createdTimeStamp / 2 !== parseInt(createdTimeStamp / 2 + '', 10) || (T.type === 'adminMsg' && T.commands === '<tab-1>')) && !(T.type === 'adminMsg' && T.commands === '<tab-2>');
                            }) :
                            resGetQueueList[0].filter((T) => {
                                const createdTimeStamp = T.createdTimeStamp;
                                return (createdTimeStamp / 2 === parseInt(createdTimeStamp / 2 + '', 10) || (T.type === 'adminMsg' && T.commands === '<tab-2>')) && !(T.type === 'adminMsg' && T.commands === '<tab-1>');
                            });
                    }
                    if (query.filterOnlyBuy) {
                        resGetQueueList[0] = resGetQueueList[0].filter((T) => T.type === 'buyMsg' || (T.type === 'adminMsg' && T.commands === '<tab-1>'));
                    }
                    if (query.filterNotBuy) {
                        resGetQueueList[0] = resGetQueueList[0].filter((T) => T.type !== 'buyMsg' || (T.type === 'adminMsg' && T.commands === '<tab-2>'));
                    }
                    if (query.filterOnlyBountyHunter) {
                        resGetQueueList[0] = resGetQueueList[0].filter((T) => T.type === 'bountyHunterMsg');
                    }
                    if (query.filterOnlyNormal) {
                        resGetQueueList[0] = resGetQueueList[0].filter((T) => T.type !== 'buyMsg' && T.type !== 'bountyHunterMsg');
                    }
                }
                let result;
                if (resGetQueueList && resGetQueueList[0] && resGetQueueList[0].length) {
                    if (resGetQueueList[0].find((T) => T.type === 'adminMsg' || T.type === 'buyMsg') === undefined) {
                        result = resGetQueueList[0][0];
                    }
                    else {
                        if (resGetQueueList[0].find((T) => T.type === 'adminMsg') === undefined) {
                            if (resGetQueueList[0].filter((T) => T.type === 'buyMsg' && T.commands.includes('76561198435487776')).length !== 0) {
                                result = resGetQueueList[0].filter((T) => T.type === 'buyMsg' && T.commands.includes('76561198435487776'))[0];
                            }
                            else {
                                if (resGetQueueList[0].filter((T) => T.type === 'buyMsg' && T.isNewSet === true).length !== 0) {
                                    result = resGetQueueList[0].filter((T) => T.type === 'buyMsg' && T.isNewSet === true)[0];
                                }
                                else {
                                    result = resGetQueueList[0].filter((T) => T.type === 'buyMsg')[0];
                                }
                            }
                        }
                        else {
                            result = resGetQueueList[0].filter((T) => T.type === 'adminMsg')[0];
                        }
                    }
                    const { user, userDollar } = result, otherRes = __rest(result, ["user", "userDollar"]);
                    result = Object.assign({ userLevel: !(user && user.steamId === '76561198435487776') ? (userDollar && userDollar.level || null) : 65535 }, otherRes);
                }
                else {
                    result = null;
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, result));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateQueueItem(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetQueueItem = yield this.queueService.getQueueItem({ id: body.id });
                const { vehicleId } = body, realQueue = __rest(body, ["vehicleId"]);
                const resUpdateQueueItem = yield this.queueService.updateQueueItem(Object.assign(Object.assign({}, realQueue), { updateTimeStamp: Date.now() + '' }));
                if (resGetQueueItem) {
                    if (!!resGetQueueItem.buyId) {
                        const buyIds = resGetQueueItem.buyId.split(', ');
                        for (let buyId of buyIds) {
                            const updateData = { id: buyId, status: body.status };
                            if (body.vehicleId !== undefined && (buyIds === null || buyIds === void 0 ? void 0 : buyIds.length) === 1) {
                                updateData.vehicleId = body.vehicleId;
                            }
                            const resUpdateBuy = yield this.buyService.updateBuy(updateData);
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该队列项'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/nextPending'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queue_1.nextPendingQueueItemDto, Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "nextPending", null);
__decorate([
    (0, common_1.Put)('/updateQueueItem'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queue_1.updateQueueItemDto, Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "updateQueueItem", null);
QueueController = __decorate([
    (0, common_1.Controller)('/queue'),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        buy_service_1.BuyService,
        server_config_service_1.ServerConfigService,
        user_login_service_1.UserLoginService])
], QueueController);
exports.QueueController = QueueController;
//# sourceMappingURL=queue.controller.js.map