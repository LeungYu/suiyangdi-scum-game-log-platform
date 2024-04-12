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
exports.BuyController = void 0;
const common_1 = require("@nestjs/common");
const buy_1 = require("../../dto/buy");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const item_service_1 = require("../item/item.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const buy_service_1 = require("./buy.service");
const queue_service_1 = require("../queue/queue.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const user_dollar_service_1 = require("../user/user-dollar.service");
const level_service_1 = require("../level/level.service");
const user_service_1 = require("../user/user.service");
const server_config_service_1 = require("../server-config/server-config.service");
const user_locations_service_1 = require("../user/user-locations.service");
const configs_1 = require("../../utils/configs");
const morgan_log_1 = require("../../common/morgan-log");
const user_login_service_1 = require("../user/user-login.service");
const squad_service_1 = require("../squad/squad.service");
const squad_user_service_1 = require("../squad/squad-user.service");
const moment = require("moment");
const eachKeyValues = {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '天',
    week: '周',
    month: '月',
    once: '永久',
};
let BuyController = class BuyController {
    constructor(buyService, queueService, itemService, userService, userLocationsService, userDollarService, userDollarChangeService, userLoginService, levelService, serverConfigService, squadService, squadUserService) {
        this.buyService = buyService;
        this.queueService = queueService;
        this.itemService = itemService;
        this.userService = userService;
        this.userLocationsService = userLocationsService;
        this.userDollarService = userDollarService;
        this.userDollarChangeService = userDollarChangeService;
        this.userLoginService = userLoginService;
        this.levelService = levelService;
        this.serverConfigService = serverConfigService;
        this.squadService = squadService;
        this.squadUserService = squadUserService;
    }
    checkIsBuying() {
        return __awaiter(this, void 0, void 0, function* () {
            const resGetBuyQueuePending = yield this.queueService.getBuyQueuePending();
            if (resGetBuyQueuePending && resGetBuyQueuePending.id) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    checkUserOnlineValid(steamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    checkUserOnlineToday(steamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currenTimeStamp = Date.now();
            const resGetUserLoginListBySteamIdList = (yield this.userLoginService.getUserLoginListBySteamId((0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 99999 }), { steamId }))[0];
            const moment = require('moment');
            const todayTimsStampStart = moment(moment().format('YYYY-MM-DD 00:00:00')).valueOf();
            const todayTimsStampEnd = moment(moment().format('YYYY-MM-DD 00:00:00')).valueOf() + 1000 * 60 * 60 * 24;
            if (resGetUserLoginListBySteamIdList && resGetUserLoginListBySteamIdList.length && resGetUserLoginListBySteamIdList.find(T => T.loginTimeStamp >= todayTimsStampStart &&
                T.loginTimeStamp < todayTimsStampEnd &&
                T.logoutTimeStamp >= todayTimsStampStart &&
                T.logoutTimeStamp < todayTimsStampEnd &&
                ((T.status === 'login' && currenTimeStamp - T.loginTimeStamp >= 1000 * 60 * 30) ||
                    (T.status === 'logout' && T.logoutTimeStamp - T.loginTimeStamp >= 1000 * 60 * 30)))) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    checkHaveBoughtThisMonth(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resGetItem = yield this.itemService.getItem({ type: 'special-login-set-everyday' });
            const resGetBuyList = (yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 1 }), { userId, itemId: resGetItem.id }))[0];
            const moment = require('moment');
            const currentTimeStamp = Date.now();
            const timeStampStart = currentTimeStamp - 1000 * 60 * 60 * 24 * 30;
            const timeStampEnd = currentTimeStamp;
            if (resGetBuyList && resGetBuyList.length && resGetBuyList.filter((T) => T.status !== 'refunded').find(T => T.createdTimeStamp >= timeStampStart &&
                T.createdTimeStamp < timeStampEnd)) {
                return resGetBuyList.find(T => T.createdTimeStamp >= timeStampStart &&
                    T.createdTimeStamp < timeStampEnd);
            }
            else {
                return null;
            }
        });
    }
    checkBuyLimitValid(itemId, itemConfigs, buyList, userLevel, sales, willBuyNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!itemConfigs.buyLimit && (sales + willBuyNumber) > itemConfigs.buyLimit) {
                return {
                    valid: false,
                    reason: 'BUY_LIMIT'
                };
            }
            if (((itemConfigs.levelLimitType === '==' && itemConfigs.levelLimit !== userLevel) || itemConfigs.levelLimit > userLevel) && !!itemConfigs.levelLimit) {
                return {
                    valid: false,
                    reason: 'LEVEL_LIMIT'
                };
            }
            let compareTotalLimit = 0;
            if (itemConfigs && itemConfigs.levelPurchaseLimit && itemConfigs.levelPurchaseLimit.length && itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel) !== undefined && itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel).totalLimit > 0) {
                compareTotalLimit = itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel).totalLimit;
            }
            else if (itemConfigs && itemConfigs.totalLimit > 0) {
                compareTotalLimit = itemConfigs.totalLimit;
            }
            if (compareTotalLimit) {
                if (buyList && buyList[0] && buyList[0].length !== undefined) {
                    const historyBuy = buyList[0].filter((T) => Number(T.itemId) === Number(itemId) && T.status !== 'refunded');
                    let sumBuyTime = 0;
                    if (historyBuy && historyBuy.length !== undefined) {
                        for (const buy of historyBuy) {
                            sumBuyTime += buy.number;
                        }
                        if (sumBuyTime + willBuyNumber > compareTotalLimit) {
                            return {
                                valid: false,
                                reason: 'MAX_TOTAL_BUY_TIME'
                            };
                        }
                    }
                }
            }
            let comparePurchaseLimit = 0;
            if (itemConfigs && itemConfigs.levelPurchaseLimit && itemConfigs.levelPurchaseLimit.length && itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel) !== undefined && itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel).purchaseLimit && typeof itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel).purchaseLimit === 'object') {
                comparePurchaseLimit = itemConfigs.levelPurchaseLimit.find(T => T.level === userLevel).purchaseLimit;
            }
            else if (itemConfigs && itemConfigs.purchaseLimit && typeof itemConfigs.purchaseLimit === 'object') {
                comparePurchaseLimit = itemConfigs.purchaseLimit;
            }
            console.log(22, comparePurchaseLimit);
            if (typeof comparePurchaseLimit === 'object') {
                if (comparePurchaseLimit.time && comparePurchaseLimit.each) {
                    if (buyList && buyList[0] && buyList[0].length !== undefined) {
                        const currentTimeStamp = Date.now();
                        const historyBuy = buyList[0].filter((T) => T.status !== 'refunded').filter((T) => {
                            if (comparePurchaseLimit.each === 'once') {
                                return Number(T.itemId) === Number(itemId);
                            }
                            if (comparePurchaseLimit.each === 'second') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000;
                            }
                            if (comparePurchaseLimit.each === 'minute') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000 * 60;
                            }
                            if (comparePurchaseLimit.each === 'hour') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000 * 60 * 60;
                            }
                            if (comparePurchaseLimit.each === 'day') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000 * 60 * 60 * 24;
                            }
                            if (comparePurchaseLimit.each === 'day_start') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp <= parseInt(moment(parseInt(T.createdTimeStamp, 10)).endOf('day').format('x'));
                            }
                            if (comparePurchaseLimit.each === 'week') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000 * 60 * 60 * 24 * 7;
                            }
                            if (comparePurchaseLimit.each === 'week_start') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp <= parseInt(moment(parseInt(T.createdTimeStamp, 10)).endOf('week').format('x'));
                            }
                            if (comparePurchaseLimit.each === 'month') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp - T.createdTimeStamp <= 1000 * 60 * 60 * 24 * 30;
                            }
                            if (comparePurchaseLimit.each === 'month_start') {
                                return Number(T.itemId) === Number(itemId) && currentTimeStamp <= parseInt(moment(parseInt(T.createdTimeStamp, 10)).endOf('month').format('x'));
                            }
                        });
                        let sumBuyTime = 0;
                        if (historyBuy && historyBuy.length !== undefined) {
                            for (const buy of historyBuy) {
                                sumBuyTime += buy.number;
                            }
                            if (sumBuyTime + willBuyNumber > comparePurchaseLimit.time) {
                                return {
                                    valid: false,
                                    reason: 'MAX_FREQUENCY_BUY_TIME'
                                };
                            }
                        }
                    }
                }
            }
            return {
                valid: true
            };
        });
    }
    listByUser(userInfo, page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    page = (0, format_page_query_1.formatPageQuery)(page);
                    const resGetBuyList = yield this.buyService.getBuyList(page, Object.assign({ userId: user.id }, query));
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetBuyList, page)));
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
    getHotZoneTeleportBuyTimesByUser(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ type: 'special-hot-point-teleport' });
                    if (resGetItem && resGetItem.id) {
                        const resBuyList = yield this.buyService.getBuyList({
                            pageNum: 0,
                            pageSize: 99999
                        }, {
                            userId: user.id,
                            itemId: resGetItem.id
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                            number: resBuyList[1],
                        }, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到商品配置，请联系服主'));
                    }
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listRandomPrizeStatusByUser(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ type: 'special-random-prize' });
                    if (resGetItem && resGetItem.id) {
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        const resEnableRandomPrizeDollarPurchase = yield this.serverConfigService.getServerConfig({
                            name: 'EnableRandomPrizeDollarPurchase'
                        });
                        const EnableRandomPrizeDollarPurchase = JSON.parse(resEnableRandomPrizeDollarPurchase.value).value;
                        const resRandomPrizePrice = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice'
                        });
                        const RandomPrizePrice = JSON.parse(resRandomPrizePrice.value).value;
                        const resRandomPrizePrice10 = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice10'
                        });
                        const RandomPrizePrice10 = JSON.parse(resRandomPrizePrice10.value).value;
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({
                            pageSize: 999999,
                            pageNum: 1
                        }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid) {
                            if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                if (!(EnableRandomPrizeDollarPurchase && !!RandomPrizePrice)) {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                                        enable: false,
                                        message: `周期内超出免费次数`,
                                        randomPrizePrice10: typeof RandomPrizePrice10 === 'number' ? RandomPrizePrice10 : RandomPrizePrice,
                                    }));
                                }
                                else {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                                        enable: true,
                                        message: `周期内超出免费次数，抽奖需要花费${RandomPrizePrice}美金`,
                                        randomPrizePrice: RandomPrizePrice,
                                        randomPrizePrice10: typeof RandomPrizePrice10 === 'number' ? RandomPrizePrice10 : RandomPrizePrice,
                                    }));
                                }
                            }
                            else {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                                    enable: true,
                                    message: `欢迎抽奖`
                                }));
                            }
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                                enable: true,
                                message: `欢迎抽奖`
                            }));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到商品配置，请联系服主'));
                    }
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listLoginSetEverydayStatusByUser(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resCheckHaveBoughtThisMonth = yield this.checkHaveBoughtThisMonth(user.id);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resCheckHaveBoughtThisMonth, ''));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listDidiVehicleIds(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetItem = yield this.itemService.getItem({ type: 'special-welcome-didi' });
                if (!(resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '滴滴车商品异常'));
                }
                const resGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageNum: 1, pageSize: 99999 }), { itemId: resGetItem.id });
                const list = resGetBuyList[0].filter(T => T.vehicleId !== null).map(T => T.vehicleId);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, { list }));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addNormal(req, userInfo, body, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if ((resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.isBlock) === true) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您购买的商品已下架'));
                    }
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type.startsWith('special-') || (configs.multiple === true && configs.multiTime > 0) || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let recentVehiclesId, serverConfigId;
                        if (resGetItem.type === 'vehicle') {
                            const resRecentVehiclesId = yield this.serverConfigService.getServerConfig({
                                name: 'RecentVehiclesId'
                            });
                            const rawRecentVehiclesId = JSON.parse(resRecentVehiclesId.value).value;
                            recentVehiclesId = rawRecentVehiclesId !== undefined ? rawRecentVehiclesId : 0;
                            serverConfigId = resRecentVehiclesId.id;
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        if (configs.specificUserLimit && configs.specificUserLimit.length && configs.specificUserLimit.find(T => T === user.id) === undefined) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您不能购买不属于自己的私人订制商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, body.number);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (resGetItem.price * body.number * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * body.number * resGetLevel.discount, resGetUserDollar.level, !resGetItem.configType || resGetItem.configType === 'command');
                        }
                        if (resGetItem.price > 0) {
                            const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * body.number * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)(resGetItem.type.endsWith('-set') ? 'set' : (resGetItem.type === 'weather-time' ? 'weather-time' : 'single'), resGetItem.name, body.number, req.header['lang']));
                        }
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, body.number);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, body.number, false, 0, recentVehiclesId === undefined ? undefined : recentVehiclesId + 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                        const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, resGetItem.type.endsWith('-set') ? 'set' : (resGetItem.type === 'weather-time' ? 'weather-time' : 'single'), user.steamId, resGetItem.commands, body.number, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof configs.isTeleport === 'boolean' ? !configs.isTeleport : false, ((_a = configs.noTeleportMode) === null || _a === void 0 ? void 0 : _a.length) ? configs.noTeleportMode : 'mode1', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: resGetItem.price * body.number * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        if (configs.totalLimit !== undefined && configs.totalLimit > 0 && (resGetItem.sales + body.number) === configs.totalLimit) {
                            const resUpdateItem = yield this.itemService.updateItem({
                                id: body.itemId,
                                type: ''
                            });
                        }
                        if (resGetItem.type === 'vehicle') {
                            const resRecentVehiclesId = yield this.serverConfigService.updateServerConfig({
                                id: serverConfigId,
                                value: JSON.stringify({ value: recentVehiclesId + 1 }),
                            });
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addMulti(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const resEnablePurchaseMultiItem = yield this.serverConfigService.getServerConfig({ name: 'EnablePurchaseMultiItem' });
                const EnablePurchaseMultiItem = JSON.parse(resEnablePurchaseMultiItem.value).value;
                if (!EnablePurchaseMultiItem) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '多商品合并购买已被禁止'));
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                    if (!checkUserOnlineResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                    }
                    const items = JSON.parse(JSON.stringify(body.items));
                    let noTeleport = true;
                    let noTeleportMode = 'mode1';
                    for (let index = 0; index < items.length; index++) {
                        if (items[index].number < 1 || items[index].number !== parseInt(items[index].number, 10)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '非法参数'));
                        }
                        const resGetItem = yield this.itemService.getItem({ id: items[index].id });
                        if ((resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.isBlock) === true) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您购买的商品已下架'));
                        }
                        items[index] = Object.assign(Object.assign({}, items[index]), resGetItem);
                        console.log(items[index]);
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        if (resGetItem && resGetItem.id) {
                            if (resGetItem.type.startsWith('special-') || (configs.multiple === true && configs.multiTime > 0) || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买套餐和特殊商品'));
                            }
                            if (configs.specificUserLimit && configs.specificUserLimit.length && configs.specificUserLimit.find(T => T === user.id) === undefined) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您不能购买不属于自己的私人订制商品'));
                            }
                            let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({
                                pageSize: 999999,
                                pageNum: 1
                            }), { userId: user.id }, true);
                            const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, items[index].number);
                            if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                                if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种限量商品库存不足'));
                                }
                                else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买其中某种商品'));
                                }
                                else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种商品已超过最大购买次数'));
                                }
                                else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种商品已超过可购买次数或触发限购'));
                                }
                            }
                            if (configs.isTeleport === true) {
                                noTeleport = false;
                            }
                            if (configs.noTeleportMode === 'mode2' || configs.noTeleportMode === 'mode3') {
                                noTeleportMode = configs.noTeleportMode;
                            }
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种商品不存在'));
                        }
                    }
                    const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                    resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                    resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                    const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                    const levelGeneralGesture = resGetLevel.generalGesture;
                    const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                    let totalPrice = 0;
                    for (const item of items) {
                        const singlePrice = (resGetLevel.discount * item.price).toFixed(2);
                        totalPrice += singlePrice * item.number;
                    }
                    if (totalPrice > resGetUserDollar.dollars) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                    }
                    if (userInfo.steamId !== '76561198435487776') {
                        const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -totalPrice, resGetUserDollar.level, true);
                    }
                    if (totalPrice > 0) {
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -totalPrice, (0, configs_1.createUserBuyDollarChangeTips)('mix-items', '多种商品', 1, req.header['lang']));
                    }
                    const buys = [];
                    for (const item of body.items) {
                        const resGetItem = yield this.itemService.getItem({ id: item.id });
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        if (configs.totalLimit !== undefined && configs.totalLimit > 0 && (resGetItem.sales + item.number) === configs.totalLimit) {
                            const resUpdateItem = yield this.itemService.updateItem({
                                id: item.id,
                                type: ''
                            });
                        }
                        const resUpdateItemSales = yield this.itemService.updateItemSales(item.id, item.number);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, item.id, item.number, false, 0, undefined);
                        buys.push(resSaveBuy);
                    }
                    const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                    const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                    const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                    const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                    const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                    const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                    const commands = (0, configs_1.createBuyMultiItemMsg)(TeleportBackLocation, user.userName, user.steamId, items, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', noTeleport, noTeleportMode, GameType);
                    const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', buys.map(T => (T.id)).join(', '), userInfo.userId);
                    for (const buy of buys) {
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: buy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: totalPrice, queueId: resSaveQueueItem.id })
                        });
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, buys, ''));
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
    addWelcomePack(req, userInfo, body, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableWelcomePackBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableWelcomePackBuy' });
                const EnableWelcomePackBuy = resEnableWelcomePackBuy && resEnableWelcomePackBuy.id ? JSON.parse(resEnableWelcomePackBuy.value).value : null;
                if (EnableWelcomePackBuy === false) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '新手礼包已被禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if (resGetItem && resGetItem.id) {
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        if (resGetItem.type !== 'special-welcomepack') {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        if (user.hasBoughtWelcomepack === true) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该用户已经领取过新手礼包'));
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        const resUpdateUser = yield this.userService.updateUser({
                            id: user.id,
                            hasBoughtWelcomepack: true,
                        });
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                        const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyWelcomePackMsg)(TeleportBackLocation, user.userName, 'set', user.steamId, resGetItem.commands, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof configs.isTeleport === 'boolean' ? !configs.isTeleport : false, ((_a = configs.noTeleportMode) === null || _a === void 0 ? void 0 : _a.length) ? configs.noTeleportMode : 'mode1', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId, true);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addPrePurchaseSet(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if (resGetItem && resGetItem.id) {
                        if ((resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.isBlock) === true) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您购买的商品已下架'));
                        }
                        if ((resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.type) === 'special-welcome-didi') {
                            const resEnableWelcomeDidiVehicleBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableWelcomeDidiVehicleBuy' });
                            const EnableWelcomeDidiVehicleBuy = resEnableWelcomeDidiVehicleBuy && resEnableWelcomeDidiVehicleBuy.id ? JSON.parse(resEnableWelcomeDidiVehicleBuy.value).value : null;
                            if (EnableWelcomeDidiVehicleBuy === false) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '新手滴滴车已被禁用'));
                            }
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        if (!(configs && configs.multiple === true && configs.multiTime > 0) || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        if (configs.specificUserLimit && configs.specificUserLimit.length && configs.specificUserLimit.find(T => T === user.id) === undefined) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您不能购买不属于自己的私人订制商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买其中某种商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种商品已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '其中某种商品已超过可购买次数或触发限购'));
                            }
                        }
                        let resGetLevel;
                        if (resGetItem.type !== 'special-welcome-didi') {
                            const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                            resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                            resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                            resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                            if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                            }
                            if (userInfo.steamId !== '76561198435487776') {
                                const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, true);
                            }
                            if (resGetItem.price > 0) {
                                const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('set', resGetItem.name, 1, req.header['lang']));
                            }
                        }
                        else {
                            const resUpdateUser = yield this.userService.updateUser({
                                id: user.id,
                                buyWelcomeDidiCarTime: 0,
                            });
                        }
                        if (configs.totalLimit !== undefined && configs.totalLimit > 0 && (resGetItem.sales + 1) === configs.totalLimit) {
                            const resUpdateItem = yield this.itemService.updateItem({
                                id: body.itemId,
                                type: ''
                            });
                        }
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1, configs.multiple, configs.multiTime, undefined, undefined, resGetLevel ? JSON.stringify({ price: resGetItem.price * resGetLevel.discount }) : undefined, resGetItem.type === 'special-welcome-didi' ? '' : undefined);
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    commitPrePurchaseSet(req, userInfo, body, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                    if (!checkUserOnlineResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法发货'));
                    }
                    const resGetBuy = yield this.buyService.getBuy({
                        id: body.id,
                    });
                    const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                    resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                    resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                    const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                    const levelGeneralGesture = resGetLevel.generalGesture;
                    const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                    if (resGetBuy && resGetBuy.id) {
                        if (resGetBuy.status === 'refunded') {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单已退款'));
                        }
                        if (resGetBuy.isPrePurchase) {
                            if (resGetBuy.remainTimes >= 1) {
                                const resGetItem = yield this.itemService.getItem({
                                    id: resGetBuy.itemId,
                                });
                                let configs;
                                if (resGetItem.configs !== null) {
                                    try {
                                        configs = JSON.parse(resGetItem.configs);
                                    }
                                    catch (e) {
                                    }
                                }
                                const currentTimeStamp = Date.now();
                                if (resGetItem.type === 'special-welcome-didi') {
                                    const resDiDiVehicleCDType = yield this.serverConfigService.getServerConfig({ name: 'DiDiVehicleCDType' });
                                    const DiDiVehicleCDType = resDiDiVehicleCDType && resDiDiVehicleCDType.id ? JSON.parse(resDiDiVehicleCDType.value).value : null;
                                    if ((DiDiVehicleCDType === '24h' && (currentTimeStamp - resGetBuy.updateTimeStamp < 1000 * 60 * 60 * 24)) || (DiDiVehicleCDType === '0am' && (currentTimeStamp < parseInt(moment(parseInt(resGetBuy.updateTimeStamp, 10)).endOf('day').format('x'))))) {
                                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, DiDiVehicleCDType === '24h' ? '24小时内只能领取一次滴滴车' : '当天已领取滴滴车，请在次日零点后再领取'));
                                    }
                                }
                                const resUpdateBuy = yield this.buyService.updateBuy({
                                    id: resGetBuy.id,
                                    remainTimes: resGetBuy.remainTimes - 1,
                                    updateTimeStamp: Date.now() + '',
                                });
                                if (resGetItem.type === 'special-welcome-didi') {
                                    const resDiDiVehicleType = yield this.serverConfigService.getServerConfig({
                                        name: 'DiDiVehicleType'
                                    });
                                    const rawDiDiVehicleType = JSON.parse(resDiDiVehicleType.value).value;
                                    resGetItem.commands = rawDiDiVehicleType !== undefined ? `#SpawnVehicle ${rawDiDiVehicleType}` : '';
                                }
                                const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                                const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                                const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                                const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                                const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'set', user.steamId, resGetItem.commands, 1, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof configs.isTeleport === 'boolean' ? !configs.isTeleport : false, ((_a = configs.noTeleportMode) === null || _a === void 0 ? void 0 : _a.length) ? configs.noTeleportMode : 'mode1');
                                const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resGetBuy.id, userInfo.userId, resGetItem.type === 'special-welcome-didi' ? true : undefined);
                                const resUpdateBuy1 = yield this.buyService.updateBuy({
                                    id: resGetBuy.id,
                                    status: 'queued',
                                    updateTimeStamp: Date.now() + '',
                                });
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetBuy, ''));
                            }
                            else {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '套餐余量不足'));
                            }
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单不是套餐'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该订单/该订单不属于你'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    commitPrePurchaseSetV2(req, userInfo, body, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                    if (!checkUserOnlineResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法发货'));
                    }
                    const resGetBuy = yield this.buyService.getBuy({
                        id: body.id,
                    });
                    const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                    resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                    resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                    const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                    const levelGeneralGesture = resGetLevel.generalGesture;
                    const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                    if (resGetBuy && resGetBuy.id) {
                        if (resGetBuy.status === 'refunded') {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单已退款'));
                        }
                        if (resGetBuy.isPrePurchase) {
                            if (resGetBuy.remainTimes >= 1) {
                                const resGetItem = yield this.itemService.getItem({
                                    id: resGetBuy.itemId,
                                });
                                if ((resGetItem === null || resGetItem === void 0 ? void 0 : resGetItem.type) === 'special-welcome-didi') {
                                    const resEnableWelcomeDidiVehicleBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableWelcomeDidiVehicleBuy' });
                                    const EnableWelcomeDidiVehicleBuy = resEnableWelcomeDidiVehicleBuy && resEnableWelcomeDidiVehicleBuy.id ? JSON.parse(resEnableWelcomeDidiVehicleBuy.value).value : null;
                                    if (EnableWelcomeDidiVehicleBuy === false) {
                                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '新手滴滴车已被禁用'));
                                    }
                                }
                                let configs;
                                if (resGetItem.configs !== null) {
                                    try {
                                        configs = JSON.parse(resGetItem.configs);
                                    }
                                    catch (e) {
                                    }
                                }
                                const currentTimeStamp = Date.now();
                                if (resGetItem.type === 'special-welcome-didi') {
                                    const resDiDiVehicleCDType = yield this.serverConfigService.getServerConfig({ name: 'DiDiVehicleCDType' });
                                    const DiDiVehicleCDType = resDiDiVehicleCDType && resDiDiVehicleCDType.id ? JSON.parse(resDiDiVehicleCDType.value).value : null;
                                    if ((DiDiVehicleCDType === '24h' && (currentTimeStamp - resGetBuy.updateTimeStamp < 1000 * 60 * 60 * 24)) || (DiDiVehicleCDType === '0am' && (currentTimeStamp < parseInt(moment(parseInt(resGetBuy.updateTimeStamp, 10)).endOf('day').format('x'))))) {
                                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, DiDiVehicleCDType === '24h' ? '24小时内只能领取一次滴滴车' : '当天已领取滴滴车，请在次日零点后再领取'));
                                    }
                                }
                                const resUpdateBuy = yield this.buyService.updateBuy({
                                    id: resGetBuy.id,
                                    remainTimes: resGetBuy.remainTimes - 1,
                                    updateTimeStamp: Date.now() + '',
                                });
                                if (resGetItem.type === 'special-welcome-didi') {
                                    const resDiDiVehicleType = yield this.serverConfigService.getServerConfig({
                                        name: 'DiDiVehicleType'
                                    });
                                    const rawDiDiVehicleType = JSON.parse(resDiDiVehicleType.value).value;
                                    resGetItem.commands = rawDiDiVehicleType !== undefined ? `#SpawnVehicle ${rawDiDiVehicleType}` : '';
                                }
                                const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                                const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                                const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                                const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                                const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                                const commands = resGetItem.type === 'special-random-prize' ? JSON.parse(resGetBuy.configs).commands : (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'set', user.steamId, resGetItem.commands, 1, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof configs.isTeleport === 'boolean' ? !configs.isTeleport : false, ((_a = configs.noTeleportMode) === null || _a === void 0 ? void 0 : _a.length) ? configs.noTeleportMode : 'mode1', GameType);
                                const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resGetBuy.id, userInfo.userId, resGetItem.type === 'special-welcome-didi' ? true : undefined);
                                const resUpdateBuy1 = yield this.buyService.updateBuy({
                                    id: resGetBuy.id,
                                    status: 'queued',
                                    updateTimeStamp: Date.now() + '',
                                });
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetBuy, ''));
                            }
                            else {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '套餐余量不足'));
                            }
                        }
                        else {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单不是套餐'));
                        }
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该订单/该订单不属于你'));
                    }
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addFames(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                if (GameType !== 'scum' && GameType !== 'thefront') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resEnableFamePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableFamePurchase' });
                const EnableFamePurchase = resEnableFamePurchase && resEnableFamePurchase.id ? JSON.parse(resEnableFamePurchase.value).value : null;
                if (EnableFamePurchase === false) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '声望兑换已被禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    let resEnableFamePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableFamePurchase' });
                    resEnableFamePurchase.value = JSON.parse(resEnableFamePurchase.value).value;
                    if (resEnableFamePurchase.value !== true) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '声望兑换功能已禁用'));
                    }
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-fames' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, body.fame);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        const resFamesPrice = yield this.serverConfigService.getServerConfig({
                            name: 'FamesPrice'
                        });
                        const rawFamesPrice = JSON.parse(resFamesPrice.value).value;
                        const famesPrice = rawFamesPrice !== undefined ? rawFamesPrice : 2;
                        if (famesPrice * body.fame * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -famesPrice * body.fame * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -famesPrice * body.fame * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('fame', resGetItem.name, body.fame, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, body.fame);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, body.fame);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const commands = (0, configs_1.createBuyFameMsg)(user.userName, 'fame', user.steamId, body.fame, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: famesPrice * body.fame * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addGameMessages(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableGameMessage = yield this.serverConfigService.getServerConfig({ name: 'EnableGameMessage' });
                const EnableGameMessage = resEnableGameMessage && resEnableGameMessage.id ? JSON.parse(resEnableGameMessage.value).value : null;
                if (EnableGameMessage === false) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '离线聊天已被禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    let resEnableGameMessage = yield this.serverConfigService.getServerConfig({ name: 'EnableGameMessage' });
                    resEnableGameMessage.value = JSON.parse(resEnableGameMessage.value).value;
                    if (resEnableGameMessage.value !== true) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '离线游戏消息功能已禁用'));
                    }
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-send-game-message' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, body.messages.split('\n').length);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        if (!(body.messages && body.messages.length) || body.messages.split('\n').find((T) => !(T && T.length) || /^[ ]*$/.test(T) || T.startsWith('#'))) {
                            const errorArray = body.messages.split('\n');
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, (body.messages && body.messages.length) ? '消息不能为空' :
                                errorArray.find((T) => !(T && T.length)) ? '每一行消息不能为空' :
                                    errorArray.find((T) => /^[ ]*$/.test(T)) ? '每一行消息不能全是空格' :
                                        errorArray.find((T) => T.startsWith('#')) ? '每一行消息不能以"#"符号开头' : ''));
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const resMessagePricePerLine = yield this.serverConfigService.getServerConfig({
                            name: 'MessagePricePerLine'
                        });
                        const rawMessagePricePerLine = JSON.parse(resMessagePricePerLine.value).value;
                        const messagePricePerLine = rawMessagePricePerLine !== undefined ? rawMessagePricePerLine : 30;
                        if (messagePricePerLine * body.messages.split('\n').length * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -messagePricePerLine * body.messages.split('\n').length * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -messagePricePerLine * body.messages.split('\n').length * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('message', resGetItem.name, body.messages.split('\n').length, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, body.messages.split('\n').length);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, body.messages.split('\n').length);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const commands = (0, configs_1.createBuySendGameMessageMsg)(user.userName, 'message', body.messages, EnableEnglishQueue ? undefined : 'cn');
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: messagePricePerLine * body.messages.split('\n').length * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addSafeZoneTeleport(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-safe-zone-teleport' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        const resSafeZoneTeleportPoint = yield this.serverConfigService.getServerConfig({
                            name: 'SafeZoneTeleportPoint'
                        });
                        const rawSafeZoneArray = Object.keys(JSON.parse(resSafeZoneTeleportPoint.value).value);
                        const safeZoneArray = rawSafeZoneArray instanceof Array ? rawSafeZoneArray : [];
                        if (safeZoneArray.find((T) => T === body.zone) === undefined) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'zone不是安全区'));
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('teleport', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        let location;
                        const resSafeZoneTeleportPointConfig = yield this.serverConfigService.getServerConfig({
                            name: 'SafeZoneTeleportPoint'
                        });
                        const rawSafeZoneTeleportPointConfig = JSON.parse(resSafeZoneTeleportPointConfig.value).value;
                        const safeZoneTeleportPointConfig = rawSafeZoneTeleportPointConfig !== undefined ? rawSafeZoneTeleportPointConfig : {};
                        if (safeZoneTeleportPointConfig && safeZoneTeleportPointConfig[body.zone] && safeZoneTeleportPointConfig[body.zone].length) {
                            const indexRandom = (0, configs_1.getRandomRange)(0, safeZoneTeleportPointConfig[body.zone].length - 1);
                            location = safeZoneTeleportPointConfig[body.zone][indexRandom];
                        }
                        else {
                            const resGameAreaRanges = yield this.serverConfigService.getServerConfig({ name: 'GameAreaRanges' });
                            const GameAreaRanges = resGameAreaRanges && resGameAreaRanges.id ? JSON.parse(resGameAreaRanges.value).value : {};
                            location = (0, configs_1.getMiddlePointsByArea)(GameAreaRanges, body.zone);
                        }
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyTeleportMsg)(user.userName, 'teleport', user.steamId, location, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: resGetItem.price * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addHotPointTeleport(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-hot-point-teleport' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        const resHotPointTeleportPoint = yield this.serverConfigService.getServerConfig({
                            name: 'HotPointTeleportPoint'
                        });
                        const rawHotPointTeleportPoint = JSON.parse(resHotPointTeleportPoint.value).value;
                        const hotPointTeleportPoint = rawHotPointTeleportPoint instanceof Array ? rawHotPointTeleportPoint : [];
                        if (hotPointTeleportPoint.find((T) => T.name === body.name) === undefined) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该坐标'));
                        }
                        resGetItem.price = hotPointTeleportPoint.find((T) => T.name === body.name).price ? hotPointTeleportPoint.find((T) => T.name === body.name).price : resGetItem.price;
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 0 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        const resBuyList = yield this.buyService.getBuyList({
                            pageNum: 1,
                            pageSize: 99999
                        }, {
                            userId: user.id,
                            itemId: resGetItem.id
                        });
                        const boughtTimes = resBuyList[1];
                        const resHotZoneTeleportFreeTimes = yield this.serverConfigService.getServerConfig({
                            name: 'HotZoneTeleportFreeTimes'
                        });
                        const HotZoneTeleportFreeTimes = JSON.parse(resHotZoneTeleportFreeTimes.value).value;
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars && !(HotZoneTeleportFreeTimes !== null && boughtTimes <= HotZoneTeleportFreeTimes)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        const realPrize = HotZoneTeleportFreeTimes !== null && boughtTimes <= HotZoneTeleportFreeTimes ? 0 : resGetItem.price * resGetLevel.discount;
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -realPrize, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -realPrize, (0, configs_1.createUserBuyDollarChangeTips)('teleport', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        let locations = hotPointTeleportPoint.find((T) => T.name === body.name).location;
                        if (typeof locations === 'string') {
                            locations = [locations, locations];
                        }
                        locations[0] = locations[0].split(' ');
                        locations[1] = locations[1].split(' ');
                        const minX = Math.min(locations[0][0], locations[1][0]);
                        const maxX = Math.max(locations[0][0], locations[1][0]);
                        const minY = Math.min(locations[0][1], locations[1][1]);
                        const maxY = Math.max(locations[0][1], locations[1][1]);
                        const minZ = Math.min(locations[0][2], locations[1][2]);
                        const maxZ = Math.max(locations[0][2], locations[1][2]);
                        const targetX = minX + (maxX - minX) * Math.random();
                        const targetY = minY + (maxY - minY) * Math.random();
                        const targetZ = minZ + (maxZ - minZ) * Math.random();
                        const location = `${targetX} ${targetY} ${targetZ}`;
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyTeleportMsg)(user.userName, 'teleport', user.steamId, location, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: realPrize, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addMapTeleport(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableMapSelectLocation = yield this.serverConfigService.getServerConfig({ name: 'EnableMapSelectLocation' });
                const EnableMapSelectLocation = resEnableMapSelectLocation && resEnableMapSelectLocation.id ? JSON.parse(resEnableMapSelectLocation.value).value : null;
                if (EnableMapSelectLocation === false) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '地图选点传送已被禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-map-teleport' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('teleport', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyTeleportMsg)(user.userName, 'teleport', user.steamId, body.location, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: resGetItem.price * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addUserLocationTeleport(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-user-location-teleport' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                                console.log('/addUserLocationTeleport/resGetItem', e);
                            }
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        const resGetUserLocations = yield this.userLocationsService.getUserLocations({
                            userId: user.id,
                            id: body.userLocationId,
                        });
                        if (!(resGetUserLocations && resGetUserLocations.id)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该私人传送坐标不存在或不是本人的坐标'));
                        }
                        let privateConfigs;
                        if (resGetUserLocations.configs !== null) {
                            try {
                                privateConfigs = JSON.parse(resGetUserLocations.configs);
                            }
                            catch (e) {
                                console.log('/addUserLocationTeleport/resGetUserLocations', e);
                            }
                        }
                        if (privateConfigs) {
                            if (privateConfigs.purchaseLimitOn && privateConfigs.each && privateConfigs.time)
                                configs.purchaseLimit = privateConfigs;
                            if (privateConfigs.price) {
                                resGetItem.price = privateConfigs.price;
                            }
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        if (privateConfigs && privateConfigs.purchaseLimitOn) {
                            resRawGetBuyList[0] = resRawGetBuyList[0].map(T => {
                                let buyConfigs;
                                try {
                                    buyConfigs = JSON.parse(T.configs);
                                }
                                catch (e) {
                                    console.log('/addUserLocationTeleport/buyConfigs', e);
                                }
                                if (buyConfigs && buyConfigs.userLocations) {
                                    if (buyConfigs.userLocations !== resGetUserLocations.id) {
                                        return false;
                                    }
                                    else {
                                        return T;
                                    }
                                }
                                else {
                                    return T;
                                }
                            }).filter(T => T !== false);
                        }
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('teleport', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1, undefined, undefined, undefined, undefined, JSON.stringify({ userLocations: resGetUserLocations.id }));
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyTeleportMsg)(user.userName, 'teleport', user.steamId, resGetUserLocations.locations, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify(Object.assign({ price: resGetItem.price * resGetLevel.discount, queueId: resSaveQueueItem.id }, JSON.parse(resSaveBuy.configs)))
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addSquadMemberTeleport(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                resGameType.value = JSON.parse(resGameType.value).value;
                if (resGameType.value !== 'thefront' && resGameType.value !== 'moe') {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '功能已禁用'));
                }
                const resEnableTeamTeleport = yield this.serverConfigService.getServerConfig({ name: 'EnableTeamTeleport' });
                const EnableTeamTeleport = resEnableTeamTeleport && resEnableTeamTeleport.id ? JSON.parse(resEnableTeamTeleport.value).value : null;
                if (EnableTeamTeleport === false) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '队友传送已被禁用'));
                }
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-team-teleport' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetToUser = yield this.userService.getUser({
                            userId: body.toUserId,
                        });
                        if (!resGetToUser || !resGetToUser.id || resGetToUser.status !== 'normal') {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '被传送人不存在或账号状态异常'));
                        }
                        const resGetUserSquad = yield this.squadUserService.getSquadUser({
                            userId: user.id,
                        });
                        const resGetToUserSquad = yield this.squadUserService.getSquadUser({
                            userId: body.toUserId,
                        });
                        if (!(resGetUserSquad && resGetUserSquad.id && resGetToUserSquad && resGetToUserSquad.id && resGetUserSquad.squadId === resGetToUserSquad.squadId)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '传送人和被传送人不在同一个队伍'));
                        }
                        const resGetSquad = yield this.squadService.getSquad({
                            id: resGetUserSquad.squadId,
                        });
                        if (resGetSquad.status !== 'normal') {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '队伍已解散'));
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('teleport', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyTeleportSquadMsg)(user.userName, 'teleport', user.steamId, resGetToUser.steamId, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: resGetItem.price * resGetLevel.discount, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addRandomPrize(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const resEnableQueuePurchase = yield this.serverConfigService.getServerConfig({ name: 'EnableQueuePurchase' });
                const EnableQueuePurchase = JSON.parse(resEnableQueuePurchase.value).value;
                if (!EnableQueuePurchase) {
                    let checkIsBuyingResult = yield this.checkIsBuying();
                    if (checkIsBuyingResult) {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '机器人正忙，请等待商品发货完成'));
                    }
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-random-prize' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        const resEnableRandomPrizeDollarPurchase = yield this.serverConfigService.getServerConfig({
                            name: 'EnableRandomPrizeDollarPurchase'
                        });
                        const EnableRandomPrizeDollarPurchase = JSON.parse(resEnableRandomPrizeDollarPurchase.value).value;
                        const resRandomPrizePrice = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice'
                        });
                        const RandomPrizePrice = JSON.parse(resRandomPrizePrice.value).value;
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                if (!(EnableRandomPrizeDollarPurchase && !!RandomPrizePrice)) {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `已经领取过了，请间隔${eachKeyValues[configs.purchaseLimit.each]}后再次领取`));
                                }
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                            if (RandomPrizePrice > resGetUserDollar.dollars) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                            }
                            if (userInfo.steamId !== '76561198435487776') {
                                const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -RandomPrizePrice, resGetUserDollar.level, true);
                            }
                            const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -RandomPrizePrice, (0, configs_1.createUserBuyDollarChangeTips)('single', resGetItem.name, 1, req.header['lang']));
                        }
                        const resStoreRandomPrizePool = yield this.serverConfigService.getServerConfig({
                            name: 'StoreRandomPrizePool'
                        });
                        const StoreRandomPrizePool = JSON.parse(resStoreRandomPrizePool.value).value;
                        if (!(StoreRandomPrizePool && StoreRandomPrizePool.length)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `没有可抽取的随机奖励，请联系服主添加`));
                        }
                        let prizeName;
                        if (StoreRandomPrizePool.find(T => T.rate === undefined || T.rate === null || T.rate < 0) !== undefined || StoreRandomPrizePool.filter(T => T.rate === 0).length === StoreRandomPrizePool.length) {
                            const randomIndex = (0, configs_1.getRandomRange)(0, StoreRandomPrizePool.length - 1);
                            resGetItem.commands = StoreRandomPrizePool[randomIndex].commands;
                            prizeName = StoreRandomPrizePool[randomIndex].prizeName;
                        }
                        else {
                            const sortStoreRandomPrizePool = StoreRandomPrizePool.sort((a, b) => { return a.rate - b.rate; });
                            let rateBase = 0;
                            for (let storeRandomPrize of sortStoreRandomPrizePool) {
                                storeRandomPrize.rateBase = rateBase + 0;
                                rateBase += storeRandomPrize.rate;
                            }
                            const randomFlag = (0, configs_1.getRandomRange)(0, 100);
                            resGetItem.commands = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).commands;
                            prizeName = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).prizeName;
                        }
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                        const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'single', user.steamId, resGetItem.commands, 1, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', GameType);
                        const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'queued',
                            updateTimeStamp: Date.now() + '',
                            configs: JSON.stringify({ price: RandomPrizePrice, queueId: resSaveQueueItem.id })
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, Object.assign(Object.assign({}, resSaveBuy), { randomItem: { prizeName } }), ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addRandomPrizeV2(req, userInfo, body, res) {
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
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-random-prize' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        const resEnableRandomPrizeDollarPurchase = yield this.serverConfigService.getServerConfig({
                            name: 'EnableRandomPrizeDollarPurchase'
                        });
                        const EnableRandomPrizeDollarPurchase = JSON.parse(resEnableRandomPrizeDollarPurchase.value).value;
                        const resRandomPrizePrice = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice'
                        });
                        const RandomPrizePrice = JSON.parse(resRandomPrizePrice.value).value;
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        console.log({ checkBuyLimitResult, EnableRandomPrizeDollarPurchase });
                        if (!checkBuyLimitResult.valid) {
                            if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                if (!(EnableRandomPrizeDollarPurchase && !!RandomPrizePrice)) {
                                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `已经领取过了，请间隔${eachKeyValues[configs.purchaseLimit.each]}后再次领取`));
                                }
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                            if (RandomPrizePrice > resGetUserDollar.dollars) {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                            }
                            if (userInfo.steamId !== '76561198435487776') {
                                const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -RandomPrizePrice, resGetUserDollar.level, true);
                            }
                            const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -RandomPrizePrice, (0, configs_1.createUserBuyDollarChangeTips)('single', resGetItem.name, 1, req.header['lang']));
                        }
                        const resStoreRandomPrizePool = yield this.serverConfigService.getServerConfig({
                            name: 'StoreRandomPrizePool'
                        });
                        const StoreRandomPrizePool = JSON.parse(resStoreRandomPrizePool.value).value;
                        if (!(StoreRandomPrizePool && StoreRandomPrizePool.length)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `没有可抽取的随机奖励，请联系服主添加`));
                        }
                        let prizeName;
                        let sendType;
                        let isTeleport;
                        let noTeleportMode;
                        let isNoPrize;
                        if (StoreRandomPrizePool.find(T => T.rate === undefined || T.rate === null || T.rate < 0) !== undefined || StoreRandomPrizePool.filter(T => T.rate === 0).length === StoreRandomPrizePool.length) {
                            const randomIndex = (0, configs_1.getRandomRange)(0, StoreRandomPrizePool.length - 1);
                            resGetItem.commands = StoreRandomPrizePool[randomIndex].commands;
                            prizeName = StoreRandomPrizePool[randomIndex].prizeName;
                            sendType = StoreRandomPrizePool[randomIndex].sendType;
                            isTeleport = StoreRandomPrizePool[randomIndex].isTeleport;
                            noTeleportMode = StoreRandomPrizePool[randomIndex].noTeleportMode;
                            isNoPrize = StoreRandomPrizePool[randomIndex].isNoPrize;
                        }
                        else {
                            const sortStoreRandomPrizePool = StoreRandomPrizePool.sort((a, b) => { return a.rate - b.rate; });
                            let rateBase = 0;
                            for (let storeRandomPrize of sortStoreRandomPrizePool) {
                                storeRandomPrize.rateBase = rateBase + 0;
                                rateBase += storeRandomPrize.rate;
                            }
                            const randomFlag = (0, configs_1.getRandomRange)(0, 100);
                            resGetItem.commands = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).commands;
                            prizeName = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).prizeName;
                            sendType = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).sendType;
                            isTeleport = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).isTeleport;
                            noTeleportMode = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).noTeleportMode;
                            isNoPrize = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).isNoPrize;
                        }
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                        const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'single', user.steamId, resGetItem.commands, 1, resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof isTeleport === 'boolean' ? !isTeleport : false, (noTeleportMode === null || noTeleportMode === void 0 ? void 0 : noTeleportMode.length) ? noTeleportMode : 'mode1', GameType);
                        const isImmediate = !sendType || sendType === 'immediate';
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1, true, isNoPrize ? 0 : (isImmediate ? 0 : 1), undefined, isNoPrize ? 'fullfilled' : undefined, JSON.stringify({ isNoPrize, sendType: sendType || undefined, prizeName, commands, isImmediate, price: RandomPrizePrice }));
                        if (isImmediate && isNoPrize !== true) {
                            const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'single', user.steamId, resGetItem.commands, 1, resGetLevel.enableLevelAnnounce !== false && resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof isTeleport === 'boolean' ? !isTeleport : false, (noTeleportMode === null || noTeleportMode === void 0 ? void 0 : noTeleportMode.length) ? noTeleportMode : 'mode1');
                            const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'buyMsg', 'created', resSaveBuy.id, userInfo.userId);
                            const resUpdateBuy = yield this.buyService.updateBuy({
                                id: resSaveBuy.id,
                                status: 'queued',
                                updateTimeStamp: Date.now() + ''
                            });
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, Object.assign(Object.assign({}, resSaveBuy), { randomItem: { isNoPrize, prizeName, sendType: sendType || undefined } }), ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addRandomPrize10V2(req, userInfo, body, res) {
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
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (resGetItem.type !== 'special-random-prize' || !(!resGetItem.configType || resGetItem.configType === 'command')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let configs;
                        if (resGetItem.configs !== null) {
                            try {
                                configs = JSON.parse(resGetItem.configs);
                            }
                            catch (e) {
                            }
                        }
                        const resRandomPrizePrice10 = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice10'
                        });
                        const RandomPrizePrice10 = JSON.parse(resRandomPrizePrice10.value).value;
                        const resRandomPrizePrice = yield this.serverConfigService.getServerConfig({
                            name: 'RandomPrizePrice'
                        });
                        const RandomPrizePrice = JSON.parse(resRandomPrizePrice.value).value;
                        const FinalRandomPrizePrice = typeof RandomPrizePrice10 === 'number' ? RandomPrizePrice10 : RandomPrizePrice;
                        let checkUserOnlineResult = yield this.checkUserOnlineValid(user.steamId);
                        if (!checkUserOnlineResult) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '您当前不在线，无法购买该商品'));
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        const levelGeneralGesture = resGetLevel.generalGesture;
                        const finalGesture = resGetLevel.enableGesture ? (typeof resGetUserDollar.gesture === 'string' && resGetUserDollar.gesture.length ? resGetUserDollar.gesture : levelGeneralGesture) : levelGeneralGesture;
                        if (FinalRandomPrizePrice * 10 > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -FinalRandomPrizePrice * 10, resGetUserDollar.level, true);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -FinalRandomPrizePrice * 10, (0, configs_1.createUserBuyDollarChangeTips)('single', resGetItem.name + '十连抽', 1, req.header['lang']));
                        const resStoreRandomPrizePool = yield this.serverConfigService.getServerConfig({
                            name: 'StoreRandomPrizePool'
                        });
                        const StoreRandomPrizePool = JSON.parse(resStoreRandomPrizePool.value).value;
                        if (!(StoreRandomPrizePool && StoreRandomPrizePool.length)) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, `没有可抽取的随机奖励，请联系服主添加`));
                        }
                        const rawResGetItem = JSON.stringify(resGetItem);
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 10);
                        const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                        const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                        const resTeleportBackLocation = yield this.serverConfigService.getServerConfig({ name: 'TeleportBackLocation' });
                        const TeleportBackLocation = resTeleportBackLocation && resTeleportBackLocation.id ? JSON.parse(resTeleportBackLocation.value).value : '0 0 200';
                        const resDatas = [];
                        const resGameType = yield this.serverConfigService.getServerConfig({ name: 'GameType' });
                        const GameType = resGameType && resGameType.id ? JSON.parse(resGameType.value).value : null;
                        for (let i = 0; i < 10; i++) {
                            const newResGetItem = JSON.parse(rawResGetItem);
                            let prizeName;
                            let sendType;
                            let isTeleport;
                            let noTeleportMode;
                            let isNoPrize;
                            if (StoreRandomPrizePool.find(T => T.rate === undefined || T.rate === null || T.rate < 0) !== undefined || StoreRandomPrizePool.filter(T => T.rate === 0).length === StoreRandomPrizePool.length) {
                                const randomIndex = (0, configs_1.getRandomRange)(0, StoreRandomPrizePool.length - 1);
                                newResGetItem.commands = StoreRandomPrizePool[randomIndex].commands;
                                prizeName = StoreRandomPrizePool[randomIndex].prizeName;
                                sendType = StoreRandomPrizePool[randomIndex].sendType;
                                isTeleport = StoreRandomPrizePool[randomIndex].isTeleport;
                                noTeleportMode = StoreRandomPrizePool[randomIndex].noTeleportMode;
                                isNoPrize = StoreRandomPrizePool[randomIndex].isNoPrize;
                            }
                            else {
                                const sortStoreRandomPrizePool = StoreRandomPrizePool.sort((a, b) => { return a.rate - b.rate; });
                                let rateBase = 0;
                                for (let storeRandomPrize of sortStoreRandomPrizePool) {
                                    storeRandomPrize.rateBase = rateBase + 0;
                                    rateBase += storeRandomPrize.rate;
                                }
                                const randomFlag = (0, configs_1.getRandomRange)(0, 100);
                                newResGetItem.commands = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).commands;
                                prizeName = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).prizeName;
                                sendType = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).sendType;
                                isTeleport = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).isTeleport;
                                noTeleportMode = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).noTeleportMode;
                                isNoPrize = sortStoreRandomPrizePool.find((T, index) => { return index === sortStoreRandomPrizePool.length - 1 ? (sortStoreRandomPrizePool[index].rateBase <= randomFlag) : (sortStoreRandomPrizePool[index].rateBase <= randomFlag && sortStoreRandomPrizePool[index + 1].rateBase > randomFlag); }).isNoPrize;
                            }
                            const commands = (0, configs_1.createBuyItemMsg)(TeleportBackLocation, user.userName, 'single', user.steamId, newResGetItem.commands, 1, resGetUserDollar.level, finalGesture, EnableEnglishQueue ? undefined : 'cn', typeof isTeleport === 'boolean' ? !isTeleport : false, (noTeleportMode === null || noTeleportMode === void 0 ? void 0 : noTeleportMode.length) ? noTeleportMode : 'mode1', GameType);
                            const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1, true, isNoPrize ? 0 : 1, undefined, isNoPrize ? 'fullfilled' : undefined, JSON.stringify({ isNoPrize, sendType: sendType || undefined, prizeName, commands, isTen: true, price: RandomPrizePrice * 10 }));
                            resDatas.push(Object.assign(Object.assign({}, resSaveBuy), { randomItem: { isNoPrize, prizeName, sendType: sendType || undefined } }));
                        }
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resDatas, ''));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    addDollarAdd(req, userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableAllBuy = yield this.serverConfigService.getServerConfig({ name: 'EnableAllBuy' });
                const EnableAllBuy = JSON.parse(resEnableAllBuy.value).value;
                if (!EnableAllBuy) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '商城已关闭购买功能，请联系服主'));
                }
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resGetItem = yield this.itemService.getItem({ id: body.itemId });
                    let configs;
                    if (resGetItem.configs !== null) {
                        try {
                            configs = JSON.parse(resGetItem.configs);
                        }
                        catch (e) {
                        }
                    }
                    if (resGetItem && resGetItem.id) {
                        if (!(resGetItem.configType && resGetItem.configType === 'dollar')) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '无法在此购买该类型的商品'));
                        }
                        let resRawGetBuyList = yield this.buyService.getBuyList((0, format_page_query_1.formatPageQuery)({ pageSize: 999999, pageNum: 1 }), { userId: user.id }, true);
                        const checkBuyLimitResult = yield this.checkBuyLimitValid(resGetItem.id, configs, resRawGetBuyList, user.userDollar.level, resGetItem.sales, 1);
                        if (!checkBuyLimitResult.valid && userInfo.steamId !== '76561198435487776') {
                            if (checkBuyLimitResult.reason === 'BUY_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '限量商品库存不足'));
                            }
                            else if (checkBuyLimitResult.reason === 'LEVEL_LIMIT') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '会员等级不足以购买该商品'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_TOTAL_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过最大购买次数'));
                            }
                            else if (checkBuyLimitResult.reason === 'MAX_FREQUENCY_BUY_TIME') {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '已超过可购买次数或触发限购'));
                            }
                        }
                        const resGetUserDollar = yield this.userDollarService.getUserDollar(user.id);
                        resGetUserDollar.level = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.level : 0;
                        resGetUserDollar.chargeDollars = resGetUserDollar.levelExpireTimeStamp === null || resGetUserDollar.levelExpireTimeStamp >= Date.now() ? resGetUserDollar.chargeDollars : 0;
                        const resGetLevel = yield this.levelService.getLevel({ level: resGetUserDollar.level });
                        if (resGetItem.price * resGetLevel.discount > resGetUserDollar.dollars) {
                            return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '余额不足'));
                        }
                        if (userInfo.steamId !== '76561198435487776') {
                            const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, -resGetItem.price * resGetLevel.discount, resGetUserDollar.level, false);
                        }
                        const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(user.id, -resGetItem.price * resGetLevel.discount, (0, configs_1.createUserBuyDollarChangeTips)('message', resGetItem.name, 1, req.header['lang']));
                        const resUpdateItemSales = yield this.itemService.updateItemSales(body.itemId, 1);
                        const resSaveBuy = yield this.buyService.saveBuy(user.id, body.itemId, 1);
                        const resUpdateUserDollarsBuy = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, configs.addDollar, resGetUserDollar.level, false);
                        const resSaveUserDollarChangeBuy = yield this.userDollarChangeService.saveUserDollarChange(user.id, configs.addDollar, (0, configs_1.createUserAddDollarBuyDollarChangeTips)(resGetItem.name, req.header['lang']));
                        const resUpdateBuy = yield this.buyService.updateBuy({
                            id: resSaveBuy.id,
                            status: 'fullfilled',
                            updateTimeStamp: Date.now() + '',
                        });
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveBuy, '已成功领取美金'));
                    }
                    else {
                        return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '没有该商品'));
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
    (0, common_1.Get)('/listByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        page_1.Page,
        buy_1.ListBuyByUserDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "listByUser", null);
