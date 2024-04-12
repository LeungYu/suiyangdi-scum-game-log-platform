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
exports.QueueAdminSysController = void 0;
const common_1 = require("@nestjs/common");
const queue_admin_sys_1 = require("../../dto/queue-admin-sys");
const queue_service_1 = require("./queue.service");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const admin_sys_access_guard_1 = require("../../guard/admin-sys-access.guard");
const super_admin_sys_access_guard_1 = require("../../guard/super-admin-sys-access.guard");
const morgan_log_1 = require("../../common/morgan-log");
const write_admin_sys_access_guard_1 = require("../../guard/write-admin-sys-access.guard");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
let QueueAdminSysController = class QueueAdminSysController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    listQueue(page, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const resGetQueueList = yield this.queueService.getQueueListLike(page, {
                    type: query.type,
                    status: query.status,
                    buyId: query.buyId,
                    buyUserId: query.buyUserId,
                    timestampStart: query.timestampStart,
                    timestampEnd: query.timestampEnd,
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetQueueList, page)));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    infoQueue(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetQueueItem = yield this.queueService.getQueueItem({
                    id: query.id,
                });
                if (resGetQueueItem && resGetQueueItem.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetQueueItem));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该队列项'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateStatus(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetQueueItem = yield this.queueService.getQueueItem({
                    id: body.id,
                });
                if (resGetQueueItem && resGetQueueItem.id) {
                    const resUpdateQueue = yield this.queueService.updateQueueItem({
                        id: body.id,
                        status: body.status,
                    });
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该队列项'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    updateAllStatus(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resUpdateAllQueueStatus = yield this.queueService.updateAllQueueStatus(body.status);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    addQueue(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resSaveQueueItem = yield this.queueService.saveQueueItem(body.commands, body.type, undefined, body.buyId);
                if (resSaveQueueItem && resSaveQueueItem.id) {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveQueueItem));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    redoQueue(userInfo, body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resGetQueueItem = yield this.queueService.getQueueItem({
                    id: body.id,
                });
                if (resGetQueueItem && resGetQueueItem.id) {
                    let { id, status, createdTimeStamp, updateTimeStamp } = resGetQueueItem, newQueueItem = __rest(resGetQueueItem, ["id", "status", "createdTimeStamp", "updateTimeStamp"]);
                    newQueueItem.status = 'created';
                    const resSaveRedoQueueItem = yield this.queueService.saveQueueItem(newQueueItem.commands, newQueueItem.type, newQueueItem.status, newQueueItem.buyId);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resSaveRedoQueueItem));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '找不到该队列项'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, e.toString()));
            }
        });
    }
    deleteQueueItem(userInfo, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resDeleteQueueItem = yield this.queueService.deleteQueueItem({ id: query.id });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}));
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
                const resCleanKill = yield this.queueService.cleanQueue();
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, ''));
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
        queue_admin_sys_1.ListQueueSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "listQueue", null);
__decorate([
    (0, common_1.Get)('/info'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queue_admin_sys_1.InfoQueueSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "infoQueue", null);
__decorate([
    (0, common_1.Put)('/updateStatus'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        queue_admin_sys_1.updateStatusSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('/updateAllStatus'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        queue_admin_sys_1.updateAllStatusSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "updateAllStatus", null);
__decorate([
    (0, common_1.Post)('/addQueue'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        queue_admin_sys_1.AddQueueSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "addQueue", null);
__decorate([
    (0, common_1.Post)('/redo'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        queue_admin_sys_1.RedoQueueSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "redoQueue", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)(write_admin_sys_access_guard_1.WriteAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        queue_admin_sys_1.DeleteQueueItemSysDto, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "deleteQueueItem", null);
__decorate([
    (0, common_1.Delete)('/clean'),
    (0, common_1.UseGuards)(super_admin_sys_access_guard_1.SuperAdminSysGuard),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], QueueAdminSysController.prototype, "clean", null);
QueueAdminSysController = __decorate([
    (0, common_1.Controller)('/queueAdminSys'),
    (0, common_1.UseGuards)(admin_sys_access_guard_1.AdminSysGuard),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], QueueAdminSysController);
exports.QueueAdminSysController = QueueAdminSysController;
//# sourceMappingURL=queue-admin-sys.controller.js.map