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
exports.SquadJoinRequestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const squad_join_request_entity_1 = require("../../entity/squad-join-request.entity");
const user_entity_1 = require("../../entity/user.entity");
const squad_entity_1 = require("../../entity/squad.entity");
let SquadJoinRequestService = class SquadJoinRequestService {
    constructor(squadJoinRequestRepository) {
        this.squadJoinRequestRepository = squadJoinRequestRepository;
    }
    saveSquadJoinRequest(squadId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadJoinRequestRepository.save(new squad_join_request_entity_1.SquadJoinRequest(squadId, userId));
        });
    }
    updateSquadJoinRequest(squadJoinRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.squadJoinRequestRepository
                .createQueryBuilder()
                .update(squad_join_request_entity_1.SquadJoinRequest)
                .set(squadJoinRequest);
            res = res.andWhere('id = :id', {
                id: squadJoinRequest.id,
            });
            return yield res.execute();
        });
    }
    getSquadJoinRequestList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadJoinRequestRepository.createQueryBuilder('squadJoinRequest');
            res = res.leftJoinAndMapOne('squadJoinRequest.userInfo', user_entity_1.User, "userInfo", "squadJoinRequest.userId = userInfo.id");
            res = res.leftJoinAndMapOne('squadJoinRequest.squadInfo', squad_entity_1.Squad, "squadInfo", "squadJoinRequest.squadId = squadInfo.id");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadJoinRequest.squadId = :squadId", { squadId: data.squadId });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadJoinRequest.userId = :userId", { userId: data.userId });
            }
            if (data.status !== undefined) {
                res = res.andWhere("squadJoinRequest.status = :status", { status: data.status });
            }
            return yield res
                .orderBy(`squadJoinRequest.createdTimeStamp`, 'ASC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadJoinRequestListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadJoinRequestRepository.createQueryBuilder('squadJoinRequest');
            res = res.leftJoinAndMapOne('squadJoinRequest.userInfo', user_entity_1.User, "userInfo", "squadJoinRequest.userId = userInfo.id");
            res = res.leftJoinAndMapOne('squadJoinRequest.squadInfo', squad_entity_1.Squad, "squadInfo", "squadJoinRequest.squadId = squadInfo.id");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadJoinRequest.squadId like :squadId", { squadId: `%${data.squadId}%` });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadJoinRequest.userId like :userId", { userId: `%${data.userId}%` });
            }
            if (data.status !== undefined) {
                res = data.status === null ? res.andWhere("squadJoinRequest.status is :status", { status: data.status }) : res.andWhere("status = :status", { status: data.status });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("squadJoinRequest.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("squadJoinRequest.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`squadJoinRequest.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadJoinRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadJoinRequestRepository.createQueryBuilder('squadJoinRequest');
            res = res.leftJoinAndMapOne('squadJoinRequest.userInfo', user_entity_1.User, "userInfo", "squadJoinRequest.userId = userInfo.id");
            res = res.leftJoinAndMapOne('squadJoinRequest.squadInfo', squad_entity_1.Squad, "squadInfo", "squadJoinRequest.squadId = squadInfo.id");
            if (data && (data.id || data.squadId !== undefined || data.userId !== undefined || data.status !== undefined)) {
                if (data.id) {
                    res = res.andWhere("squadJoinRequest.id = :id", { id: data.id });
                }
                if (data.squadId !== undefined) {
                    res = res.andWhere("squadJoinRequest.squadId = :squadId", { squadId: data.squadId });
                }
                if (data.userId !== undefined) {
                    res = res.andWhere("squadJoinRequest.userId = :userId", { userId: data.userId });
                }
                if (data.status !== undefined) {
                    res = res.andWhere("squadJoinRequest.status = :status", { status: data.status });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteSquadJoinRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadJoinRequestRepository.createQueryBuilder('squadJoinRequest')
                .delete()
                .from(squad_join_request_entity_1.SquadJoinRequest);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    cleanSquadJoinRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadJoinRequestRepository.clear();
        });
    }
};
SquadJoinRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(squad_join_request_entity_1.SquadJoinRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SquadJoinRequestService);
exports.SquadJoinRequestService = SquadJoinRequestService;
//# sourceMappingURL=squad-join-request.service.js.map