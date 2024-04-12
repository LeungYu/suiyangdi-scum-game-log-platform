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
exports.SquadUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const squad_entity_1 = require("../../entity/squad.entity");
const squad_user_entity_1 = require("../../entity/squad-user.entity");
const user_entity_1 = require("../../entity/user.entity");
const user_login_entity_1 = require("../../entity/user-login.entity");
let SquadUserService = class SquadUserService {
    constructor(squadUserRepository) {
        this.squadUserRepository = squadUserRepository;
    }
    saveSquadUser(squadId, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadUserRepository.save(new squad_user_entity_1.SquadUser(squadId, userId, role));
        });
    }
    updateSquadUser(squadUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.squadUserRepository
                .createQueryBuilder()
                .update(squad_user_entity_1.SquadUser)
                .set(squadUser);
            if (squadUser.id !== undefined) {
                res = res.andWhere('id = :id', {
                    id: squadUser.id,
                });
            }
            if (squadUser.userId !== undefined) {
                res = res.andWhere('userId = :userId', {
                    userId: squadUser.userId,
                });
            }
            return yield res.execute();
        });
    }
    getSquadUserList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadUserRepository.createQueryBuilder('squadUser');
            res = res.leftJoinAndMapOne('squadUser.user', user_entity_1.User, "user", "squadUser.userId = user.id");
            res = res.leftJoinAndMapMany('squadUser.loginInfo', user_login_entity_1.UserLogin, "loginInfo", "user.steamId = loginInfo.steamId");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadUser.squadId = :squadId", { squadId: data.squadId });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadUser.userId = :userId", { userId: data.userId });
            }
            if (data.role !== undefined) {
                res = res.andWhere("squadUser.role = :role", { role: data.role });
            }
            return yield res
                .orderBy(`squadUser.createdTimeStamp`, 'ASC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadUserListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadUserRepository.createQueryBuilder('squadUser');
            res = res.leftJoinAndMapOne('squadUser.userInfo', user_entity_1.User, "userInfo", "squadUser.userId = userInfo.id");
            res = res.leftJoinAndMapOne('squadUser.squadInfo', squad_entity_1.Squad, "squadInfo", "squadUser.squadId = squadInfo.id");
            if (data.squadId !== undefined) {
                res = res.andWhere("squadUser.squadId like :squadId", { squadId: `%${data.squadId}%` });
            }
            if (data.userId !== undefined) {
                res = res.andWhere("squadUser.userId like :userId", { userId: `%${data.userId}%` });
            }
            if (data.role !== undefined) {
                res = res.andWhere("squadUser.role like :role", { role: `%${data.role}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("squadUser.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("squadUser.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`squadUser.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getSquadUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadUserRepository.createQueryBuilder('squadUser');
            res = res.leftJoinAndMapOne('squadUser.userInfo', user_entity_1.User, "userInfo", "squadUser.userId = userInfo.id");
            res = res.leftJoinAndMapOne('squadUser.squadInfo', squad_entity_1.Squad, "squadInfo", "squadUser.squadId = squadInfo.id");
            if (data && (data.id || data.squadId !== undefined || data.userId !== undefined || data.role !== undefined)) {
                if (data.id) {
                    res = res.andWhere("squadUser.id = :id", { id: data.id });
                }
                if (data.squadId !== undefined) {
                    res = res.andWhere("squadUser.squadId = :squadId", { squadId: data.squadId });
                }
                if (data.userId !== undefined) {
                    res = res.andWhere("squadUser.userId = :userId", { userId: data.userId });
                }
                if (data.role !== undefined) {
                    res = res.andWhere("squadUser.role = :role", { role: data.role });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteSquadUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.squadUserRepository.createQueryBuilder('squadUser')
                .delete()
                .from(squad_user_entity_1.SquadUser);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.squadId) {
                res = res.andWhere("squadId = :squadId", { squadId: data.squadId });
            }
            if (data.userId) {
                res = res.andWhere("userId = :userId", { userId: data.userId });
            }
            return yield res
                .execute();
        });
    }
    cleanSquadUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.squadUserRepository.clear();
        });
    }
};
SquadUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(squad_user_entity_1.SquadUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SquadUserService);
exports.SquadUserService = SquadUserService;
//# sourceMappingURL=squad-user.service.js.map