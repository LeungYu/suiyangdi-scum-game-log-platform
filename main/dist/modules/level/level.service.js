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
exports.LevelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const level_entity_1 = require("../../entity/level.entity");
const typeorm_2 = require("typeorm");
let LevelService = class LevelService {
    constructor(levelRepository) {
        this.levelRepository = levelRepository;
    }
    saveLevel(level, chargeDollars, discount, enableGesture, generalGesture, checkInPrize, onlinePrize, minRewardOnlineTime, enableLevelAnnounce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.levelRepository.save(new level_entity_1.Level(level, chargeDollars, discount, enableGesture, generalGesture, checkInPrize, onlinePrize, minRewardOnlineTime, enableLevelAnnounce));
        });
    }
    updateLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.levelRepository
                .createQueryBuilder()
                .update(level_entity_1.Level)
                .set(level);
            res = res.andWhere('id = :id', {
                id: level.id,
            });
            return yield res.execute();
        });
    }
    getLevelList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.levelRepository.createQueryBuilder('level');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.level !== undefined) {
                res = res.andWhere("level = :level", { level: data.level });
            }
            if (data.chargeDollars !== undefined) {
                res = res.andWhere("chargeDollars = :chargeDollars", { chargeDollars: data.chargeDollars });
            }
            if (data.discount !== undefined) {
                res = res.andWhere("discount = :discount", { discount: data.discount });
            }
            if (data.enableGesture !== undefined) {
                res = res.andWhere("enableGesture = :enableGesture", { enableGesture: data.enableGesture === 'true' });
            }
            return yield res
                .orderBy(`level`, 'ASC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getLevelListByChargeDollar(chargeDollars) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.levelRepository.createQueryBuilder('level');
            res = res.andWhere("chargeDollars <= :chargeDollars", { chargeDollars });
            return yield res
                .orderBy(`chargeDollars`, 'DESC')
                .getMany();
        });
    }
    getLevel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.levelRepository.createQueryBuilder('level');
            if (data && (data.id || data.level !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.level !== undefined) {
                    res = res.andWhere("level = :level", { level: data.level });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteLevel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.levelRepository.createQueryBuilder('level')
                .delete()
                .from(level_entity_1.Level);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
};
LevelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LevelService);
exports.LevelService = LevelService;
//# sourceMappingURL=level.service.js.map