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
exports.PrizeRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const prize_record_entity_1 = require("../../entity/prize-record.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entity/user.entity");
let PrizeRecordService = class PrizeRecordService {
    constructor(prizeRecordRepository) {
        this.prizeRecordRepository = prizeRecordRepository;
    }
    savePrizeRecords(prizeRecords) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let prizeRecord of prizeRecords) {
                const element = new prize_record_entity_1.PrizeRecord(prizeRecord === null || prizeRecord === void 0 ? void 0 : prizeRecord.userId, prizeRecord === null || prizeRecord === void 0 ? void 0 : prizeRecord.prizeId, prizeRecord === null || prizeRecord === void 0 ? void 0 : prizeRecord.dollar);
                insertArray.push(element);
            }
            return yield this.prizeRecordRepository.save(insertArray);
        });
    }
    savePrizeRecord(userId, prizeId, dollars) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prizeRecordRepository.save(new prize_record_entity_1.PrizeRecord(userId, prizeId, dollars));
        });
    }
    getPrizeRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prizeRecordRepository.createQueryBuilder('prizeRecord');
            res = res.leftJoinAndMapOne('prizeRecord.prizeUser', user_entity_1.User, "prizeUser", "prizeRecord.userId = prizeUser.id");
            if (data.id) {
                res = res.andWhere("prizeRecord.id = :id", { id: data.id });
            }
            if (data.userId) {
                res = res.andWhere("prizeRecord.userId = :userId", { userId: data.userId });
            }
            if (data.prizeId !== undefined) {
                res = res.andWhere("prizeRecord.prizeId = :prizeId", { prizeId: data.prizeId });
            }
            if (data.dollars !== undefined) {
                res = res.andWhere("prizeRecord.dollars = :dollars", { dollars: data.dollars });
            }
            return yield res
                .orderBy(`prizeRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getPrizeRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prizeRecordRepository.createQueryBuilder('prizeRecord');
            res = res.leftJoinAndMapOne('prizeRecord.prizeUser', user_entity_1.User, "prizeUser", "prizeRecord.userId = prizeUser.id");
            if (data.userName) {
                res = res.andWhere("prizeUser.userName like :userName", { userName: `%${data.userName}%` });
            }
            if (data.prizeId) {
                res = res.andWhere("prizeRecord.prizeId = :prizeId", { prizeId: data.prizeId });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("prizeRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("prizeRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`prizeRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getPrizeRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prizeRecordRepository.createQueryBuilder('prize-record');
            if (data && (data.id || data.userId || data.prizeId || data.dollars)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.userId) {
                    res = res.andWhere("userId = :userId", { userId: data.userId });
                }
                if (data.prizeId !== undefined) {
                    res = res.andWhere("prizeId = :prizeId", { prizeId: data.prizeId });
                }
                if (data.dollars !== undefined) {
                    res = res.andWhere("dollars = :dollars", { dollars: data.dollars });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deletePrizeRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prizeRecordRepository.createQueryBuilder('prize-record')
                .delete()
                .from(prize_record_entity_1.PrizeRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    clearPrizeRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prizeRecordRepository.clear();
        });
    }
};
PrizeRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prize_record_entity_1.PrizeRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PrizeRecordService);
exports.PrizeRecordService = PrizeRecordService;
//# sourceMappingURL=prize-record.service.js.map