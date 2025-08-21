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
exports.ChestOwnershipRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chest_ownership_record_entity_1 = require("../../entity/chest-ownership-record.entity");
const typeorm_2 = require("typeorm");
let ChestOwnershipRecordService = class ChestOwnershipRecordService {
    constructor(chestOwnershipRecordRepository) {
        this.chestOwnershipRecordRepository = chestOwnershipRecordRepository;
    }
    saveChestOwnershipRecord(fromScumId, fromSteamId, toScumId, toSteamId, chestId, createdTimeStamp, rawText) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.chestOwnershipRecordRepository.save(new chest_ownership_record_entity_1.ChestOwnershipRecord(fromScumId, fromSteamId, toScumId, toSteamId, chestId, createdTimeStamp, rawText));
        });
    }
    getChestOwnershipRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chestOwnershipRecordRepository.createQueryBuilder('chestOwnershipRecord');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.fromScumId !== undefined) {
                res = res.andWhere("fromScumId = :fromScumId", { fromScumId: data.fromScumId });
            }
            if (data.fromSteamId !== undefined) {
                res = res.andWhere("fromSteamId = :fromSteamId", { fromSteamId: data.fromSteamId });
            }
            if (data.toScumId !== undefined) {
                res = res.andWhere("toScumId = :toScumId", { toScumId: data.toScumId });
            }
            if (data.toSteamId !== undefined) {
                res = res.andWhere("toSteamId = :toSteamId", { toSteamId: data.toSteamId });
            }
            if (data.chestId !== undefined) {
                res = res.andWhere("chestId = :chestId", { chestId: data.chestId });
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
    getChestOwnershipRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chestOwnershipRecordRepository.createQueryBuilder('chestOwnershipRecord');
            if (data.fromScumId !== undefined) {
                res = res.andWhere("chestOwnershipRecord.fromScumId like :fromScumId", { fromScumId: `%${data.fromScumId}%` });
            }
            if (data.fromSteamId !== undefined) {
                res = res.andWhere("chestOwnershipRecord.fromSteamId like :fromSteamId", { fromSteamId: `%${data.fromSteamId}%` });
            }
            if (data.toScumId !== undefined) {
                res = res.andWhere("chestOwnershipRecord.toScumId like :toScumId", { toScumId: `%${data.toScumId}%` });
            }
            if (data.toSteamId !== undefined) {
                res = res.andWhere("chestOwnershipRecord.toSteamId like :toSteamId", { toSteamId: `%${data.toSteamId}%` });
            }
            if (data.chestId !== undefined) {
                res = res.andWhere("chestOwnershipRecord.chestId like :chestId", { chestId: `%${data.chestId}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("chestOwnershipRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("chestOwnershipRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`chestOwnershipRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getChestOwnershipRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chestOwnershipRecordRepository.createQueryBuilder('chestOwnershipRecord');
            if (data && (data.id || data.fromScumId !== undefined || data.fromSteamId !== undefined || data.toScumId !== undefined || data.toSteamId !== undefined || data.chestId !== undefined || data.createdTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.fromScumId !== undefined) {
                    res = res.andWhere("fromScumId = :fromScumId", { fromScumId: data.fromScumId });
                }
                if (data.fromSteamId !== undefined) {
                    res = res.andWhere("fromSteamId = :fromSteamId", { fromSteamId: data.fromSteamId });
                }
                if (data.toScumId !== undefined) {
                    res = res.andWhere("toScumId = :toScumId", { toScumId: data.toScumId });
                }
                if (data.toSteamId !== undefined) {
                    res = res.andWhere("toSteamId = :toSteamId", { toSteamId: data.toSteamId });
                }
                if (data.chestId !== undefined) {
                    res = res.andWhere("chestId = :chestId", { chestId: data.chestId });
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
    deleteChestOwnershipRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chestOwnershipRecordRepository.createQueryBuilder('chestOwnershipRecord')
                .delete()
                .from(chest_ownership_record_entity_1.ChestOwnershipRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestCreatedTimeStamp = yield this.chestOwnershipRecordRepository
                .createQueryBuilder('chestOwnershipRecord')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    limitAllChestOwnershipRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.chestOwnershipRecordRepository.createQueryBuilder('chestOwnershipRecord')
                .delete()
                .from(chest_ownership_record_entity_1.ChestOwnershipRecord);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from chest_ownership_record ORDER BY createdTimeStamp DESC LIMIT 1500) t)");
            return yield res
                .execute();
        });
    }
    clearChestOwnershipRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.chestOwnershipRecordRepository
                .clear();
        });
    }
};
ChestOwnershipRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chest_ownership_record_entity_1.ChestOwnershipRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChestOwnershipRecordService);
exports.ChestOwnershipRecordService = ChestOwnershipRecordService;
//# sourceMappingURL=chest-ownership-record.service.js.map