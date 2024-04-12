"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemTypesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const item_types_entity_1 = require("../../entity/item-types.entity");
const item_entity_1 = require("../../entity/item.entity");
const item_types_service_1 = require("./item-types.service");
const item_service_1 = require("../item/item.service");
const item_types_controller_1 = require("./item-types.controller");
const item_types_admin_sys_controller_1 = require("./item-types-admin-sys.controller");
const admin_service_1 = require("../admin/admin.service");
const admin_entity_1 = require("../../entity/admin.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
let ItemTypesModule = class ItemTypesModule {
};
ItemTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, user_entity_1.User, item_types_entity_1.ItemTypes, item_entity_1.Item,
            ])],
        providers: [
            admin_service_1.AdminService, user_service_1.UserService, item_types_service_1.ItemTypesService, item_service_1.ItemService,
        ],
        controllers: [item_types_controller_1.ItemTypesController, item_types_admin_sys_controller_1.ItemTypesAdminSysController],
    })
], ItemTypesModule);
exports.ItemTypesModule = ItemTypesModule;
//# sourceMappingURL=item-types.module.js.map