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
exports.BuyAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const buy_admin_sys_1 = require("../../dto/buy-admin-sys");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const buy_service_1 = require("./buy.service");
const queue_service_1 = require("../queue/queue.service");
const configs_1 = require("../../utils/configs");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const server_config_service_1 = require("../server-config/server-config.service");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
const user_dollar_service_1 = require("../user/user-dollar.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
let BuyAdminSysController = class BuyAdminSysController {
    constructor(buyService, queueService, userDollarService, userDollarChangeService, serverConfigService) {
        this.buyService = buyService;
        this.queueService = queueService;
        this.userDollarService = userDollarService;
        this.userDollarChangeService = userDollarChangeService;
        this.serverConfigService = serverConfigService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetBuyList = yield this.buyService.getBuyListAdmin(page, {
                    id: query.id,
                    userName: query.userName,
                    userSteamId: query.userSteamId,
                    itemName: query.itemName,
                    itemType: query.itemType,
                    isPrePurchase: query.isPrePurchase,
                    status: query.status,
                    timestampStart: query.timestampStart,
                    timestampEnd: query.timestampEnd,
                    ignoreSpecialRandomPrize: query.ignoreSpecialRandomPrize,
                    specialRandomPrizeOnly: query.specialRandomPrizeOnly,
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetBuyList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    info(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetBuyList = yield this.buyService.getBuy({
                    id: query.id,
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetBuyList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateStatus(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetBuyItem = yield this.buyService.getBuy({
                    id: body.id,
                });
                if (resGetBuyItem && resGetBuyItem.id) {
                    const resUpdateBuy = yield this.buyService.updateBuy({
                        id: body.id,
                        status: body.status,
                    });
                    const resGetQueueItem = yield this.queueService.getQueueItem({
                        buyId: body.id,
                    });
                    if (resGetQueueItem && resGetQueueItem.id) {
                        const resUpdateQueue = yield this.queueService.updateQueueItem({
                            id: resGetQueueItem.id,
                            status: body.status,
                        });
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该订单'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    resendBuy(userInfo, req, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetBuy = yield this.buyService.getBuy({ id: body.id });
                if (!(resGetBuy && resGetBuy.id && resGetBuy.status !== 'refunded')) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到订单或订单已退款'));
                }
                const configs = resGetBuy.configs ? JSON.parse(resGetBuy.configs) : {};
                if (!configs.queueId) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单为旧数据或者商品不支持重发'));
                }
                const resGetQueueItem = yield this.queueService.getQueueItem({ id: configs.queueId });
                if (!(resGetQueueItem && resGetQueueItem.id)) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单所属发货历史消息不存在'));
                }
                if (resGetQueueItem.buyId.split(', ').findIndex(T => Number(T) === Number(body.id)) === -1) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单所属发货历史消息记录的订单号不符合'));
                }
                let { id, status, createdTimeStamp, updateTimeStamp } = resGetQueueItem, newQueueItem = __rest(resGetQueueItem, ["id", "status", "createdTimeStamp", "updateTimeStamp"]);
                newQueueItem.status = 'created';
                const resSaveResendQueueItem = yield this.queueService.saveQueueItem(newQueueItem.commands, newQueueItem.type, newQueueItem.status, newQueueItem.buyId);
                const resUpdateBuy = yield this.buyService.updateBuy({
                    id: resGetBuy.id,
                    updateTimeStamp: Date.now() + '',
                    configs: JSON.stringify(Object.assign(Object.assign({}, JSON.parse(resGetBuy.configs)), { queueId: resSaveResendQueueItem.id }))
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveResendQueueItem));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    refundBuy(userInfo, req, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetBuy = yield this.buyService.getBuy({ id: body.id });
                if (!(resGetBuy && resGetBuy.id && resGetBuy.status !== 'refunded')) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到订单或订单已退款'));
                }
                const configs = resGetBuy.configs ? JSON.parse(resGetBuy.configs) : {};
                if (!configs.price) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '该订单为旧数据或者商品不支持退款'));
                }
                const resGetUserDollar = yield this.userDollarService.getUserDollar(resGetBuy.userId);
                const resUpdateUserDollars = yield this.userDollarService.updateUserDollars(resGetUserDollar.id, configs.price, resGetUserDollar.level, false);
                if (configs.price > 0) {
                    const resSaveUserDollarChange = yield this.userDollarChangeService.saveUserDollarChange(resGetBuy.userId, configs.price, (0, configs_1.createUserRefundBuyDollarChangeTips)(body.id, configs.price, req.header['lang']));
                }
                const resUpdateBuy = yield this.buyService.updateBuy({
                    id: resGetBuy.id,
                    remainTimes: 0,
                    updateTimeStamp: Date.now() + '',
                    status: 'refunded',
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    cleanVehicles(userInfo, body, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resEnableEnglishQueue = yield this.serverConfigService.getServerConfig({ name: 'EnableEnglishQueue' });
                const EnableEnglishQueue = resEnableEnglishQueue && resEnableEnglishQueue.id ? JSON.parse(resEnableEnglishQueue.value).value : null;
                const commands = (0, configs_1.createCleanDidiVehiclesTips)(body.vehicleIds, EnableEnglishQueue ? undefined : 'cn');
                const resSaveQueueItem = yield this.queueService.saveQueueItem(commands, 'adminMsg', 'created');
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    delete(userInfo, res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resDeleteBuy = yield this.buyService.deleteBuy({
                    id: query.id,
                });
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    clean(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resClearBuy = yield this.buyService.clearBuy();
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        buy_admin_sys_1.ListBuySysDto, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        buy_admin_sys_1.InfoBuySysDto, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Put)('/updateStatus'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        buy_admin_sys_1.updateStatusSysDto, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('resend'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, buy_admin_sys_1.ResendBuySysDto, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "resendBuy", null);
__decorate([
    (0, common_1.Post)('refund'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, buy_admin_sys_1.RefundBuySysDto, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "refundBuy", null);
__decorate([
    (0, common_1.Delete)('/cleanVehicles'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        buy_admin_sys_1.CleanVehiclesSysDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "cleanVehicles", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, buy_admin_sys_1.DeleteBuySysDto]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/clean'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], BuyAdminSysController.prototype, "clean", null);
BuyAdminSysController = __decorate([
    (0, common_1.Controller)('/buyAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [buy_service_1.BuyService,
        queue_service_1.QueueService,
        user_dollar_service_1.UserDollarService,
        user_dollar_change_service_1.UserDollarChangeService,
        server_config_service_1.ServerConfigService])
], BuyAdminSysController);
exports.BuyAdminSysController = BuyAdminSysController;
//# sourceMappingURL=buy-admin-sys.controller.js.map