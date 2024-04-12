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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const common_1 = require("@nestjs/common");
const item_1 = require("../../dto/item");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const item_service_1 = require("./item.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
let ItemController = class ItemController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    listItemInfoById(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryArray = [];
                body.itemIds.forEach((itemId) => {
                    queryArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resGetItem = this.itemService.getItem({ id: itemId }, true);
                            resolve(resGetItem || null);
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(itemId, e.toString());
                            resolve(null);
                        }
                    })));
                });
                const [...resGetItems] = yield Promise.all(queryArray);
                const result = {};
                for (let resGetItem of resGetItems) {
                    if (resGetItem !== null && resGetItem !== undefined) {
                        const { id } = resGetItem, item = __rest(resGetItem, ["id"]);
                        result[id] = item;
                    }
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, result, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                let resListItem = yield this.itemService.getItemList(page, {
                    id: query.id,
                    name: query.name,
                    nameLike: query.nameLike,
                    type: query.type,
                    price: query.price,
                    commands: query.commands,
                    imgSrc: query.imgSrc,
                    sales: query.sales,
                    configs: query.configs,
                }, true);
                resListItem = resListItem.map((T) => {
                    let configs;
                    try {
                        configs = JSON.stringify(T.configs);
                    }
                    catch (e) { }
                    delete T.configs;
                    if (configs && configs.purchaseLimit && configs.purchaseLimit.time) {
                        T.purchaseLimitTime = configs.purchaseLimit.time;
                    }
                    if (configs && configs.purchaseLimit && configs.purchaseLimit.each) {
                        T.purchaseLimitEach = configs.purchaseLimit.each;
                    }
                    return T;
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resListItem, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    info(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resItem = yield this.itemService.getItem({
                    id: query.id,
                    name: query.name,
                    type: query.type,
                    price: query.price,
                    commands: query.commands,
                    imgSrc: query.imgSrc,
                    sales: query.sales,
                    configs: query.configs,
                });
                if (resItem && resItem.id) {
                    let configs;
                    try {
                        configs = JSON.stringify(resItem.configs);
                    }
                    catch (e) { }
                    delete resItem.configs;
                    if (configs && configs.purchaseLimit && configs.purchaseLimit.time) {
                        resItem.purchaseLimitTime = configs.purchaseLimit.time;
                    }
                    if (configs && configs.purchaseLimit && configs.purchaseLimit.each) {
                        resItem.purchaseLimitEach = configs.purchaseLimit.each;
                    }
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resItem));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该商品'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Post)('/listItemInfoById'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_1.ListItemInfoByIdDto, Object]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "listItemInfoById", null);
__decorate([
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        item_1.ListItemDto, Object]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_1.ItemInfoDto, Object]),
    __metadata("design:returntype", Promise)
], ItemController.prototype, "info", null);
ItemController = __decorate([
    (0, common_1.Controller)('/item'),
    __metadata("design:paramtypes", [item_service_1.ItemService])
], ItemController);
exports.ItemController = ItemController;
//# sourceMappingURL=item.controller.js.map