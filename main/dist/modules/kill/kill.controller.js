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
exports.KillController = void 0;
const common_1 = require("@nestjs/common");
const kill_1 = require("../../dto/kill");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const user_service_1 = require("../user/user.service");
const kill_service_1 = require("./kill.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const user_decorator_1 = require("../../decorator/user.decorator");
const session_user_1 = require("../../dto/session-user");
const morgan_log_1 = require("../../common/morgan-log");
let KillController = class KillController {
    constructor(userService, killService) {
        this.userService = userService;
        this.killService = killService;
    }
    listByUser(userInfo, page, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    page = (0, format_page_query_1.formatPageQuery)(page);
                    let resGetUserKiller2VictimList = yield this.killService.getUserKiller2VictimList(page, user.steamId);
                    resGetUserKiller2VictimList[0] = resGetUserKiller2VictimList[0].map((T) => {
                        const { id, killerName, killerSteamId, killerArea, victimName, victimArea, victimLocations, distance, weapon, isEventKill, occuredTimeStamp } = T;
                        return { id, killerName, killerArea, victimName, victimArea, victimLocations, distance, weapon, isEventKill, occuredTimeStamp, infoType: user.steamId === killerSteamId ? 'killer' : 'victim' };
                    });
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resGetUserKiller2VictimList, page)));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    kdasByUser(userInfo, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    const resGetKda = yield this.killService.getKdas(user.steamId);
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetKda));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
                }
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listRecentNKillList(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resGetRecentNKill = yield this.killService.getRecentNKill(query.recent && query.recent <= 20 ? query.recent : 20);
                resGetRecentNKill = resGetRecentNKill.map((T) => {
                    const { id, killerName, killerArea, victimName, victimArea, victimLocations, distance, weapon, occuredTimeStamp } = T;
                    return { id, killerName, killerArea, victimName, victimArea, victimLocations, distance, weapon, occuredTimeStamp };
                });
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, resGetRecentNKill));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
    listTopNUserKill(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resCountTopNUserKill = yield this.killService.countTopNUserKill(query.recent && query.recent <= 20 ? query.recent : 20);
                resCountTopNUserKill = resCountTopNUserKill.map((T) => {
                    return {
                        userName: T.killerUser_userName,
                        total: T['count(`kill`.`killerSteamId`)'],
                    };
                });
                let resGetLastKilll = yield this.killService.getLastKill();
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {
                    statsFrom: resGetLastKilll.occuredTimeStamp,
                    result: resCountTopNUserKill,
                }));
            }
            catch (e) {
                (0, morgan_log_1.logBussiness)(e);
                return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, {}, e.toString()));
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/listByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        page_1.Page, Object]),
    __metadata("design:returntype", Promise)
], KillController.prototype, "listByUser", null);
__decorate([
    (0, common_1.Get)('/kdasByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser, Object]),
    __metadata("design:returntype", Promise)
], KillController.prototype, "kdasByUser", null);
__decorate([
    (0, common_1.Get)('/listRecentNKillList'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kill_1.ListRecentNKillList, Object]),
    __metadata("design:returntype", Promise)
], KillController.prototype, "listRecentNKillList", null);
__decorate([
    (0, common_1.Get)('/listTopNUserKill'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kill_1.ListTopNUserKill, Object]),
    __metadata("design:returntype", Promise)
], KillController.prototype, "listTopNUserKill", null);
KillController = __decorate([
    (0, common_1.Controller)('/kill'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        kill_service_1.KillService])
], KillController);
exports.KillController = KillController;
//# sourceMappingURL=kill.controller.js.map