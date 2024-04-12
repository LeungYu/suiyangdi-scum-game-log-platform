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
exports.SquadHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const squad_history_entity_1 = require("../../entity/squad-history.entity");
const user_entity_1 = require("../../entity/user.entity");
let SquadHistoryService = class SquadHistoryService {
    constructor(squadHistoryRepository) {
        this.squadHistoryRepository = squadHistoryRepository;
    }
    saveSquadHistory(squadId, userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadHistoryRepository.save(new squad_history_entity_1.SquadHistory(squadId, userId, action));
        });
    }
    updateSquadHistory(squadHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.squadHistoryRepository
                .createQueryBuilder()
                .update(squad_history_entity_1.SquadHistory)
                .set(squadHistory);
            res = res.andWhere('id = :id', {
                id: squadHistory.id,
            });
            return yield res.execute();
        });
    }
    getSquadHistoryList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadHistoryRepository.createQueryBuilder('squadHistory');
            res = res.leftJoinAndMapOne('squadHistory.userInfo', user_entity_1.User, "userInfo", "squadHistory.userId = userInfo.id");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadHistory.squadId = :squadId", { squadId: data.squadId });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadHistory.userId = :userId", { userId: data.userId });
            }
            if (data.action !== undefined) {
                res = res.andWhere("squadHistory.action = :action", { action: data.action });
            }
            return yield res
                .orderBy(`squadHistory.createdTimeStamp`, 'ASC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadHistoryListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadHistoryRepository.createQueryBuilder('squadHistory');
            res = res.leftJoinAndMapOne('squadHistory.userInfo', user_entity_1.User, "userInfo", "squadHistory.userId = userInfo.id");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadHistory.squadId like :squadId", { squadId: `%${data.squadId}%` });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadHistory.userId like :userId", { userId: `%${data.userId}%` });
            }
            if (data.action !== undefined) {
                res = res.andWhere("squadHistory.action like :action", { action: `%${data.action}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("squadHistory.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("squadHistory.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`squadHistory.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadHistory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadHistoryRepository.createQueryBuilder('squadHistory');
            res = res.leftJoinAndMapOne('squadHistory.userInfo', user_entity_1.User, "userInfo", "squadHistory.userId = userInfo.id");
            if (data && (data.id || data.squadId !== undefined || data.userId !== undefined || data.action !== undefined)) {
                if (data.id) {
                    res = res.andWhere("squadHistory.id = :id", { id: data.id });
                }
                if (data.squadId !== undefined) {
                    res = res.andWhere("squadHistory.squadId = :squadId", { squadId: data.squadId });
                }
                if (data.userId !== undefined) {
                    res = res.andWhere("squadHistory.userId = :userId", { userId: data.userId });
                }
                if (data.action !== undefined) {
                    res = res.andWhere("squadHistory.action = :action", { action: data.action });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteSquadHistory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadHistoryRepository.createQueryBuilder('squadHistory')
                .delete()
                .from(squad_history_entity_1.SquadHistory);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    cleanSquadHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadHistoryRepository.clear();
        });
    }
};
SquadHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(squad_history_entity_1.SquadHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SquadHistoryService);
exports.SquadHistoryService = SquadHistoryService;
//# sourceMappingURL=squad-history.service.js.map