__decorate([
    (0, common_1.Get)('/getHotZoneTeleportBuyTimesByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "getHotZoneTeleportBuyTimesByUser", null);
__decorate([
    (0, common_1.Get)('/listRandomPrizeStatusByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "listRandomPrizeStatusByUser", null);
__decorate([
    (0, common_1.Get)('/listLoginSetEverydayStatusByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "listLoginSetEverydayStatusByUser", null);
__decorate([
    (0, common_1.Get)('/listDidiVehicleIds'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "listDidiVehicleIds", null);
__decorate([
    (0, common_1.Post)('/addNormal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddNormalBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addNormal", null);
__decorate([
    (0, common_1.Post)('/addMulti'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddMultiBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addMulti", null);
__decorate([
    (0, common_1.Post)('/addWelcomePack'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddWelcomePackBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addWelcomePack", null);
__decorate([
    (0, common_1.Post)('/addPrePurchaseSet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddPrePurchaseSetBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addPrePurchaseSet", null);
__decorate([
    (0, common_1.Post)('/commitPrePurchaseSet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.CommitPrePurchaseSetBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "commitPrePurchaseSet", null);
__decorate([
    (0, common_1.Post)('/commitPrePurchaseSet/v2'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.CommitPrePurchaseSetBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "commitPrePurchaseSetV2", null);
__decorate([
    (0, common_1.Post)('/addFames'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddFamesBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addFames", null);
__decorate([
    (0, common_1.Post)('/addGameMessages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddMessagesBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addGameMessages", null);
__decorate([
    (0, common_1.Post)('/addSafeZoneTeleport'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddSafeZoneTeleportBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addSafeZoneTeleport", null);
__decorate([
    (0, common_1.Post)('/addHotPointTeleport'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddHotPointTeleportBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addHotPointTeleport", null);
__decorate([
    (0, common_1.Post)('/addMapTeleport'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddMapTeleportBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addMapTeleport", null);
__decorate([
    (0, common_1.Post)('/addUserLocationTeleport'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddUserLocationTeleportBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addUserLocationTeleport", null);
__decorate([
    (0, common_1.Post)('/addSquadMemberTeleport'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddSquadMemberTeleportBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addSquadMemberTeleport", null);
__decorate([
    (0, common_1.Post)('/addRandomPrize'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddRandomPrizeBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addRandomPrize", null);
__decorate([
    (0, common_1.Post)('/addRandomPrize/v2'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddRandomPrizeBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addRandomPrizeV2", null);
__decorate([
    (0, common_1.Post)('/addRandomPrize10/v2'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddRandomPrizeBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addRandomPrize10V2", null);
__decorate([
    (0, common_1.Post)('/addDollarAdd'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, user_decorator_1.SessUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_1.SessionUser,
        buy_1.AddDollarAddBuyDto, Object]),
    __metadata("design:returntype", Promise)
], BuyController.prototype, "addDollarAdd", null);
BuyController = __decorate([
    (0, common_1.Controller)('/buy'),
    __metadata("design:paramtypes", [buy_service_1.BuyService,
        queue_service_1.QueueService,
        item_service_1.ItemService,
        user_service_1.UserService,
        user_locations_service_1.UserLocationsService,
        user_dollar_service_1.UserDollarService,
        user_dollar_change_service_1.UserDollarChangeService,
        user_login_service_1.UserLoginService,
        level_service_1.LevelService,
        server_config_service_1.ServerConfigService,
        squad_service_1.SquadService,
        squad_user_service_1.SquadUserService])
], BuyController);
exports.BuyController = BuyController;
//# sourceMappingURL=buy.controller.js.map