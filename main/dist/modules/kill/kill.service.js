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
exports.KillService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kill_entity_1 = require("../../entity/kill.entity");
const typeorm_2 = require("typeorm");
let KillService = class KillService {
    constructor(killRepository) {
        this.killRepository = killRepository;
    }
    saveKills(kills) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let kill of kills) {
                const element = new kill_entity_1.Kill(kill === null || kill === void 0 ? void 0 : kill.killerSteamId, kill === null || kill === void 0 ? void 0 : kill.killerName, kill === null || kill === void 0 ? void 0 : kill.killerLocations, kill === null || kill === void 0 ? void 0 : kill.killerArea, kill === null || kill === void 0 ? void 0 : kill.victimSteamId, kill === null || kill === void 0 ? void 0 : kill.victimName, kill === null || kill === void 0 ? void 0 : kill.victimLocations, kill === null || kill === void 0 ? void 0 : kill.victimArea, kill === null || kill === void 0 ? void 0 : kill.distance, kill === null || kill === void 0 ? void 0 : kill.weapon, kill === null || kill === void 0 ? void 0 : kill.isEventKill, kill === null || kill === void 0 ? void 0 : kill.occuredTimeStamp);
                insertArray.push(element);
            }
            return yield this.killRepository.save(insertArray);
        });
    }
    saveKill(killerSteamId, killerName, killerLocations, killerArea, victimSteamId, victimName, victimLocations, victimArea, distance, weapon, isEventKill, occuredTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.killRepository.save(new kill_entity_1.Kill(killerSteamId, killerName, killerLocations, killerArea, victimSteamId, victimName, victimLocations, victimArea, distance, weapon, isEventKill, occuredTimeStamp));
        });
    }
    getKillListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.killRepository.createQueryBuilder('kill');
            if (data.killerSteamId) {
                res = res.andWhere("kill.killerSteamId like :killerSteamId", { killerSteamId: `%${data.killerSteamId}%` });
            }
            if (data.killerName) {
                res = res.andWhere("kill.killerName like :killerName", { killerName: `%${data.killerName}%` });
            }
            if (data.killerArea) {
                res = res.andWhere("kill.killerArea = :killerArea", { killerArea: data.killerArea });
            }
            if (data.victimSteamId) {
                res = res.andWhere("kill.victimSteamId like :victimSteamId", { victimSteamId: `%${data.victimSteamId}%` });
            }
            if (data.victimName) {
                res = res.andWhere("kill.victimName like :victimName", { victimName: `%${data.victimName}%` });
            }
            if (data.victimArea) {
                res = res.andWhere("kill.victimArea = :victimArea", { victimArea: data.victimArea });
            }
            if (data.weapon) {
                res = res.andWhere("kill.weapon like :weapon", { weapon: `%${data.weapon}%` });
            }
            if (data.isEventKill !== undefined) {
                res = res.andWhere("kill.isEventKill = :isEventKill", { isEventKill: data.isEventKill === 'true' });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("kill.occuredTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("kill.occuredTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`kill.occuredTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getKill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.killRepository.createQueryBuilder('kill');
            if (data && (data.id || data.killerSteamId || data.killerName || data.killerLocations || data.killerArea || data.victimSteamId || data.victimName || data.victimLocations || data.victimArea || data.distance || data.weapon || data.occuredTimeStamp)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.killerSteamId) {
                    res = res.andWhere("killerSteamId = :killerSteamId", { killerSteamId: data.killerSteamId });
                }
                if (data.killerName) {
                    res = res.andWhere("killerName = :killerName", { killerName: data.killerName });
                }
                if (data.killerLocations) {
                    res = res.andWhere("killerLocations = :killerLocations", { killerLocations: data.killerLocations });
                }
                if (data.killerArea) {
                    res = res.andWhere("killerArea = :killerArea", { killerArea: data.killerArea });
                }
                if (data.victimSteamId) {
                    res = res.andWhere("victimSteamId = :victimSteamId", { victimSteamId: data.victimSteamId });
                }
                if (data.victimName) {
                    res = res.andWhere("victimName = :victimName", { victimName: data.victimName });
                }
                if (data.victimLocations) {
                    res = res.andWhere("victimLocations = :victimLocations", { victimLocations: data.victimLocations });
                }
                if (data.victimArea) {
                    res = res.andWhere("victimArea = :victimArea", { victimArea: data.victimArea });
                }
                if (data.distance !== undefined) {
                    res = res.andWhere("distance = :distance", { distance: data.distance });
                }
                if (data.weapon) {
                    res = res.andWhere("weapon = :weapon", { weapon: data.weapon });
                }
                if (data.isEventKill !== undefined) {
                    res = res.andWhere("isEventKill = :isEventKill", { isEventKill: data.isEventKill === 'true' });
                }
                if (data.occuredTimeStamp) {
                    res = res.andWhere("occuredTimeStamp = :occuredTimeStamp", { occuredTimeStamp: data.occuredTimeStamp });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    getLatestKill() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.killRepository.createQueryBuilder('kill');
            res = res.orderBy(`occuredTimeStamp`, 'DESC');
            return yield res
                .getOne();
        });
    }
    deleteKill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.killRepository.createQueryBuilder('kill')
                .delete()
                .from(kill_entity_1.Kill);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllKill() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.killRepository.createQueryBuilder('kill')
                .delete()
                .from(kill_entity_1.Kill);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from `kill` ORDER BY occuredTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    cleanKill() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.killRepository.clear();
        });
    }
};
KillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kill_entity_1.Kill)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KillService);
exports.KillService = KillService;
//# sourceMappingURL=kill.service.js.map