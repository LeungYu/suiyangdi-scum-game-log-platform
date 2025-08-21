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
exports.UnrecognizedRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const unrecognized_record_entity_1 = require("../../entity/unrecognized-record.entity");
const typeorm_2 = require("typeorm");
let UnrecognizedRecordService = class UnrecognizedRecordService {
    constructor(unrecognizedRecordRepository) {
        this.unrecognizedRecordRepository = unrecognizedRecordRepository;
    }
    saveUnrecognizedRecord(fileName, rawText, createdTimeStamp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.unrecognizedRecordRepository.save(new unrecognized_record_entity_1.UnrecognizedRecord(fileName, rawText, createdTimeStamp));
        });
    }
    getUnrecognizedRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.unrecognizedRecordRepository.createQueryBuilder('unrecognizedRecord');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.fileName !== undefined) {
                res = res.andWhere("fileName = :fileName", { fileName: data.fileName });
            }
            if (data.rawText !== undefined) {
                res = res.andWhere("rawText = :rawText", { rawText: data.rawText });
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
    getUnrecognizedRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.unrecognizedRecordRepository.createQueryBuilder('unrecognizedRecord');
            if (data.fileName !== undefined) {
                res = res.andWhere("unrecognizedRecord.fileName like :fileName", { fileName: `%${data.fileName}%` });
            }
            if (data.rawText !== undefined) {
                res = res.andWhere("unrecognizedRecord.rawText like :rawText", { rawText: `%${data.rawText}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("unrecognizedRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("unrecognizedRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`unrecognizedRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getUnrecognizedRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.unrecognizedRecordRepository.createQueryBuilder('unrecognizedRecord');
            if (data && (data.id || data.fileName !== undefined || data.rawText !== undefined || data.createdTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.fileName !== undefined) {
                    res = res.andWhere("fileName = :fileName", { fileName: data.fileName });
                }
                if (data.rawText !== undefined) {
                    res = res.andWhere("rawText = :rawText", { rawText: data.rawText });
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
    deleteUnrecognizedRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.unrecognizedRecordRepository.createQueryBuilder('unrecognizedRecord')
                .delete()
                .from(unrecognized_record_entity_1.UnrecognizedRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestCreatedTimeStamp = yield this.unrecognizedRecordRepository
                .createQueryBuilder('unrecognizedRecord')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    limitAllUnrecognizedRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.unrecognizedRecordRepository.createQueryBuilder('unrecognizedRecord')
                .delete()
                .from(unrecognized_record_entity_1.UnrecognizedRecord);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from unrecognized_record ORDER BY createdTimeStamp DESC LIMIT 1500) t)");
            return yield res
                .execute();
        });
    }
    clearUnrecognizedRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.unrecognizedRecordRepository
                .clear();
        });
    }
};
UnrecognizedRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unrecognized_record_entity_1.UnrecognizedRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UnrecognizedRecordService);
exports.UnrecognizedRecordService = UnrecognizedRecordService;
//# sourceMappingURL=unrecognized-record.service.js.map