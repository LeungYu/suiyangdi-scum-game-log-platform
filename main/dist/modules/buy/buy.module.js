"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const buy_entity_1 = require("../../entity/buy.entity");
const buy_service_1 = require("./buy.service");
const buy_controller_1 = require("./buy.controller");
const queue_service_1 = require("../queue/queue.service");
const item_service_1 = require("../item/item.service");
const user_dollar_service_1 = require("../user/user-dollar.service");
const user_dollar_change_service_1 = require("../user-dollar-change/user-dollar-change.service");
const user_dollar_change_entity_1 = require("../../entity/user-dollar-change.entity");
const server_config_service_1 = require("../server-config/server-config.service");
const user_locations_service_1 = require("../user/user-locations.service");
const queue_entity_1 = require("../../entity/queue.entity");
const item_entity_1 = require("../../entity/item.entity");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../../entity/user.entity");
const level_entity_1 = require("../../entity/level.entity");
const level_service_1 = require("../level/level.service");
const server_config_entity_1 = require("../../entity/server-config.entity");
const user_locations_entity_1 = require("../../entity/user-locations.entity");
const buy_admin_sys_controller_1 = require("./buy-admin-sys.controller");
const admin_entity_1 = require("../../entity/admin.entity");
const admin_service_1 = require("../admin/admin.service");
const user_login_entity_1 = require("../../entity/user-login.entity");
const user_login_service_1 = require("../user/user-login.service");
const squad_entity_1 = require("../../entity/squad.entity");
const squad_service_1 = require("../squad/squad.service");
const squad_user_entity_1 = require("../../entity/squad-user.entity");
const squad_user_service_1 = require("../squad/squad-user.service");
let BuyModule = class BuyModule {
};
BuyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin, buy_entity_1.Buy, queue_entity_1.Queue, item_entity_1.Item, user_entity_1.User, user_dollar_entity_1.UserDollar, user_locations_entity_1.UserLocations, user_dollar_change_entity_1.UserDollarChange, user_login_entity_1.UserLogin, level_entity_1.Level, server_config_entity_1.ServerConfig, squad_entity_1.Squad, squad_user_entity_1.SquadUser,
            ])],
        providers: [
            admin_service_1.AdminService, buy_service_1.BuyService, queue_service_1.QueueService, item_service_1.ItemService, user_service_1.UserService, user_dollar_service_1.UserDollarService, user_dollar_change_service_1.UserDollarChangeService, user_login_service_1.UserLoginService, level_service_1.LevelService, server_config_service_1.ServerConfigService, user_locations_service_1.UserLocationsService, squad_service_1.SquadService, squad_user_service_1.SquadUserService,
        ],
        controllers: [buy_controller_1.BuyController, buy_admin_sys_controller_1.BuyAdminSysController],
    })
], BuyModule);
exports.BuyModule = BuyModule;
//# sourceMappingURL=buy.module.js.map