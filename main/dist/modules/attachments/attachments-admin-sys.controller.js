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
exports.AttachmentsAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const attachments_admin_sys_1 = require("../../dto/attachments-admin-sys");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const attachments_service_1 = require("./attachments.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
let AttachmentsAdminSysController = class AttachmentsAdminSysController {
    constructor(attachmentsService) {
        this.attachmentsService = attachmentsService;
    }
    list(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetAttachmentsList = yield this.attachmentsService.getAttachmentsListLike(page, {
                    name: query.name,
                    url: query.url,
                    timestampStart: query.timestampStart,
                    timestampEnd: query.timestampEnd,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetAttachmentsList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    search(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetAttachmentsList = yield this.attachmentsService.searchAttachmentsList(page, query.search);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetAttachmentsList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    info(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetAttachments = yield this.attachmentsService.getAttachments(query);
                if (resGetAttachments && resGetAttachments.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetAttachments));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该等级'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    add(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resSaveAttachments = yield this.attachmentsService.saveAttachments(body.name, body.url);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveAttachments, ''));
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
                const resUpdateAttachments = yield this.attachmentsService.updateAttachments({
                    id: body.id,
                    name: body.name,
                    url: body.url,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, yield this.attachmentsService.getAttachments({
                    id: body.id,
                }), ''));
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
                const resGetOriginAttachments = yield this.attachmentsService.getAttachments({ id: query.id });
                const resDeleteAttachments = yield this.attachmentsService.deleteAttachments({
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
    clean(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resCleanChatMessage = yield this.attachmentsService.clearAttachments();
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
                let resExportAttachmentsList = yield this.attachmentsService.exportAttachmentsList();
                resExportAttachmentsList = resExportAttachmentsList.map((T) => {
                    return { name: T.name, url: T.url };
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resExportAttachmentsList, ''));
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
                            const resSaveAttachments = yield this.attachmentsService.saveAttachments(item.name, item.url);
                            if (resSaveAttachments && resSaveAttachments.id) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }
                        catch (e) {
                            resolve(false);
                        }
                    })));
                });
                const [...resImportAttachments] = yield Promise.all(insertFunctionArray);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    success: resImportAttachments.filter(T => T === true).length,
                    fail: resImportAttachments.filter(T => T === false).length,
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
        attachments_admin_sys_1.ListAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_1.Page,
        attachments_admin_sys_1.SearchAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attachments_admin_sys_1.AttachmentsInfoSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        attachments_admin_sys_1.AddAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "add", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        attachments_admin_sys_1.UpdateAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        attachments_admin_sys_1.DeleteAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('/clean'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "clean", null);
__decorate([
    (0, common_1.Get)('/export'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "export", null);
__decorate([
    (0, common_1.Post)('/import'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        attachments_admin_sys_1.ImportAttachmentsSysDto, Object]),
    __metadata("design:returntype", Promise)
], AttachmentsAdminSysController.prototype, "import", null);
AttachmentsAdminSysController = __decorate([
    (0, common_1.Controller)('/attachmentsAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [attachments_service_1.AttachmentsService])
], AttachmentsAdminSysController);
exports.AttachmentsAdminSysController = AttachmentsAdminSysController;
//# sourceMappingURL=attachments-admin-sys.controller.js.map