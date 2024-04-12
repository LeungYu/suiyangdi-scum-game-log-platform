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
exports.UserPasswordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_password_entity_1 = require("../../entity/user-password.entity");
const typeorm_2 = require("typeorm");
let UserPasswordService = class UserPasswordService {
    constructor(userPasswordRepository) {
        this.userPasswordRepository = userPasswordRepository;
    }
    getUserPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userPasswordRepository.createQueryBuilder('user-password');
            res = res.where("userId = :userId", { userId: userId });
            return yield res
                .getOne();
        });
    }
    saveUserPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userPasswordRepository.save(new user_password_entity_1.UserPassword(userId, password));
        });
    }
    updateUserPassword(userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userPasswordRepository
                .createQueryBuilder()
                .update(user_password_entity_1.UserPassword)
                .set(userPassword);
            if (userPassword.id) {
                res = res.andWhere('id = :id', {
                    id: userPassword.id,
                });
            }
            if (userPassword.userId) {
                res = res.andWhere('userId = :userId', {
                    userId: userPassword.userId,
                });
            }
            return yield res.execute();
        });
    }
    deleteUserPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userPasswordRepository.createQueryBuilder('user-password')
                .delete()
                .from(user_password_entity_1.UserPassword);
            res = res.andWhere("userId = :userId", { userId: data.userId });
            return yield res
                .execute();
        });
    }
    exportUserPasswordList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userPasswordRepository.createQueryBuilder('user_password');
            return yield res
                .orderBy(`updateTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
UserPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_password_entity_1.UserPassword)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserPasswordService);
exports.UserPasswordService = UserPasswordService;
//# sourceMappingURL=user-password.service.js.map