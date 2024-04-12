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
exports.UserDollarChangeController = void 0;
const common_1 = require("@nestjs/common");
const session_user_1 = require("../../dto/session-user");
const user_decorator_1 = require("../../decorator/user.decorator");
const response_builder_1 = require("../../common/response-builder");
const page_1 = require("../../dto/page");
const user_service_1 = require("../user/user.service");
const user_dollar_change_service_1 = require("./user-dollar-change.service");
const format_page_query_1 = require("../../common/format-page-query");
const page_data_builder_1 = require("../../common/page-data-builder");
const morgan_log_1 = require("../../common/morgan-log");
let UserDollarChangeController = class UserDollarChangeController {
    constructor(userService, userDollarChangeService) {
        this.userService = userService;
        this.userDollarChangeService = userDollarChangeService;
    }
    listByUser(userInfo, page, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                page = (0, format_page_query_1.formatPageQuery)(page);
                const user = yield this.userService.getUser(userInfo);
                if (user && user.id && user.status === 'normal') {
                    user.userDollar.level = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.level : 0;
                    user.userDollar.chargeDollars = user.userDollar.levelExpireTimeStamp === null || user.userDollar.levelExpireTimeStamp >= Date.now() ? user.userDollar.chargeDollars : 0;
                    const resListUserDollarChange = yield this.userDollarChangeService.getUserDollarChangeList(page, { userId: userInfo.userId });
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.OK, (0, page_data_builder_1.pageDataBuilder)(resListUserDollarChange, page)));
                }
                else {
                    return res.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.INTERNAL_ERROR, {}, '用户不存在/未登录/被冻结'));
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
    (0, common_1.Get)('/listByUser'),
    __param(0, (0, user_decorator_1.SessUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_1.SessionUser,
        page_1.Page, Object]),
    __metadata("design:returntype", Promise)
], UserDollarChangeController.prototype, "listByUser", null);
UserDollarChangeController = __decorate([
    (0, common_1.Controller)('/userDollarChange'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_dollar_change_service_1.UserDollarChangeService])
], UserDollarChangeController);
exports.UserDollarChangeController = UserDollarChangeController;
//# sourceMappingURL=user-dollar-change.controller.js.map