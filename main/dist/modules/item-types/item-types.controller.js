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
exports.ItemTypesController = void 0;
const common_1 = require("@nestjs/common");
const item_types_1 = require("../../dto/item-types");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const item_types_service_1 = require("./item-types.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
let ItemTypesController = class ItemTypesController {
    constructor(itemTypesService) {
        this.itemTypesService = itemTypesService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resListItemTypes = yield this.itemTypesService.getItemTypesList(page, query);
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resListItemTypes, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listChildren(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resListChildren = yield this.itemTypesService.listChildren(query);
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resListChildren));
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
                const resItemTypes = yield this.itemTypesService.getItemTypes(query);
                if (resItemTypes && resItemTypes.id) {
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resItemTypes));
                }
                else {
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, '找不到该商品类型'));
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
    (0, common_1.Get)('/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        item_types_1.ListItemTypesDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/listChildren'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_types_1.ListChildrenItemTypesDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesController.prototype, "listChildren", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_types_1.ItemTypesInfoDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesController.prototype, "info", null);
ItemTypesController = __decorate([
    (0, common_1.Controller)('/itemTypes'),
    __metadata("design:paramtypes", [item_types_service_1.ItemTypesService])
], ItemTypesController);
exports.ItemTypesController = ItemTypesController;
//# sourceMappingURL=item-types.controller.js.map