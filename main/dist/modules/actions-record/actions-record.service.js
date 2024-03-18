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
exports.ActionsRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const actions_record_entity_1 = require("../../entity/actions-record.entity");
const typeorm_2 = require("typeorm");
let ActionsRecordService = class ActionsRecordService {
    constructor(actionsRecordRepository) {
        this.actionsRecordRepository = actionsRecordRepository;
    }
    saveActionsRecord(scumId, steamId, sessionId, type, createdLocations, createdArea, createdTimeStamp, targetName, otherConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.actionsRecordRepository.save(new actions_record_entity_1.ActionsRecord(scumId, steamId, sessionId, type, createdLocations, createdArea, createdTimeStamp, targetName, otherConfig));
        });
    }
    getActionsRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.actionsRecordRepository.createQueryBuilder('actionsRecord');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.scumId !== undefined) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
            }
            if (data.type !== undefined) {
                res = res.andWhere("type = :type", { type: data.type });
            }
            if (data.createdLocations !== undefined) {
                res = res.andWhere("createdLocations = :createdLocations", { createdLocations: data.createdLocations });
            }
            if (data.createdArea !== undefined) {
                res = res.andWhere("createdArea = :createdArea", { createdArea: data.createdArea });
            }
            if (data.createdTimeStamp !== undefined) {
                res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
            }
            if (data.targetName !== undefined) {
                res = res.andWhere("targetName = :targetName", { targetName: data.targetName });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getActionsRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.actionsRecordRepository.createQueryBuilder('actionsRecord');
            if (data.scumId !== undefined) {
                res = res.andWhere("actionsRecord.scumId like :scumId", { scumId: `%${data.scumId}%` });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("actionsRecord.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("actionsRecord.sessionId like :sessionId", { sessionId: `%${data.sessionId}%` });
            }
            if (data.type !== undefined) {
                res = res.andWhere("actionsRecord.type like :type", { type: `%${data.type}%` });
            }
            if (data.createdLocations !== undefined) {
                res = res.andWhere("actionsRecord.createdLocations like :createdLocations", { createdLocations: `%${data.createdLocations}%` });
            }
            if (data.createdArea !== undefined) {
                res = res.andWhere("actionsRecord.createdArea like :createdArea", { createdArea: `%${data.createdArea}%` });
            }
            if (data.targetName !== undefined) {
                res = res.andWhere("actionsRecord.targetName like :targetName", { targetName: `%${data.targetName}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("actionsRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("actionsRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`actionsRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getActionsRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.actionsRecordRepository.createQueryBuilder('actionsRecord');
            if (data && (data.id || data.scumId !== undefined || data.steamId !== undefined || data.sessionId !== undefined || data.type !== undefined || data.createdLocations !== undefined || data.createdArea !== undefined || data.createdTimeStamp !== undefined || data.targetName !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.scumId !== undefined) {
                    res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
                }
                if (data.steamId !== undefined) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.sessionId !== undefined) {
                    res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
                }
                if (data.type !== undefined) {
                    res = res.andWhere("type = :type", { type: data.type });
                }
                if (data.createdLocations !== undefined) {
                    res = res.andWhere("createdLocations = :createdLocations", { createdLocations: data.createdLocations });
                }
                if (data.createdArea !== undefined) {
                    res = res.andWhere("createdArea = :createdArea", { createdArea: data.createdArea });
                }
                if (data.createdTimeStamp !== undefined) {
                    res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
                }
                if (data.targetName !== undefined) {
                    res = res.andWhere("targetName = :targetName", { targetName: data.targetName });
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
            let resLatestCreatedTimeStamp = yield this.actionsRecordRepository
                .createQueryBuilder('actionsRecord')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    deleteActionsRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.actionsRecordRepository.createQueryBuilder('actionsRecord')
                .delete()
                .from(actions_record_entity_1.ActionsRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllActionsRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.actionsRecordRepository.createQueryBuilder('actionsRecord')
                .delete()
                .from(actions_record_entity_1.ActionsRecord);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from actions_record ORDER BY createdTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    clearActionsRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.actionsRecordRepository
                .clear();
        });
    }
};
ActionsRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(actions_record_entity_1.ActionsRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ActionsRecordService);
exports.ActionsRecordService = ActionsRecordService;
//# sourceMappingURL=actions-record.service.js.map