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
exports.UserDollarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entity/user.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const level_service_1 = require("../level/level.service");
let UserDollarService = class UserDollarService {
    constructor(serverConfigService, userDollarRepository, levelService) {
        this.serverConfigService = serverConfigService;
        this.userDollarRepository = userDollarRepository;
        this.levelService = levelService;
    }
    saveUserDollar(userId, dollars, chargeDollars, level, gesture) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDollarRepository.save(new user_dollar_entity_1.UserDollar(userId, dollars, chargeDollars, level, gesture));
        });
    }
    updateUserDollar(userDollar) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .update(user_dollar_entity_1.UserDollar)
                .set(userDollar);
            if (userDollar.id) {
                res = res.andWhere('id = :id', {
                    id: userDollar.id,
                });
            }
            if (userDollar.userId) {
                res = res.andWhere('userId = :userId', {
                    userId: userDollar.userId,
                });
            }
            return yield res.execute();
        });
    }
    updateUserDollarLevel(originLevel, newLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .update(user_dollar_entity_1.UserDollar)
                .set({ level: newLevel });
            res = res.andWhere('level = :level', {
                level: originLevel,
            });
            return yield res.execute();
        });
    }
    updateUserDollars(id, change, level, changeChargeDollars) {
        return __awaiter(this, void 0, void 0, function* () {
            let resEnableNonVipGainPurchasePoint = yield this.serverConfigService.getServerConfig({ name: 'EnableNonVipGainPurchasePoint' });
            if (resEnableNonVipGainPurchasePoint && resEnableNonVipGainPurchasePoint.id) {
                resEnableNonVipGainPurchasePoint.value = JSON.parse(resEnableNonVipGainPurchasePoint.value).value;
            }
            let resEnablePurcahseAddMembershipPoints = yield this.serverConfigService.getServerConfig({ name: 'EnablePurcahseAddMembershipPoints' });
            if (resEnablePurcahseAddMembershipPoints && resEnablePurcahseAddMembershipPoints.id) {
                resEnablePurcahseAddMembershipPoints.value = JSON.parse(resEnablePurcahseAddMembershipPoints.value).value;
            }
            let resRead = yield this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock("pessimistic_write")
                .useTransaction(true)
                .where('id = :id', {
                id,
            })
                .getOne();
            const params = { dollars: resRead.dollars + change };
            if (changeChargeDollars && resEnablePurcahseAddMembershipPoints.value && ((resEnableNonVipGainPurchasePoint.value === true && Number(level) === 0) || Number(level) > 0)) {
                params.chargeDollars = resRead.chargeDollars + Math.abs(change);
                const resGetLevelListByChargeDollar = yield this.levelService.getLevelListByChargeDollar(params.chargeDollars);
                console.log(resGetLevelListByChargeDollar);
                if (resGetLevelListByChargeDollar && resGetLevelListByChargeDollar.length) {
                    params.level = resGetLevelListByChargeDollar[0].level;
                }
            }
            let resWrite = this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock("pessimistic_read")
                .setLock("pessimistic_write")
                .useTransaction(true)
                .update(user_dollar_entity_1.UserDollar)
                .set(params)
                .where('id = :id', {
                id,
            });
            return yield resWrite.execute();
        });
    }
    updateUserChargeDollars(id, change, levelExpire) {
        return __awaiter(this, void 0, void 0, function* () {
            let resRead = yield this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock("pessimistic_write")
                .useTransaction(true)
                .where('id = :id', {
                id,
            })
                .getOne();
            let resWrite = this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock("pessimistic_read")
                .setLock("pessimistic_write")
                .useTransaction(true)
                .update(user_dollar_entity_1.UserDollar)
                .set({ chargeDollars: levelExpire === true ? change : resRead.chargeDollars + change })
                .where('id = :id', {
                id,
            });
            return yield resWrite.execute();
        });
    }
    updateAllUserDollars(change) {
        return __awaiter(this, void 0, void 0, function* () {
            let resWrite = this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock("pessimistic_read")
                .setLock("pessimistic_write")
                .useTransaction(true)
                .update(user_dollar_entity_1.UserDollar)
                .set({ dollars: () => `dollars + ${change}` });
            return yield resWrite.execute();
        });
    }
    getUserDollarList(page, data, sorts) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarRepository.createQueryBuilder('userDollar');
            res = res.leftJoinAndMapOne('userDollar.userInfo', user_entity_1.User, "userInfo", "userDollar.userId = userInfo.id");
            if (data && data.userId) {
                res = res.where('userDollar.userId = :userId', { userId: data.userId });
            }
            if (data && data.level !== undefined) {
                res = res.where('userDollar.level = :level', { level: data.level });
            }
            if (data && data.gesture !== undefined) {
                res = res.where('userDollar.gesture = :gesture', { gesture: data.gesture });
            }
            if (sorts && sorts.length) {
                sorts.forEach(sortItem => { res = res.orderBy(`userDollar.${sortItem.sort}`, sortItem.order); });
            }
            return yield res
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getUserDollar(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .setLock('pessimistic_write')
                .useTransaction(true);
            res = res.where('userId = :userId', { userId: userId });
            return yield res
                .getOne();
        });
    }
    deleteUserDollar(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarRepository
                .createQueryBuilder('user_dollar')
                .delete()
                .from(user_dollar_entity_1.UserDollar);
            res = res.where("userId = :userId", { userId });
            return yield res
                .execute();
        });
    }
    exportUserDollarsList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarRepository.createQueryBuilder('user_dollar');
            return yield res
                .orderBy(`updateTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
UserDollarService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_dollar_entity_1.UserDollar)),
    __metadata("design:paramtypes", [server_config_service_1.ServerConfigService,
        typeorm_2.Repository,
        level_service_1.LevelService])
], UserDollarService);
exports.UserDollarService = UserDollarService;
//# sourceMappingURL=user-dollar.service.js.map