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
exports.SquadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const squad_entity_1 = require("../../entity/squad.entity");
const user_entity_1 = require("../../entity/user.entity");
const squad_user_entity_1 = require("../../entity/squad-user.entity");
let SquadService = class SquadService {
    constructor(squadRepository) {
        this.squadRepository = squadRepository;
    }
    saveSquad(name, createdByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadRepository.save(new squad_entity_1.Squad(name, createdByUserId));
        });
    }
    updateSquad(squad) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.squadRepository
                .createQueryBuilder()
                .update(squad_entity_1.Squad)
                .set(squad);
            res = res.andWhere('id = :id', {
                id: squad.id,
            });
            return yield res.execute();
        });
    }
    getSquadList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadRepository.createQueryBuilder('squad');
            res = res.leftJoinAndMapOne('squad.createdUser', user_entity_1.User, "createdUser", "squad.createdByUserId = createdUser.id");
            res = res.leftJoinAndMapMany('squad.squadUsers', squad_user_entity_1.SquadUser, "squadUsers", "squad.id = squadUsers.squadId");
            if (data.name !== undefined) {
                res = res.andWhere("squad.name = :name", { name: data.name });
            }
            if (data.createdByUserId !== undefined) {
                res = res.andWhere("squad.createdByUserId = :createdByUserId", { createdByUserId: data.createdByUserId });
            }
            if (data.status !== undefined) {
                res = res.andWhere("squad.status = :status", { status: data.status });
            }
            return yield res
                .orderBy(`squad.createdTimeStamp`, 'ASC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadRepository.createQueryBuilder('squad');
            res = res.leftJoinAndMapOne('squad.createdUser', user_entity_1.User, "createdUser", "squad.createdByUserId = createdUser.id");
            if (data.name !== undefined) {
                res = res.andWhere("squad.name like :name", { name: `%${data.name}%` });
            }
            if (data.createdByUserName !== undefined) {
                res = res.andWhere("createdUser.userName like :createdByUserName", { createdByUserName: `%${data.createdByUserName}%` });
            }
            if (data.status !== undefined) {
                res = data.status === null ? res.andWhere("squad.status is :status", { status: data.status }) : res.andWhere("squad.status = :status", { status: data.status });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("squad.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("squad.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`squad.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getDistinctSquadList(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadRepository.createQueryBuilder('squad');
            res = res.select(['id', 'name']);
            if (keyword) {
                res = res.orWhere("id LIKE :id", { id: `%${keyword}%` });
                res = res.orWhere("name LIKE :name", { name: `%${keyword}%` });
            }
            res = res
                .orderBy(`name`, 'DESC')
                .limit(100);
            return yield res
                .getRawMany();
        });
    }
    getSquad(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadRepository.createQueryBuilder('squad');
            res = res.leftJoinAndMapOne('squad.createdUser', user_entity_1.User, "createdUser", "squad.createdByUserId = createdUser.id");
            res = res.leftJoinAndMapMany('squad.squadUsers', squad_user_entity_1.SquadUser, "squadUsers", "squad.id = squadUsers.squadId");
            if (data && (data.id || data.name !== undefined || data.createdByUserId !== undefined || data.status !== undefined)) {
                if (data.id) {
                    res = res.andWhere("squad.id = :id", { id: data.id });
                }
                if (data.name !== undefined) {
                    res = res.andWhere("squad.name = :name", { name: data.name });
                }
                if (data.createdByUserId !== undefined) {
                    res = res.andWhere("squad.createdByUserId = :createdByUserId", { createdByUserId: data.createdByUserId });
                }
                if (data.status !== undefined) {
                    res = res.andWhere("squad.status = :status", { status: data.status });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteSquad(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadRepository.createQueryBuilder('squad')
                .delete()
                .from(squad_entity_1.Squad);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    cleanSquad() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadRepository.clear();
        });
    }
};
SquadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(squad_entity_1.Squad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SquadService);
exports.SquadService = SquadService;
//# sourceMappingURL=squad.service.js.map