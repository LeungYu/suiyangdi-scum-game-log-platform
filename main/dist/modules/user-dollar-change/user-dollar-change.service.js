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
exports.UserDollarChangeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entity/user.entity");
const user_dollar_change_entity_1 = require("../../entity/user-dollar-change.entity");
const typeorm_2 = require("typeorm");
let UserDollarChangeService = class UserDollarChangeService {
    constructor(userRepository, userDollarChangeRepository) {
        this.userRepository = userRepository;
        this.userDollarChangeRepository = userDollarChangeRepository;
    }
    saveUserDollarChanges(userDollarChanges) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let userDollarChange of userDollarChanges) {
                const element = new user_dollar_change_entity_1.UserDollarChange(userDollarChange === null || userDollarChange === void 0 ? void 0 : userDollarChange.userId, userDollarChange === null || userDollarChange === void 0 ? void 0 : userDollarChange.balance, userDollarChange === null || userDollarChange === void 0 ? void 0 : userDollarChange.reason);
                insertArray.push(element);
            }
            return yield this.userDollarChangeRepository.save(insertArray);
        });
    }
    saveUserDollarChange(userId, balance, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDollarChangeRepository.save(new user_dollar_change_entity_1.UserDollarChange(userId, balance, reason));
        });
    }
    getUserDollarChangeList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarChangeRepository.createQueryBuilder('user-dollar-change');
            if (data && data.userId) {
                res = res.where("userId = :userId", { userId: data.userId });
            }
            if (data && data.recent) {
                res = res.limit(data.recent);
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    updateUserDollarChange(userDollarChange) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userDollarChangeRepository
                .createQueryBuilder()
                .update(user_dollar_change_entity_1.UserDollarChange)
                .set(userDollarChange);
            res = res.andWhere('id = :id', {
                id: userDollarChange.id,
            });
            return yield res.execute();
        });
    }
    deleteUserDollarChange(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarChangeRepository.createQueryBuilder('user-dollar-change')
                .delete()
                .from(user_dollar_change_entity_1.UserDollarChange);
            res = res.andWhere("id = :id", { id: data.id });
            return yield res
                .execute();
        });
    }
    cleanUserDollarChange(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userDollarChangeRepository
                .createQueryBuilder('user-dollar-change')
                .delete()
                .from(user_dollar_change_entity_1.UserDollarChange);
            res = res.andWhere("userId = :userId", { userId });
            return yield res
                .execute();
        });
    }
    cleanAllDollarChange() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userDollarChangeRepository.clear();
        });
    }
};
UserDollarChangeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_dollar_change_entity_1.UserDollarChange)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserDollarChangeService);
exports.UserDollarChangeService = UserDollarChangeService;
//# sourceMappingURL=user-dollar-change.service.js.map