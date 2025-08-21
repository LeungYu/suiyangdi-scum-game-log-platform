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
exports.VehicleDestructionRecordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_destruction_record_entity_1 = require("../../entity/vehicle-destruction-record.entity");
const typeorm_2 = require("typeorm");
let VehicleDestructionRecordService = class VehicleDestructionRecordService {
    constructor(vehicleDestructionRecordRepository) {
        this.vehicleDestructionRecordRepository = vehicleDestructionRecordRepository;
    }
    saveVehicleDestructionRecord(ownerScumId, ownerSteamId, ownerSessionId, actionType, vehicleType, vehicleId, locations, area, createdTimeStamp, rawText) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vehicleDestructionRecordRepository.save(new vehicle_destruction_record_entity_1.VehicleDestructionRecord(ownerScumId, ownerSteamId, ownerSessionId, actionType, vehicleType, vehicleId, locations, area, createdTimeStamp, rawText));
        });
    }
    getVehicleDestructionRecordList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.vehicleDestructionRecordRepository.createQueryBuilder('vehicleDestructionRecord');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.ownerScumId !== undefined) {
                res = res.andWhere("ownerScumId = :ownerScumId", { ownerScumId: data.ownerScumId });
            }
            if (data.ownerSteamId !== undefined) {
                res = res.andWhere("ownerSteamId = :ownerSteamId", { ownerSteamId: data.ownerSteamId });
            }
            if (data.ownerSessionId !== undefined) {
                res = res.andWhere("ownerSessionId = :ownerSessionId", { ownerSessionId: data.ownerSessionId });
            }
            if (data.actionType !== undefined) {
                res = res.andWhere("actionType = :actionType", { actionType: data.actionType });
            }
            if (data.vehicleType !== undefined) {
                res = res.andWhere("vehicleType = :vehicleType", { vehicleType: data.vehicleType });
            }
            if (data.vehicleId !== undefined) {
                res = res.andWhere("vehicleId = :vehicleId", { vehicleId: data.vehicleId });
            }
            if (data.locations !== undefined) {
                res = res.andWhere("locations = :locations", { locations: data.locations });
            }
            if (data.area !== undefined) {
                res = res.andWhere("area = :area", { area: data.area });
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
    getVehicleDestructionRecordListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.vehicleDestructionRecordRepository.createQueryBuilder('vehicleDestructionRecord');
            if (data.ownerScumId !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.ownerScumId like :ownerScumId", { ownerScumId: `%${data.ownerScumId}%` });
            }
            if (data.ownerSteamId !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.ownerSteamId like :ownerSteamId", { ownerSteamId: `%${data.ownerSteamId}%` });
            }
            if (data.ownerSessionId !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.ownerSessionId like :ownerSessionId", { ownerSessionId: `%${data.ownerSessionId}%` });
            }
            if (data.actionType !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.actionType like :actionType", { actionType: `%${data.actionType}%` });
            }
            if (data.vehicleType !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.vehicleType like :vehicleType", { vehicleType: `%${data.vehicleType}%` });
            }
            if (data.vehicleId !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.vehicleId like :vehicleId", { vehicleId: `%${data.vehicleId}%` });
            }
            if (data.locations !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.locations like :locations", { locations: `%${data.locations}%` });
            }
            if (data.area !== undefined) {
                res = res.andWhere("vehicleDestructionRecord.area like :area", { area: `%${data.area}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("vehicleDestructionRecord.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("vehicleDestructionRecord.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`vehicleDestructionRecord.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getVehicleDestructionRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.vehicleDestructionRecordRepository.createQueryBuilder('vehicleDestructionRecord');
            if (data && (data.id || data.ownerScumId !== undefined || data.ownerSteamId !== undefined || data.ownerSessionId !== undefined || data.actionType !== undefined || data.vehicleType !== undefined || data.vehicleId !== undefined || data.locations !== undefined || data.area !== undefined || data.createdTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.ownerScumId !== undefined) {
                    res = res.andWhere("ownerScumId = :ownerScumId", { ownerScumId: data.ownerScumId });
                }
                if (data.ownerSteamId !== undefined) {
                    res = res.andWhere("ownerSteamId = :ownerSteamId", { ownerSteamId: data.ownerSteamId });
                }
                if (data.ownerSessionId !== undefined) {
                    res = res.andWhere("ownerSessionId = :ownerSessionId", { ownerSessionId: data.ownerSessionId });
                }
                if (data.actionType !== undefined) {
                    res = res.andWhere("actionType = :actionType", { actionType: data.actionType });
                }
                if (data.vehicleType !== undefined) {
                    res = res.andWhere("vehicleType = :vehicleType", { vehicleType: data.vehicleType });
                }
                if (data.vehicleId !== undefined) {
                    res = res.andWhere("vehicleId = :vehicleId", { vehicleId: data.vehicleId });
                }
                if (data.locations !== undefined) {
                    res = res.andWhere("locations = :locations", { locations: data.locations });
                }
                if (data.area !== undefined) {
                    res = res.andWhere("area = :area", { area: data.area });
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
    deleteVehicleDestructionRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.vehicleDestructionRecordRepository.createQueryBuilder('vehicleDestructionRecord')
                .delete()
                .from(vehicle_destruction_record_entity_1.VehicleDestructionRecord);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestCreatedTimeStamp = yield this.vehicleDestructionRecordRepository
                .createQueryBuilder('vehicleDestructionRecord')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`createdTimeStamp`, 'DESC')
                .getOne();
            return (resLatestCreatedTimeStamp && resLatestCreatedTimeStamp.createdTimeStamp) ? resLatestCreatedTimeStamp.createdTimeStamp : null;
        });
    }
    limitAllVehicleDestructionRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.vehicleDestructionRecordRepository.createQueryBuilder('vehicleDestructionRecord')
                .delete()
                .from(vehicle_destruction_record_entity_1.VehicleDestructionRecord);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from vehicle_destruction_record ORDER BY createdTimeStamp DESC LIMIT 1500) t)");
            return yield res
                .execute();
        });
    }
    clearVehicleDestructionRecord() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vehicleDestructionRecordRepository
                .clear();
        });
    }
};
VehicleDestructionRecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_destruction_record_entity_1.VehicleDestructionRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleDestructionRecordService);
exports.VehicleDestructionRecordService = VehicleDestructionRecordService;
//# sourceMappingURL=vehicle-destruction-record.service.js.map