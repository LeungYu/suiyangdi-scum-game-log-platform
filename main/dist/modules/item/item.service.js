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
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_entity_1 = require("../../entity/item.entity");
const typeorm_2 = require("typeorm");
const item_types_entity_1 = require("../../entity/item-types.entity");
let ItemService = class ItemService {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    saveItem(name, type, price, configType, isBlock, commands, imgSrc, sales, configs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.itemRepository.save(new item_entity_1.Item(name, type, price, configType, isBlock, commands, imgSrc, sales, configs));
        });
    }
    updateItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in item) {
                if (item[key] === undefined) {
                    delete item[key];
                }
            }
            let res = this.itemRepository
                .createQueryBuilder()
                .update(item_entity_1.Item)
                .set(item);
            res = res.andWhere('id = :id', {
                id: item.id,
            });
            return yield res.execute();
        });
    }
    updateAllItemPrice(action, param) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.itemRepository
                .createQueryBuilder()
                .update(item_entity_1.Item)
                .set({ price: () => `price ${action} ${param}` });
            res = res.andWhere('type NOT LIKE :type', { type: '%special-%' });
            return yield res.execute();
        });
    }
    updateItemPrice(itemId, action, param) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.itemRepository
                .createQueryBuilder()
                .update(item_entity_1.Item)
                .set({ price: () => `price ${action} ${param}` });
            res = res.andWhere('id = :id', {
                id: itemId,
            });
            return yield res.execute();
        });
    }
    updateAllItemType(originItemType, newItemType) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.itemRepository
                .createQueryBuilder()
                .update(item_entity_1.Item)
                .set({
                type: newItemType
            });
            res = res.andWhere('type = :type', {
                type: originItemType,
            });
            return yield res.execute();
        });
    }
    updateItemSales(id, change) {
        return __awaiter(this, void 0, void 0, function* () {
            let resRead = yield this.itemRepository
                .createQueryBuilder()
                .setLock("pessimistic_write")
                .useTransaction(true)
                .where('id = :id', {
                id,
            })
                .getOne();
            let resWrite = this.itemRepository
                .createQueryBuilder()
                .setLock("pessimistic_read")
                .setLock("pessimistic_write")
                .useTransaction(true)
                .update(item_entity_1.Item)
                .set({ sales: resRead.sales + change })
                .where('id = :id', {
                id,
            });
            return yield resWrite.execute();
        });
    }
    getItemList(page, data, noBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemRepository.createQueryBuilder('item');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.name) {
                res = res.andWhere("name = :name", { name: data.name });
            }
            if (data.nameLike) {
                res = res.andWhere("name LIKE :nameLike", { nameLike: `%${data.nameLike}%` });
            }
            if (data.type !== undefined) {
                res = data.type === null ? res.andWhere("item.type is :type", { type: data.type }) : res.andWhere("item.type = :type", { type: data.type });
            }
            if (data.price !== undefined) {
                res = res.andWhere("price = :price", { price: data.price });
            }
            if (data.commands) {
                res = res.andWhere("commands = :commands", { commands: data.commands });
            }
            if (data.imgSrc) {
                res = res.andWhere("imgSrc = :imgSrc", { imgSrc: data.imgSrc });
            }
            if (data.sales !== undefined) {
                res = res.andWhere("sales = :sales", { sales: data.sales });
            }
            if (data.configs) {
                res = res.andWhere("configs = :configs", { configs: data.configs });
            }
            if (noBlock === true) {
                res = res.andWhere("isBlock != true");
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getItemListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemRepository.createQueryBuilder('item');
            res = res.leftJoinAndMapOne('item.itemType', item_types_entity_1.ItemTypes, "itemType", "item.type = itemType.name");
            if (data.name) {
                res = res.andWhere("item.name like :name", { name: `%${data.name}%` });
            }
            if (data.type !== undefined) {
                res = data.type === null ? res.andWhere("item.type is :type", { type: data.type }) : res.andWhere("item.type = :type", { type: data.type });
            }
            return yield res
                .orderBy(`item.createdTimeStamp`, 'DESC')
                .orderBy(`item.topTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getItem(data, noBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemRepository.createQueryBuilder('item');
            if (data && (data.id || data.name || data.type || data.price || data.commands || data.imgSrc || data.sales)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.name) {
                    res = res.andWhere("name = :name", { name: data.name });
                }
                if (data.type !== undefined) {
                    res = data.type === null ? res.andWhere("item.type is :type", { type: data.type }) : res.andWhere("item.type = :type", { type: data.type });
                }
                if (data.price !== undefined) {
                    res = res.andWhere("price = :price", { price: data.price });
                }
                if (data.commands) {
                    res = res.andWhere("commands = :commands", { commands: data.commands });
                }
                if (data.imgSrc) {
                    res = res.andWhere("imgSrc = :imgSrc", { imgSrc: data.imgSrc });
                }
                if (data.sales !== undefined) {
                    res = res.andWhere("sales = :sales", { sales: data.sales });
                }
                if (data.configs) {
                    res = res.andWhere("configs = :configs", { configs: data.configs });
                }
                if (noBlock === true) {
                    res = res.andWhere("isBlock != true");
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemRepository.createQueryBuilder('item')
                .delete()
                .from(item_entity_1.Item);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    exportItemsList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.itemRepository.createQueryBuilder('item');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .orderBy(`topTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemService);
exports.ItemService = ItemService;
//# sourceMappingURL=item.service.js.map