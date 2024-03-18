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
exports.EconomyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const economy_entity_1 = require("../../entity/economy.entity");
const typeorm_2 = require("typeorm");
let EconomyService = class EconomyService {
    constructor(economyRepository) {
        this.economyRepository = economyRepository;
    }
    saveEconomys(economys) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let economy of economys) {
                const element = new economy_entity_1.Economy(economy === null || economy === void 0 ? void 0 : economy.scumId, economy === null || economy === void 0 ? void 0 : economy.steamId, economy === null || economy === void 0 ? void 0 : economy.type, economy === null || economy === void 0 ? void 0 : economy.trader, economy === null || economy === void 0 ? void 0 : economy.createdTimeStamp, economy === null || economy === void 0 ? void 0 : economy.otherConfig);
                insertArray.push(element);
            }
            return yield this.economyRepository.save(insertArray);
        });
    }
    saveEconomy(scumId, steamId, type, trader, createdTimeStamp, otherConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.economyRepository.save(new economy_entity_1.Economy(scumId, steamId, type, trader, createdTimeStamp, otherConfig));
        });
    }
    getEconomyList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.economyRepository.createQueryBuilder('economy');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.scumId !== undefined) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.type !== undefined) {
                res = res.andWhere("type = :type", { type: data.type });
            }
            if (data.trader !== undefined) {
                res = res.andWhere("trader = :trader", { trader: data.trader });
            }
            if (data.createdTimeStamp !== undefined) {
                res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getEconomyListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.economyRepository.createQueryBuilder('economy');
            if (data.scumId !== undefined) {
                res = res.andWhere("economy.scumId like :scumId", { scumId: `%${data.scumId}%` });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("economy.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.type !== undefined) {
                res = res.andWhere("economy.type like :type", { type: `%${data.type}%` });
            }
            if (data.trader !== undefined) {
                res = res.andWhere("economy.trader like :trader", { trader: `%${data.trader}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("economy.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("economy.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`economy.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getEconomy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.economyRepository.createQueryBuilder('economy');
            if (data && (data.id || data.scumId !== undefined || data.steamId !== undefined || data.type !== undefined || data.trader !== undefined || data.createdTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.scumId !== undefined) {
                    res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
                }
                if (data.steamId !== undefined) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.type !== undefined) {
                    res = res.andWhere("type = :type", { type: data.type });
                }
                if (data.trader !== undefined) {
                    res = res.andWhere("trader = :trader", { trader: data.trader });
                }
                if (data.createdTimeStamp !== undefined) {
                    res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestCreatedTimeStamp = yield this.economyRepository
                .createQueryBuilder('economy')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    deleteEconomy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.economyRepository.createQueryBuilder('economy')
                .delete()
                .from(economy_entity_1.Economy);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllEconomy() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.economyRepository.createQueryBuilder('economy')
                .delete()
                .from(economy_entity_1.Economy);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from economy ORDER BY createdTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    clearEconomy() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.economyRepository
                .clear();
        });
    }
};
EconomyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(economy_entity_1.Economy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EconomyService);
exports.EconomyService = EconomyService;
//# sourceMappingURL=economy.service.js.map