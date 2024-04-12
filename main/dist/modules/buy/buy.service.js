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
exports.BuyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const buy_entity_1 = require("../../entity/buy.entity");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("../../entity/item.entity");
const user_entity_1 = require("../../entity/user.entity");
const item_types_entity_1 = require("../../entity/item-types.entity");
const morgan_log_1 = require("../../common/morgan-log");
const moment = require('moment');
let BuyService = class BuyService {
    constructor(buyRepository) {
        this.buyRepository = buyRepository;
    }
    saveBuys(buys) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let buy of buys) {
                const element = new buy_entity_1.Buy(buy === null || buy === void 0 ? void 0 : buy.userId, buy === null || buy === void 0 ? void 0 : buy.itemId, buy === null || buy === void 0 ? void 0 : buy.number, buy === null || buy === void 0 ? void 0 : buy.isPrePurchase, buy === null || buy === void 0 ? void 0 : buy.remainTimes, buy === null || buy === void 0 ? void 0 : buy.vehicleId, buy === null || buy === void 0 ? void 0 : buy.status, buy === null || buy === void 0 ? void 0 : buy.configs, buy === null || buy === void 0 ? void 0 : buy.updateTimeStamp);
                insertArray.push(element);
            }
            return yield this.buyRepository.save(insertArray);
        });
    }
    saveBuy(userId, itemId, number, isPrePurchase, remainTimes, vehicleId, status, configs, updateTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buyRepository.save(new buy_entity_1.Buy(userId, itemId, number, isPrePurchase, remainTimes, vehicleId, status, configs, updateTimeStamp));
        });
    }
    updateBuy(buy) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(false, moment().format('YYYY-MM-DD HH:mm:ss') + '监控updateBuy' + JSON.stringify(buy));
            let res = this.buyRepository
                .createQueryBuilder()
                .update(buy_entity_1.Buy)
                .set(buy);
            res = res.andWhere('id = :id', {
                id: buy.id,
            });
            return yield res.execute();
        });
    }
    getBuyList(page, data, needLock) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.buyRepository.createQueryBuilder('buy');
            res = res.leftJoinAndMapOne('buy.buyItem', item_entity_1.Item, "buyItem", "buy.itemId = buyItem.id");
            res = res.leftJoinAndMapOne('buy.buyItemType', item_types_entity_1.ItemTypes, "buyItemType", "buyItem.type = buyItemType.name");
            if (data.id) {
                res = res.andWhere("buy.id = :id", { id: data.id });
            }
            if (data.userId) {
                res = res.andWhere("buy.userId = :userId", { userId: data.userId });
            }
            if (data.itemType) {
                res = res.andWhere("buyItemType.name = :itemType", { itemType: data.itemType });
            }
            if (data.itemId) {
                res = res.andWhere("buy.itemId = :itemId", { itemId: data.itemId });
            }
            if (data.number !== undefined) {
                res = res.andWhere("buy.number = :number", { number: data.number });
            }
            if (data.isPrePurchase !== undefined) {
                res = res.andWhere("buy.isPrePurchase = :isPrePurchase", { isPrePurchase: data.isPrePurchase === 'true' });
            }
            if (data.remainTimes !== undefined) {
                res = res.andWhere("buy.remainTimes = :remainTimes", { remainTimes: data.remainTimes });
            }
            if (data.vehicleId !== undefined) {
                res = res.andWhere("buy.vehicleId = :vehicleId", { vehicleId: data.vehicleId });
            }
            if (data.status) {
                res = res.andWhere("buy.status = :status", { status: data.status });
            }
            if (data.ignoreSpecialRandomPrize) {
                res = res.andWhere("buyItemType.name != :name", { name: 'special-random-prize' });
            }
            if (data.specialRandomPrizeOnly) {
                res = res.andWhere("buyItemType.name = :name", { name: 'special-random-prize' });
            }
            if (needLock === true) {
                res = res.setLock('pessimistic_write').useTransaction(true);
            }
            return yield res
                .orderBy(`buy.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getBuyListAdmin(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.buyRepository.createQueryBuilder('buy');
            res = res.leftJoinAndMapOne('buy.buyItem', item_entity_1.Item, "buyItem", "buy.itemId = buyItem.id");
            res = res.leftJoinAndMapOne('buy.buyItemType', item_types_entity_1.ItemTypes, "buyItemType", "buyItem.type = buyItemType.name");
            res = res.leftJoinAndMapOne('buy.buyUser', user_entity_1.User, "buyUser", "buy.userId = buyUser.id");
            if (data.id) {
                res = res.andWhere("buy.id like :id", { id: `%${data.id}%` });
            }
            if (data.userName) {
                res = res.andWhere("buyUser.userName like :userName", { userName: `%${data.userName}%` });
            }
            if (data.userSteamId) {
                res = res.andWhere("buyUser.steamId like :steamId", { steamId: `%${data.userSteamId}%` });
            }
            if (data.itemName) {
                res = res.andWhere("buyItem.name like :name", { name: `%${data.itemName}%` });
            }
            if (data.itemType) {
                res = res.andWhere("buyItem.type = :type", { type: data.itemType });
            }
            if (data.isPrePurchase !== undefined) {
                res = res.andWhere("buy.isPrePurchase = :isPrePurchase", { isPrePurchase: data.isPrePurchase === 'true' });
            }
            if (data.status) {
                res = res.andWhere("buy.status = :status", { status: data.status });
            }
            if (data.ignoreSpecialRandomPrize) {
                res = res.andWhere("buyItemType.name != :name", { name: 'special-random-prize' });
            }
            if (data.specialRandomPrizeOnly) {
                res = res.andWhere("buyItemType.name = :name", { name: 'special-random-prize' });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("buy.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("buy.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`buy.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getBuy(data, needLock) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.buyRepository.createQueryBuilder('buy');
            if (data && (data.id || data.userId || data.itemId || data.number || data.isPrePurchase || data.remainTimes || data.status)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.userId) {
                    res = res.andWhere("userId = :userId", { userId: data.userId });
                }
                if (data.itemId) {
                    res = res.andWhere("itemId = :itemId", { itemId: data.itemId });
                }
                if (data.number) {
                    res = res.andWhere("number = :number", { number: data.number });
                }
                if (data.isPrePurchase !== undefined) {
                    res = res.andWhere("isPrePurchase = :isPrePurchase", { isPrePurchase: data.isPrePurchase === 'true' });
                }
                if (data.remainTimes !== undefined) {
                    res = res.andWhere("remainTimes = :remainTimes", { remainTimes: data.remainTimes });
                }
                if (data.vehicleId !== undefined) {
                    res = res.andWhere("vehicleId = :vehicleId", { vehicleId: data.vehicleId });
                }
                if (data.status) {
                    res = res.andWhere("status = :status", { status: data.status });
                }
                if (needLock === true) {
                    res = res.setLock('pessimistic_write').useTransaction(true);
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteBuy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(false, moment().format('YYYY-MM-DD HH:mm:ss') + '监控deleteBuy' + JSON.stringify(data));
            let res = yield this.buyRepository.createQueryBuilder('buy')
                .delete()
                .from(buy_entity_1.Buy);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.itemId) {
                res = res.andWhere("itemId = :itemId", { itemId: data.itemId });
            }
            return yield res
                .execute();
        });
    }
    clearBuy() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(false, moment().format('YYYY-MM-DD HH:mm:ss') + '监控clearBuy');
            return yield this.buyRepository.clear();
        });
    }
};
BuyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(buy_entity_1.Buy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BuyService);
exports.BuyService = BuyService;
//# sourceMappingURL=buy.service.js.map