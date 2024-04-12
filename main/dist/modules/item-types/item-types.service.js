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
exports.ItemTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_types_entity_1 = require("../../entity/item-types.entity");
const typeorm_2 = require("typeorm");
let ItemTypesService = class ItemTypesService {
    constructor(itemTypesRepository) {
        this.itemTypesRepository = itemTypesRepository;
    }
    saveItem(name, cnName, canBeDeleted, fatherItemTypeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.itemTypesRepository.save(new item_types_entity_1.ItemTypes(name, cnName, canBeDeleted, fatherItemTypeId));
        });
    }
    updateItemTypes(itemTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in itemTypes) {
                if (itemTypes[key] === undefined) {
                    delete itemTypes[key];
                }
            }
            let res = this.itemTypesRepository
                .createQueryBuilder()
                .update(item_types_entity_1.ItemTypes)
                .set(itemTypes);
            res = res.andWhere('id = :id', {
                id: itemTypes.id,
            });
            return yield res.execute();
        });
    }
    listAllowFather() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types');
            res = res.andWhere("fatherItemTypeId IS NULL", {});
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .getMany();
        });
    }
    listChildren(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types');
            res = res.andWhere("fatherItemTypeId = :fatherItemTypeId", { fatherItemTypeId: data.fatherItemTypeId });
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .getMany();
        });
    }
    getItemTypesList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.name) {
                res = res.andWhere("name = :name", { name: data.name });
            }
            if (data.cnName) {
                res = res.andWhere("cnName = :cnName", { cnName: data.cnName });
            }
            if (data.fatherItemTypeId) {
                res = res.andWhere("fatherItemTypeId = :fatherItemTypeId", { fatherItemTypeId: data.fatherItemTypeId });
            }
            if (data.canBeDeleted !== undefined) {
                res = res.andWhere("canBeDeleted = :canBeDeleted", { canBeDeleted: data.canBeDeleted === 'true' });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getItemTypesListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('itemTypes');
            res = res.leftJoinAndMapOne('itemTypes.fatheritemTypeInfo', item_types_entity_1.ItemTypes, "fatheritemTypeInfo", "itemTypes.fatherItemTypeId = fatheritemTypeInfo.id");
            if (data.name) {
                res = res.andWhere("itemTypes.name like :name", { name: `%${data.name}%` });
            }
            if (data.cnName) {
                res = res.andWhere("itemTypes.cnName like :cnName", { cnName: `%${data.cnName}%` });
            }
            if (data.fatherItemTypeId) {
                res = res.andWhere("itemTypes.fatherItemTypeId like :fatherItemTypeId", { fatherItemTypeId: `%${data.fatherItemTypeId}%` });
            }
            if (data.canBeDeleted !== undefined) {
                res = res.andWhere("itemTypes.canBeDeleted = :canBeDeleted", { canBeDeleted: data.canBeDeleted === 'true' });
            }
            return yield res
                .orderBy(`itemTypes.createdTimeStamp`, 'DESC')
                .orderBy(`itemTypes.topTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getItemTypes(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types');
            if (data && (data.id || data.name || data.cnName)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.name) {
                    res = res.andWhere("name = :name", { name: data.name });
                }
                if (data.cnName) {
                    res = res.andWhere("cnName = :cnName", { cnName: data.cnName });
                }
                if (data.fatherItemTypeId) {
                    res = res.andWhere("fatherItemTypeId = :fatherItemTypeId", { fatherItemTypeId: data.fatherItemTypeId });
                }
                if (data.canBeDeleted !== undefined) {
                    res = res.andWhere("canBeDeleted = :canBeDeleted", { canBeDeleted: data.canBeDeleted === 'true' });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteItemTypes(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types')
                .delete()
                .from(item_types_entity_1.ItemTypes);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    exportItemTypesList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemTypesRepository.createQueryBuilder('item-types');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
ItemTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_types_entity_1.ItemTypes)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemTypesService);
exports.ItemTypesService = ItemTypesService;
//# sourceMappingURL=item-types.service.js.map