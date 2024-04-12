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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entity/user.entity");
const admin_entity_1 = require("../../entity/admin.entity");
const typeorm_2 = require("typeorm");
let AdminService = class AdminService {
    constructor(userRepository, adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }
    saveAdmin(userId, isSysAdmin, isReadOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminRepository.save(new admin_entity_1.Admin(userId, isSysAdmin, isReadOnly));
        });
    }
    updateAdmin(userId, isSysAdmin, isReadOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.adminRepository.createQueryBuilder('admin')
                .update(admin_entity_1.Admin)
                .set({ userId, isSysAdmin, isReadOnly });
            res = res.andWhere("userId = :userId", { userId });
            return yield res.execute();
        });
    }
    getAdminList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminRepository.createQueryBuilder('admin');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminRepository.createQueryBuilder('admin');
            res = res.where("userId = :userId", { userId: data.userId });
            return yield res
                .getOne();
        });
    }
    deleteAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminRepository.createQueryBuilder('admin')
                .delete()
                .from(admin_entity_1.Admin);
            res = res.andWhere("userId = :userId", { userId: data.userId });
            return yield res
                .execute();
        });
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map