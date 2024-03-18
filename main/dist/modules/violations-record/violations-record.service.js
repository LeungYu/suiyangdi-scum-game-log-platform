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
exports.ViolationsRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const violations_record_entity_1 = require("../../entity/violations-record.entity");
let ViolationsRecordService = class ViolationsRecordService {
    constructor(violationsRecordRepository) {
        this.violationsRecordRepository = violationsRecordRepository;
    }
    saveViolationsRecords(violationsRecords) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let violationsRecord of violationsRecords) {
                const element = new violations_record_entity_1.ViolationsRecord(violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.rawContent, violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.createdTimeStamp, violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.tag, violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.steamId, violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.count, violationsRecord === null || violationsRecord === void 0 ? void 0 : violationsRecord.otherConfig);
                insertArray.push(element);
            }
            return yield this.violationsRecordRepository.save(insertArray);
        });
    }
    saveViolationsRecord(rawContent, createdTimeStamp, tag, steamId, count, otherConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.violationsRecordRepository.save(new violations_record_entity_1.ViolationsRecord(rawContent, createdTimeStamp, tag, steamId, count, otherConfig));
        });
    }
    getViolationsRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.violationsRecordRepository.createQueryBuilder('violationsRecord');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.tag !== undefined) {
                res = res.andWhere("tag = :tag", { tag: data.tag });
            }
            if (data.rawContent !== undefined) {
                res = res.andWhere("rawContent = :rawContent", { rawContent: data.rawContent });
            }
            if (data.createdTimeStamp !== undefined) {
                res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.count !== undefined) {
                res = res.andWhere("count = :count", { count: data.count });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getViolationsRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.violationsRecordRepository.createQueryBuilder('violationsRecord');
            if (!!data.tag) {
                res = res.andWhere("violationsRecord.tag like :tag", { tag: `%${data.tag}%` });
            }
            if (data.tag === '') {
                res = res.andWhere("violationsRecord.tag = :tag", { tag: null });
            }
            if (data.rawContent !== undefined) {
                res = res.andWhere("violationsRecord.rawContent like :rawContent", { rawContent: `%${data.rawContent}%` });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("violationsRecord.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.count !== undefined) {
                res = res.andWhere("violationsRecord.count like :count", { count: `%${data.count}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("violationsRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("violationsRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            console.log(res.getSql());
            return yield res
                .orderBy(`violationsRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getViolationsRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.violationsRecordRepository.createQueryBuilder('violationsRecord');
            if (data && (data.id || data.tag !== undefined || data.rawContent !== undefined || data.createdTimeStamp !== undefined || data.steamId !== undefined || data.count !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.tag !== undefined) {
                    res = res.andWhere("tag = :tag", { tag: data.tag });
                }
                if (data.rawContent !== undefined) {
                    res = res.andWhere("rawContent = :rawContent", { rawContent: data.rawContent });
                }
                if (data.createdTimeStamp !== undefined) {
                    res = res.andWhere("createdTimeStamp = :createdTimeStamp", { createdTimeStamp: data.createdTimeStamp });
                }
                if (data.steamId !== undefined) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.count !== undefined) {
                    res = res.andWhere("count = :count", { count: data.count });
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
            let resLatestCreatedTimeStamp = yield this.violationsRecordRepository
                .createQueryBuilder('violationsRecord')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    deleteViolationsRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.violationsRecordRepository.createQueryBuilder('violationsRecord')
                .delete()
                .from(violations_record_entity_1.ViolationsRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllViolationsRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.violationsRecordRepository.createQueryBuilder('violationsRecord')
                .delete()
                .from(violations_record_entity_1.ViolationsRecord);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from violations_record ORDER BY createdTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    clearViolationsRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.violationsRecordRepository
                .clear();
        });
    }
};
ViolationsRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(violations_record_entity_1.ViolationsRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ViolationsRecordService);
exports.ViolationsRecordService = ViolationsRecordService;
//# sourceMappingURL=violations-record.service.js.map