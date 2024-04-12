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
exports.ItemTypesAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const item_types_admin_sys_1 = require("../../dto/item-types-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const item_types_service_1 = require("./item-types.service");
const item_service_1 = require("../item/item.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
let ItemTypesAdminSysController = class ItemTypesAdminSysController {
    constructor(itemService, itemTypesService) {
        this.itemService = itemService;
        this.itemTypesService = itemTypesService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resListItemTypes = yield this.itemTypesService.getItemTypesListLike(page, query);
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resListItemTypes, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    listAllowFather(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reslistAllowFathers = yield this.itemTypesService.listAllowFather();
                res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, reslistAllowFathers));
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
                const resItemTypes = yield this.itemTypesService.getItemTypes({
                    id: query.id,
                });
                if (resItemTypes && resItemTypes.id) {
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resItemTypes));
                }
                else {
                    res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该商品类型'));
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
                const resSaveItemTypes = yield this.itemTypesService.saveItem(body.name, body.cnName);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveItemTypes, ''));
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
                const resOriginItemType = yield this.itemTypesService.getItemTypes({
                    id: body.id
                });
                const originItemType = resOriginItemType.name;
                const resUpdateItemTypes = yield this.itemTypesService.updateItemTypes({
                    id: body.id,
                    name: body.name,
                    cnName: body.cnName,
                    fatherItemTypeId: body.fatherItemTypeId,
                    topTimeStamp: body.topTimeStamp,
                });
                console.log('test', originItemType, body.name);
                if (body.name !== undefined && originItemType !== undefined && originItemType !== body.name) {
                    const resUpdateAllItemType = yield this.itemService.updateAllItemType(originItemType, body.name);
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.itemTypesService.getItemTypes({ id: body.id }), ''));
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
                const resItemType = yield this.itemTypesService.getItemTypes({
                    id: query.id
                });
                const resDeleteItemTypes = yield this.itemTypesService.deleteItemTypes(query);
                const resUpdateAllItemType = yield this.itemService.updateAllItemType(resItemType.name, null);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    deleteItemsTypes(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let results = {};
                const processDeleteItemsTypesFunctionArray = [];
                body.ids.forEach((itemTypeId) => {
                    processDeleteItemsTypesFunctionArray.push(new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const resItemType = yield this.itemTypesService.getItemTypes({
                                id: itemTypeId
                            });
                            if (resItemType && resItemType.id && resItemType.canBeDeleted !== false) {
                                yield this.itemTypesService.deleteItemTypes({ id: itemTypeId });
                                yield this.itemService.updateAllItemType(resItemType.name, null);
                                resolve({ status: true, itemTypeId });
                            }
                            else {
                                resolve({ status: false, itemTypeId });
                            }
                        }
                        catch (e) {
                            (0, morgan_log_1.logBussiness)(itemTypeId, e.toString());
                            resolve({ status: false, itemTypeId });
                        }
                    })));
                });
                const [...resProcessDeleteItemsTypesFunctionArray] = yield Promise.all(processDeleteItemsTypesFunctionArray);
                results = {
                    success: resProcessDeleteItemsTypesFunctionArray.filter(T => T.status === true).length,
                    fail: resProcessDeleteItemsTypesFunctionArray.filter(T => T.status === false).length,
                    failIds: resProcessDeleteItemsTypesFunctionArray.filter(T => T.status === false).map(T => T.itemId),
                };
                let adminRecordDescription = `批量删除商品种类(ID:${body.ids.join(',')})`;
                if (adminRecordDescription.length >= 200) {
                    adminRecordDescription = adminRecordDescription.substring(0, 200) + '...';
                }
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
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
                let resExportItemTypesList = yield this.itemTypesService.exportItemTypesList();
                resExportItemTypesList = resExportItemTypesList.map((T) => {
                    const { name, cnName, canBeDeleted } = T;
                    return { name, cnName, canBeDeleted };
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resExportItemTypesList, ''));
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
                                const { name, cnName, canBeDeleted, fatherItemTypeId } = item;
                                resSaveItemTypes = yield this.itemTypesService.saveItem(name, cnName, canBeDeleted, fatherItemTypeId);
                            }
                            else if (body.type === 'yingzi') {
                                const { id, name } = item;
                                resSaveItemTypes = yield this.itemTypesService.saveItem(id + '', name, true);
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
                const [...resImportItemTypes] = yield Promise.all(insertFunctionArray);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    success: resImportItemTypes.filter(T => T === true).length,
                    fail: resImportItemTypes.filter(T => T === false).length,
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
        item_types_admin_sys_1.ListItemTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/listAllowFather'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "listAllowFather", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_types_admin_sys_1.ItemTypesInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_types_admin_sys_1.AddItemTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/update'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_types_admin_sys_1.UpdateItemTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_types_admin_sys_1.DeleteItemTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/deleteItemsTypes'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_types_admin_sys_1.DeleteItemsTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "deleteItemsTypes", null);
__decorate([
    (0, common_1.Get)('/export'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('/import'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        item_types_admin_sys_1.ImportItemTypesSysDto, Object]),
    __metadata("design:returntype", Promise)
], ItemTypesAdminSysController.prototype, "import", null);
ItemTypesAdminSysController = __decorate([
    (0, common_1.Controller)('/itemTypesAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [item_service_1.ItemService,
        item_types_service_1.ItemTypesService])
], ItemTypesAdminSysController);
exports.ItemTypesAdminSysController = ItemTypesAdminSysController;
//# sourceMappingURL=item-types-admin-sys.controller.js.map