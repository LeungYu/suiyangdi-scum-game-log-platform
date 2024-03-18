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
exports.UserLoginService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_login_entity_1 = require("../../entity/user-login.entity");
const typeorm_2 = require("typeorm");
const moment = require("moment");
let UserLoginService = class UserLoginService {
    constructor(userLoginRepository) {
        this.userLoginRepository = userLoginRepository;
    }
    saveUserLogin(scumId, steamId, sessionId, loginIp, status, loginTimeStamp, logoutTimeStamp, otherConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userLoginRepository.save(new user_login_entity_1.UserLogin(scumId, steamId, sessionId, loginIp, status, loginTimeStamp, logoutTimeStamp, otherConfig));
        });
    }
    updateUserLogin(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userLoginRepository
                .createQueryBuilder()
                .setLock("pessimistic_read")
                .setLock('pessimistic_write')
                .useTransaction(true)
                .update(user_login_entity_1.UserLogin)
                .set(userLogin);
            if (userLogin.id) {
                res = res.andWhere('id = :id', {
                    id: userLogin.id,
                });
            }
            return yield res.execute();
        });
    }
    getLoginUserList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            res = res.andWhere('status = :status', { status: 'login' });
            res = res.andWhere('loginTimeStamp >= :loginTimeStamp', { loginTimeStamp: moment().startOf('day').valueOf() });
            return yield res
                .orderBy(`loginTimeStamp`, 'DESC')
                .getMany();
        });
    }
    getLoginUserListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('userLogin');
            if (data.steamId) {
                res = res.andWhere("userLogin.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.scumId) {
                res = res.andWhere("userLogin.scumId like :scumId", { scumId: `%${data.scumId}%` });
            }
            if (data.userName) {
                res = res.andWhere("userLoginUser.userName like :userName", { userName: `%${data.userName}%` });
            }
            if (data.type) {
                res = res.andWhere("userLogin.status = :type", { type: data.type });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("userLogin.loginTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("userLogin.loginTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`userLogin.logoutTimeStamp`, 'DESC')
                .orderBy(`userLogin.loginTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getUserLoginList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.scumId) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
            }
            if (data.loginIp) {
                res = res.andWhere("loginIp = :loginIp", { loginIp: data.loginIp });
            }
            if (data.status) {
                res = res.andWhere('status = :status', { status: data.status, });
            }
            if (data.loginTimeStamp) {
                res = res.andWhere('loginTimeStamp = :loginTimeStamp', { loginTimeStamp: data.loginTimeStamp, });
            }
            if (data.logoutTimeStamp) {
                res = res.andWhere('logoutTimeStamp = :logoutTimeStamp', { logoutTimeStamp: data.logoutTimeStamp, });
            }
            return yield res
                .orderBy(`logoutTimeStamp`, 'DESC')
                .orderBy(`loginTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getDistinctUserLogin(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            res = res.select(['steamId', 'scumId', 'loginTimeStamp']);
            if (keyword) {
                res = res.where("steamId LIKE :steamId", { steamId: `%${keyword}%` });
                res = res.orWhere("scumId LIKE :scumId", { scumId: `%${keyword}%` });
            }
            res = res.addGroupBy('steamId');
            res = res.addGroupBy('scumId');
            res = res.addGroupBy('loginTimeStamp');
            res = res
                .orderBy(`loginTimeStamp`, 'DESC');
            return yield res
                .getRawOne();
        });
    }
    getDistinctUserLoginList(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            res = res.select(['steamId', 'scumId']);
            if (keyword) {
                res = res.where("steamId LIKE :steamId", { steamId: `%${keyword}%` });
                res = res.orWhere("scumId LIKE :scumId", { scumId: `%${keyword}%` });
            }
            res = res.addGroupBy('steamId');
            res = res.addGroupBy('scumId');
            res = res
                .orderBy(`scumId`, 'DESC')
                .limit(100);
            return yield res
                .getRawMany();
        });
    }
    getUserLoginListBySteamId(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            return yield res
                .orderBy(`loginTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getLatestUserLoginListBySteamId(steamId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login');
            res = res.andWhere("steamId = :steamId", { steamId });
            return yield res
                .orderBy(`loginTimeStamp`, 'DESC')
                .getOne();
        });
    }
    getUserLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository
                .createQueryBuilder('user-login')
                .setLock('pessimistic_write')
                .useTransaction(true);
            if (data && (data.id || data.scumId || data.steamId || data.sessionId || data.loginIp || data.status || data.loginTimeStamp || data.logoutTimeStamp)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.scumId) {
                    res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
                }
                if (data.steamId) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.sessionId !== undefined) {
                    res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
                }
                if (data.loginIp) {
                    res = res.andWhere("loginIp = :loginIp", { loginIp: data.loginIp });
                }
                if (data.status) {
                    res = res.andWhere('status = :status', { status: data.status, });
                }
                if (data.loginTimeStamp) {
                    res = res.andWhere('loginTimeStamp = :loginTimeStamp', { loginTimeStamp: data.loginTimeStamp, });
                }
                if (data.logoutTimeStamp) {
                    res = res.andWhere('logoutTimeStamp = :logoutTimeStamp', { logoutTimeStamp: data.logoutTimeStamp, });
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
            let resLoginTimeStamp = yield this.userLoginRepository
                .createQueryBuilder('user-login')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`loginTimeStamp`, 'DESC')
                .getOne();
            let resLogoutTimeStamp = yield this.userLoginRepository
                .createQueryBuilder('user-login')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`logoutTimeStamp`, 'DESC')
                .getOne();
            return ((resLoginTimeStamp && resLoginTimeStamp.loginTimeStamp) || (resLogoutTimeStamp && resLogoutTimeStamp.logoutTimeStamp)) ? (resLoginTimeStamp.loginTimeStamp > resLogoutTimeStamp.logoutTimeStamp ? resLoginTimeStamp.loginTimeStamp : resLogoutTimeStamp.logoutTimeStamp) : null;
        });
    }
    deleteUserLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login')
                .delete()
                .from(user_login_entity_1.UserLogin);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.userId) {
                res = res.andWhere("userId = :userId", { userId: data.userId });
            }
            if (data.scumId) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            return yield res
                .execute();
        });
    }
    limitAllUserLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLoginRepository.createQueryBuilder('user-login')
                .delete()
                .from(user_login_entity_1.UserLogin);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from user_login ORDER BY loginTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    cleanAllUserLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userLoginRepository.clear();
        });
    }
};
UserLoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_login_entity_1.UserLogin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserLoginService);
exports.UserLoginService = UserLoginService;
//# sourceMappingURL=user-login.service.js.map