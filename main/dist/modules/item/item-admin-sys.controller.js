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
exports.ItemAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const item_admin_sys_1 = require("../../dto/item-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const item_service_1 = require("./item.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
const csvParser = require("csv-parser");
const stream_1 = require("stream");
const mapActions = {
    'plus': '+',
    'minus': '-',
    'multiple': '*',
    'divide': '/',
};
let ItemAdminSysController = class ItemAdminSysController {
    constructor(itemService) {
        this.itemService = itemService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                let resListItem = yield this.itemService.getItemListLike(page, {
                    name: query.name,
                    type: query.type === 'null' ? null : query.type,
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
                });
                if (resItem && resItem.id) {
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
    add(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resSaveItem = yield this.itemService.saveItem(body.name, body.type === 'null' ? null : body.type, body.price, body.configType, body.isBlock, body.commands, body.imgSrc, body.sales, body.configs);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveItem, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    update(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resUpdateItem = yield this.itemService.updateItem({
                    id: body.id,
                    name: body.name,
                    type: body.type === 'null' ? null : body.type,
                    price: body.price,
                    configType: body.configType,
                    isBlock: body.isBlock,
                    commands: body.commands,
                    imgSrc: body.imgSrc,
                    sales: body.sales,
                    configs: body.configs,
                    topTimeStamp: body.topTimeStamp,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.itemService.getItem({ id: body.id }), ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateAllTeleport(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resAllItemList = yield this.itemService.getItemList({
                    pageNum: 0,
                    pageSize: 99999,
                }, {});
                const updateAllItemPromiseArray = [];
                for (let item of resAllItemList[0].filter(T => !(T.type && T.type.startsWith('special-')))) {
                    updateAllItemPromiseArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const configs = JSON.parse(item.configs);
                            configs.isTeleport = body.isTeleport;
                            const resUpdateItem = yield this.itemService.updateItem({
                                id: item.id,
                                configs: JSON.stringify(configs),
                            });
                            resolve({ itemId: item.id, result: true });
                        }
                        catch (e) {
                            resolve({ itemId: item.id, result: false, reason: e.toString() });
                        }
                    })));
                }
                const result = yield Promise.all(updateAllItemPromiseArray);
                (0, morgan_log_1.logBussiness)({ error: result.filter(T => T.result === false) });
                return res.json((0, response_builder_1.responseBuilder)(result.find(T => T.result === false) !== undefined ? response_builder_1.ResponseStatusCode.INTERNAL_ERROR : response_builder_1.ResponseStatusCode.OK, {}, result.find(T => T.result === false) !== undefined ? `已操作，其中有${result.filter(T => T.result === false).length}个商品修改失败` : '批量修改成功(不包括类型为special-开头的特殊商品)'));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateItemAllPrice(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resUpdateAllItemPrice = yield this.itemService.updateAllItemPrice(mapActions[body.action], body.param);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateItemsPrice(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let results = {};
                const processUpdateItemsPriceFunctionArray = [];
                body.ids.forEach((itemId) => {
                    processUpdateItemsPriceFunctionArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resGetItem = yield this.itemService.getItem({ id: itemId });
                            if (resGetItem && resGetItem.id) {
                                yield this.itemService.updateItemPrice(itemId, mapActions[body.action], body.param);
                                resolve({ status: true, itemId });
                            }
                            else {
                                resolve({ status: false, itemId });
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(itemId, e.toString());
                            resolve({ status: false, itemId });
                        }
                    })));
                });
                const [...resProcessUpdateItemsPriceFunctionArray] = yield Promise.all(processUpdateItemsPriceFunctionArray);
                results = {
                    success: resProcessUpdateItemsPriceFunctionArray.filter(T => T.status === true).length,
                    fail: resProcessUpdateItemsPriceFunctionArray.filter(T => T.status === false).length,
                    failIds: resProcessUpdateItemsPriceFunctionArray.filter(T => T.status === false).map(T => T.itemId),
                };
                let adminRecordDescription = `批量更新所有商品的价格(行为:${body.action} 数值: ${body.param} ID:${body.ids.join(',')})`;
                if (adminRecordDescription.length >= 200) {
                    adminRecordDescription = adminRecordDescription.substring(0, 200) + '...';
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, results, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    delete(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resDeleteItem = yield this.itemService.deleteItem({
                    id: query.id,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    deleteItems(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let results = {};
                const processDeleteItemsFunctionArray = [];
                body.ids.forEach((itemId) => {
                    processDeleteItemsFunctionArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resGetItem = yield this.itemService.getItem({ id: itemId });
                            if (resGetItem && resGetItem.id && !(resGetItem.type && resGetItem.type.startsWith('special-'))) {
                                yield this.itemService.deleteItem({ id: itemId });
                                resolve({ status: true, itemId });
                            }
                            else {
                                resolve({ status: false, itemId });
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(itemId, e.toString());
                            resolve({ status: false, itemId });
                        }
                    })));
                });
                const [...resProcessDeleteItemsFunctionArray] = yield Promise.all(processDeleteItemsFunctionArray);
                results = {
                    success: resProcessDeleteItemsFunctionArray.filter(T => T.status === true).length,
                    fail: resProcessDeleteItemsFunctionArray.filter(T => T.status === false).length,
                    failIds: resProcessDeleteItemsFunctionArray.filter(T => T.status === false).map(T => T.itemId),
                };
                let adminRecordDescription = `批量删除商品(ID:${body.ids.join(',')})`;
                if (adminRecordDescription.length >= 200) {
                    adminRecordDescription = adminRecordDescription.substring(0, 200) + '...';
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, results, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    export(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resExportItemsList = yield this.itemService.exportItemsList();
                resExportItemsList = resExportItemsList.map((T) => {
                    const { name, type, price, configType, isBlock, commands, imgSrc, sales, configs } = T;
                    return { name, type, price, configType, isBlock, commands, imgSrc, sales, configs };
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resExportItemsList, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    import(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertFunctionArray = [];
                body.data.forEach((item) => {
                    insertFunctionArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let resSaveItemTypes;
                            if (body.type === 'own') {
                                const { name, type, price, configType, isBlock, commands, imgSrc, sales, configs } = item;
                                resSaveItemTypes = yield this.itemService.saveItem(name, type, price, configType, isBlock, commands, imgSrc, sales, configs);
                            }
                            else if (body.type === 'yingzi') {
                                const { name, category_id, price, code, image, actual_sales, is_vip_status_text } = item;
                                const configs = {};
                                if (is_vip_status_text === '是') {
                                    configs.levelLimit = 1;
                                }
                                resSaveItemTypes = yield this.itemService.saveItem(name, category_id + '', price, undefined, false, code.replace(/,/g, '\n'), image, actual_sales, JSON.stringify(configs));
                            }
                            else {
                                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, 'type为空或不可识别'));
                            }
                            if (resSaveItemTypes && resSaveItemTypes.id) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(item, e.toString());
                            resolve(false);
                        }
                    })));
                });
                const [...resImportItems] = yield Promise.all(insertFunctionArray);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    success: resImportItems.filter(T => T === true).length,
                    fail: resImportItems.filter(T => T === false).length,
                }, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    specialImportByCsv(userInfo, file, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const convertResults = yield new Promise((resolve, reject) => {
                    const results = [];
                    const bufferStream = new stream_1.Readable();
                    bufferStream.push(file.buffer);
                    bufferStream.push(null);
                    bufferStream
                        .pipe(csvParser())
                        .on('data', (data) => {
                        results.push(data);
                    })
                        .on('end', () => {
                        resolve(results);
                    }).on('error', (e) => {
                        reject(e);
                    });
                });
                const insertFunctionArray = [];
                convertResults.forEach((item) => {
                    insertFunctionArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let resSaveItemTypes;
                            const { type, price, commands, imgSrc } = item;
                            resSaveItemTypes = yield this.itemService.saveItem(item[Object.keys(item).find(T => T.endsWith('name'))], type, price, 'command', false, commands, imgSrc, 0, '{}');
                            if (resSaveItemTypes && resSaveItemTypes.id) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(item, e.toString());
                            resolve(false);
                        }
                    })));
                });
                const [...resImportItems] = yield Promise.all(insertFunctionArray);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    success: resImportItems.filter(T => T === true).length,
                    fail: resImportItems.filter(T => T === false).length,
                }, ''));
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
        item_admin_sys_1.ListItemSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_admin_sys_1.ItemInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.addItemSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/update'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.updateItemSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('/updateAllTeleport'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.updateItemAllTeleportSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "updateAllTeleport", null);
__decorate([
    (0, common_1.Put)('/updateItemAllPrice'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.updateItemAllPriceSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "updateItemAllPrice", null);
__decorate([
    (0, common_1.Put)('/updateItemsPrice'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.updateItemsPriceSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "updateItemsPrice", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.deleteItemSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/deleteItems'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.deleteItemsSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "deleteItems", null);
__decorate([
    (0, common_1.Get)('/export'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('/import'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_admin_sys_1.ImportItemsSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "import", null);
__decorate([
    (0, common_1.Post)('specialImportByCsv'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (req, file, callback) => {
            if (file.mimetype.startsWith('text/csv')) {
                callback(null, true);
            }
            else {
                callback(new Error('请上传csv'));
            }
        },
    })),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object, Object]),
    __metadata("design:returntype", Promise)
], ItemAdminSysController.prototype, "specialImportByCsv", null);
ItemAdminSysController = __decorate([
    (0, common_1.Controller)('/itemAdminSys'),
    __metadata("design:paramtypes", [item_service_1.ItemService])
], ItemAdminSysController);
exports.ItemAdminSysController = ItemAdminSysController;
//# sourceMappingURL=item-admin-sys.controller.js.map