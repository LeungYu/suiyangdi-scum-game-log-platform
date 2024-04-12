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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entity/user.entity");
const typeorm_2 = require("typeorm");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const admin_entity_1 = require("../../entity/admin.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    saveUser(email, phone, steamId, userName, hasBoughtWelcomepack, buyWelcomeDidiCarTime, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.save(new user_entity_1.User(email, phone, steamId, userName, hasBoughtWelcomepack, buyWelcomeDidiCarTime, status));
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userRepository
                .createQueryBuilder()
                .update(user_entity_1.User)
                .set(user);
            if (user.id) {
                res = res.andWhere('id = :id', {
                    id: user.id,
                });
            }
            return yield res.execute();
        });
    }
    getUserList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user');
            res = res.leftJoinAndMapOne('user.userDollar', user_dollar_entity_1.UserDollar, "userDollar", "user.id = userDollar.userId");
            if (data.userId) {
                res = res.andWhere("user.id = :id", { id: data.userId });
            }
            if (data.userName) {
                res = res.andWhere("user.userName = :userName", { userName: data.userName });
            }
            if (data.email) {
                res = res.andWhere("user.email = :email", { email: data.email });
            }
            if (data.phone) {
                res = res.andWhere("user.phone = :phone", { phone: data.phone });
            }
            if (data.steamId) {
                res = res.andWhere("user.steamId = :steamId", { steamId: data.steamId });
            }
            if (data.status) {
                res = res.andWhere("user.status = :status", { status: data.status });
            }
            if (data.hasBoughtWelcomepack !== undefined) {
                res = res.andWhere("user.hasBoughtWelcomepack = :hasBoughtWelcomepack", { hasBoughtWelcomepack: data.hasBoughtWelcomepack === 'true' });
            }
            if (data.buyWelcomeDidiCarTime !== undefined) {
                res = res.andWhere("user.buyWelcomeDidiCarTime = :buyWelcomeDidiCarTime", { buyWelcomeDidiCarTime: data.buyWelcomeDidiCarTime === 'true' });
            }
            if (data.level !== undefined) {
                res = res.andWhere("userDollar.level = :level", { level: data.level });
            }
            return yield res
                .orderBy(`user.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getDistinctUserList(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user-login');
            res = res.select(['id', 'userName', 'steamId']);
            if (keyword) {
                res = res.orWhere("id LIKE :id", { id: `%${keyword}%` });
                res = res.orWhere("userName LIKE :userName", { userName: `%${keyword}%` });
                res = res.orWhere("steamId LIKE :steamId", { steamId: `%${keyword}%` });
            }
            res = res
                .orderBy(`userName`, 'DESC')
                .limit(100);
            return yield res
                .getRawMany();
        });
    }
    getUserListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user');
            res = res.leftJoinAndMapOne('user.userDollar', user_dollar_entity_1.UserDollar, "userDollar", "user.id = userDollar.userId");
            res = res.leftJoinAndMapOne('user.userAdmin', admin_entity_1.Admin, "userAdmin", "user.id = userAdmin.userId");
            if (data.id) {
                res = res.andWhere("user.id like :id", { id: `%${data.id}%` });
            }
            if (data.userName) {
                res = res.andWhere("user.userName like :userName", { userName: `%${data.userName}%` });
            }
            if (data.email) {
                res = res.andWhere("user.email like :email", { email: `%${data.email}%` });
            }
            if (data.phone) {
                res = res.andWhere("user.phone like :phone", { phone: `%${data.phone}%` });
            }
            if (data.steamId) {
                res = res.andWhere("user.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.status) {
                res = res.andWhere("user.status = :status", { status: data.status });
            }
            if (data.level !== undefined) {
                res = res.andWhere("userDollar.level = :level", { level: data.level });
            }
            if (data.isOnline !== undefined) {
                if (data.isOnline === true) {
                    res = res.andWhere("user.lastLoginTimeStamp is NOT NULL AND user.lastLogoutTimeStamp is NULL");
                }
                else {
                    res = res.andWhere("((user.lastLoginTimeStamp is NOT NULL AND user.lastLogoutTimeStamp is NOT NULL) OR (user.lastLoginTimeStamp is NULL AND user.lastLogoutTimeStamp is NULL))");
                }
            }
            return yield res
                .orderBy(`user.createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user');
            if (data && (data.userId || data.userName || data.email || data.phone || data.steamId)) {
                res = res.leftJoinAndMapOne('user.userDollar', user_dollar_entity_1.UserDollar, "userDollar", "user.id = userDollar.userId");
                if (data.userId) {
                    res = res.andWhere("user.id = :id", { id: data.userId });
                }
                if (data.userName) {
                    res = res.andWhere("user.userName = :userName", { userName: data.userName });
                }
                if (data.email) {
                    res = res.andWhere("user.email = :email", { email: data.email });
                }
                if (data.phone) {
                    res = res.andWhere("user.phone = :phone", { phone: data.phone });
                }
                if (data.steamId) {
                    res = res.andWhere("user.steamId = :steamId", { steamId: data.steamId });
                }
                if (data.status) {
                    res = res.andWhere("user.status = :status", { status: data.status });
                }
                if (data.hasBoughtWelcomepack !== undefined) {
                    res = res.andWhere("user.hasBoughtWelcomepack = :hasBoughtWelcomepack", { hasBoughtWelcomepack: data.hasBoughtWelcomepack === 'true' });
                }
                if (data.buyWelcomeDidiCarTime !== undefined) {
                    res = res.andWhere("user.buyWelcomeDidiCarTime = :buyWelcomeDidiCarTime", { buyWelcomeDidiCarTime: data.buyWelcomeDidiCarTime === 'true' });
                }
                if (data.level !== undefined) {
                    res = res.andWhere("userDollar.level = :level", { level: data.level });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user')
                .delete()
                .from(user_entity_1.User);
            if (data.userId) {
                res = res.andWhere("user.id = :id", { id: data.userId });
            }
            if (data.userName) {
                res = res.andWhere("user.userName = :userName", { userName: data.userName });
            }
            if (data.email) {
                res = res.andWhere("user.email = :email", { email: data.email });
            }
            if (data.phone) {
                res = res.andWhere("user.phone = :phone", { phone: data.phone });
            }
            if (data.steamId) {
                res = res.andWhere("user.steamId = :steamId", { steamId: data.steamId });
            }
            if (data.status) {
                res = res.andWhere("user.status = :status", { status: data.status });
            }
            if (data.hasBoughtWelcomepack !== undefined) {
                res = res.andWhere("user.hasBoughtWelcomepack = :hasBoughtWelcomepack", { hasBoughtWelcomepack: data.hasBoughtWelcomepack === 'true' });
            }
            if (data.buyWelcomeDidiCarTime !== undefined) {
                res = res.andWhere("user.buyWelcomeDidiCarTime = :buyWelcomeDidiCarTime", { buyWelcomeDidiCarTime: data.buyWelcomeDidiCarTime === 'true' });
            }
            if (data.level !== undefined) {
                res = res.andWhere("user.level = :level", { level: data.level });
            }
            return yield res
                .execute();
        });
    }
    exportUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userRepository.createQueryBuilder('user');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map