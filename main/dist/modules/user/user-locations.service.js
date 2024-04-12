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
exports.UserLocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_locations_entity_1 = require("../../entity/user-locations.entity");
const typeorm_2 = require("typeorm");
let UserLocationsService = class UserLocationsService {
    constructor(userLocationsRepository) {
        this.userLocationsRepository = userLocationsRepository;
    }
    saveUserLocations(userId, description, locations, configs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userLocationsRepository.save(new user_locations_entity_1.UserLocations(userId, description, locations, configs));
        });
    }
    updateUserLocations(userLocations) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.userLocationsRepository
                .createQueryBuilder()
                .update(user_locations_entity_1.UserLocations)
                .set(userLocations);
            if (userLocations.id) {
                res = res.andWhere('id = :id', {
                    id: userLocations.id,
                });
            }
            return yield res.execute();
        });
    }
    getUserLocationsList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLocationsRepository.createQueryBuilder('user-locations');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.userId) {
                res = res.andWhere("userId = :userId", { userId: data.userId });
            }
            if (data.description) {
                res = res.andWhere("description = :description", { description: data.description });
            }
            if (data.locations) {
                res = res.andWhere("locations = :locations", { locations: data.locations });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getUserLocations(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLocationsRepository.createQueryBuilder('user-locations');
            if (data && (data.id || data.userId || data.description || data.locations)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.userId) {
                    res = res.andWhere("userId = :userId", { userId: data.userId });
                }
                if (data.description) {
                    res = res.andWhere("description = :description", { description: data.description });
                }
                if (data.locations) {
                    res = res.andWhere("locations = :locations", { locations: data.locations });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteUserLocations(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLocationsRepository.createQueryBuilder('user-locations')
                .delete()
                .from(user_locations_entity_1.UserLocations);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.userId) {
                res = res.andWhere("userId = :userId", { userId: data.userId });
            }
            if (data.description) {
                res = res.andWhere("description = :description", { description: data.description });
            }
            if (data.locations) {
                res = res.andWhere("locations = :locations", { locations: data.locations });
            }
            return yield res
                .execute();
        });
    }
    exportUserLocationsList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.userLocationsRepository.createQueryBuilder('user_locations');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
UserLocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_locations_entity_1.UserLocations)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserLocationsService);
exports.UserLocationsService = UserLocationsService;
//# sourceMappingURL=user-locations.service.js.map