"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_entity_1 = require("../../entity/item.entity");
const item_service_1 = require("./item.service");
const item_controller_1 = require("./item.controller");
const item_admin_sys_controller_1 = require("./item-admin-sys.controller");
const admin_entity_1 = require("../../entity/admin.entity");
const admin_service_1 = require("../admin/admin.service");
const user_entity_1 = require("../../entity/user.entity");
const user_service_1 = require("../user/user.service");
let ItemModule = class ItemModule {
};
ItemModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, item_entity_1.Item,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, item_service_1.ItemService,
        ],
        controllers: [item_controller_1.ItemController, item_admin_sys_controller_1.ItemAdminSysController],
    })
], ItemModule);
exports.ItemModule = ItemModule;
//# sourceMappingURL=item.module.js.map