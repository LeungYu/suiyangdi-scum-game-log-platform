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
exports.PrizeRecordController = void 0;
const common_1 = require("@nestjs/common");
const prize_record_1 = require("../../dto/prize-record");
const response_builder_1 = require("../../common/response-builder");
const prize_record_service_1 = require("./prize-record.service");
const user_decorator_1 = require("../../decorator/user.decorator");
const session_user_1 = require("../../dto/session-user");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const user_service_1 = require("../user/user.service");
const user_dollar_service_1 = require("../user/user-dollar.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const server_config_service_1 = require("../server-config/server-config.service");
const configs_1 = require("../../utils/configs");
const morgan_log_1 = require("../../common/morgan-log");
let PrizeRecordController = class PrizeRecordController {
    constructor(prizeRecordService, userService, userDollarService, userDollarChangeService, serverConfigService) {
        this.prizeRecordService = prizeRecordService;
        this.userService = userService;
        this.userDollarService = userDollarService;
        this.userDollarChangeService = userDollarChangeService;
        this.serverConfigService = serverConfigService;
    }
    listAllPrizeTypes(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, configs_1.getLuckyPrizesList)()));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listRecent(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = (0, format_page_query_1.formatPageQuery)({ pageSize: (!query.recent || query.recent >= 20) ? 20 : query.recent, pageNum: 1 });
                let resGetPrizeRecordList = yield this.prizeRecordService.getPrizeRecordList(page, {});
                resGetPrizeRecordList[0] = resGetPrizeRecordList[0].map((T) => {
                    T.userName = T.prizeUser.userName;
                    delete T.prizeUser;
                    return T;
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetPrizeRecordList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addGetPrize(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    let resEnableGetPrize = yield this.serverConfigService.getServerConfig({ name: 'EnableGetPrize' });
                    resEnableGetPrize.value = JSON.parse(resEnableGetPrize.value).value;
                    if (resEnableGetPrize.value !== true) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '美金抽奖功能已禁用'));
                    }
                    const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                    resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                    resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                    const resGetPrizePrice = yield this.serverConfigService.getServerConfig({
                        name: 'GetPrizePrice',
                    });
                    const resStoreLuckyPrizeControl = yield this.serverConfigService.getServerConfig({
                        name: 'StoreLuckyPrizeControl',
                    });
                    const rawGetPrizePrice = JSON.parse(resGetPrizePrice.value).value;
                    const getPrizePrice = rawGetPrizePrice !== undefined ? rawGetPrizePrice : 50;
                    const rawStoreLuckyPrizeControl = JSON.parse(resStoreLuckyPrizeControl.value).value;
                    const storeLuckyPrizeControl = rawStoreLuckyPrizeControl !== undefined && rawStoreLuckyPrizeControl instanceof Array ? rawStoreLuckyPrizeControl : [0, 1];
                    if (resGetUserDollar.dollars >= getPrizePrice) {
                        const luckyPrizesResult = (0, configs_1.getLuckyPrizesResult)(storeLuckyPrizeControl);
                        const resUpdateUserDollarsPrizePrice = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -getPrizePrice, resGetUserDollar.level, true);
                        const resUpdateUserDollarChangePrizePrice = yield this.userDollarChangeService.saveUserDollarChange(user.id, -getPrizePrice, `抽奖支出`);
                        if (luckyPrizesResult.dollars) {
                            const resUpdateUserDollarsLuckyPrizes = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, luckyPrizesResult.dollars);
                            const resUpdateUserDollarChangeLuckyPrizes = yield this.userDollarChangeService.saveUserDollarChange(user.id, luckyPrizesResult.dollars, `抽奖获奖[${luckyPrizesResult.description}]`);
                            const resSavePrizeRecord = yield this.prizeRecordService.savePrizeRecord(user.id, luckyPrizesResult.id, luckyPrizesResult.dollars);
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, luckyPrizesResult));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '美金余额不足'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addGetPrize10(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    let resEnableGetPrize = yield this.serverConfigService.getServerConfig({ name: 'EnableGetPrize' });
                    resEnableGetPrize.value = JSON.parse(resEnableGetPrize.value).value;
                    if (resEnableGetPrize.value !== true) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '美金抽奖功能已禁用'));
                    }
                    const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                    resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                    resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                    const resGetPrizePrice = yield this.serverConfigService.getServerConfig({
                        name: 'GetPrizePrice',
                    });
                    const resGetPrizePrice10 = yield this.serverConfigService.getServerConfig({
                        name: 'GetPrizePrice10',
                    });
                    const resStoreLuckyPrizeControl = yield this.serverConfigService.getServerConfig({
                        name: 'StoreLuckyPrizeControl',
                    });
                    const rawGetPrizePrice = JSON.parse(resGetPrizePrice.value).value;
                    const rawGetPrizePrice10 = JSON.parse(resGetPrizePrice10.value).value;
                    const getPrizePrice = rawGetPrizePrice !== undefined ? rawGetPrizePrice : 50;
                    const getPrizePrice10 = rawGetPrizePrice10 !== undefined ? rawGetPrizePrice10 : getPrizePrice;
                    const rawStoreLuckyPrizeControl = JSON.parse(resStoreLuckyPrizeControl.value).value;
                    const storeLuckyPrizeControl = rawStoreLuckyPrizeControl !== undefined && rawStoreLuckyPrizeControl instanceof Array ? rawStoreLuckyPrizeControl : [0, 1];
                    if (resGetUserDollar.dollars >= getPrizePrice10 * 10) {
                        const luckyPrizesResults = [];
                        for (let i = 0; i < 10; i++) {
                            luckyPrizesResults.push((0, configs_1.getLuckyPrizesResult)(storeLuckyPrizeControl));
                        }
                        let luckyPrizesResultSum = 0;
                        for (let luckyPrizesResult of luckyPrizesResults) {
                            luckyPrizesResultSum += luckyPrizesResult.dollars;
                        }
                        const resUpdateUserDollarsPrizePrice = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -getPrizePrice10 * 10, resGetUserDollar.level, true);
                        const resUpdateUserDollarChangePrizePrice = yield this.userDollarChangeService.saveUserDollarChange(user.id, -getPrizePrice10 * 10, `抽奖支出(十连抽)`);
                        if (luckyPrizesResultSum) {
                            const resUpdateUserDollarsLuckyPrizes = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, luckyPrizesResultSum);
                            const resUpdateUserDollarChangeLuckyPrizes = yield this.userDollarChangeService.saveUserDollarChange(user.id, luckyPrizesResultSum, `抽奖获奖(十连抽)`);
                            for (let luckyPrizesResult of luckyPrizesResults) {
                                if (luckyPrizesResult.dollars) {
                                    const resSavePrizeRecord = yield this.prizeRecordService.savePrizeRecord(user.id, luckyPrizesResult.id, luckyPrizesResult.dollars);
                                }
                            }
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, luckyPrizesResults));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '美金余额不足'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
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
    (0, common_1.Get)('/listAllPrizeTypes'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], PrizeRecordController.prototype, "listAllPrizeTypes", null);
__decorate([
    (0, common_1.Get)('/listRecent'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prize_record_1.RecentPrizeRecordListDto, Object]),
    __metadata("design:returntype", Promise)
], PrizeRecordController.prototype, "listRecent", null);
__decorate([
    (0, common_1.Post)('/addGetPrize'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        prize_record_1.AddGetPrizeDto, Object]),
    __metadata("design:returntype", Promise)
], PrizeRecordController.prototype, "addGetPrize", null);
__decorate([
    (0, common_1.Post)('/addGetPrize10'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        prize_record_1.AddGetPrizeDto, Object]),
    __metadata("design:returntype", Promise)
], PrizeRecordController.prototype, "addGetPrize10", null);
PrizeRecordController = __decorate([
    (0, common_1.Controller)('/prizeRecord'),
    __metadata("design:paramtypes", [prize_record_service_1.PrizeRecordService,
        user_service_1.UserService,
        user_dollar_service_1.UserDollarService,
        user_dollar_change_service_1.UserDollarChangeService,
        server_config_service_1.ServerConfigService])
], PrizeRecordController);
exports.PrizeRecordController = PrizeRecordController;
//# sourceMappingURL=prize-record.controller.js.map