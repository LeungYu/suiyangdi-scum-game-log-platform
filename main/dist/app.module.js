"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const ORMConfig = require("./config/typeorm.config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_redis_1 = require("nestjs-redis");
const config_1 = require("./config/config");
const common_1 = require("@nestjs/common");
const auth_check_middleware_1 = require("./middleware/auth-check.middleware");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./modules/user/user.module");
const kill_module_1 = require("./modules/kill/kill.module");
const server_config_module_1 = require("./modules/server-config/server-config.module");
const auth_service_1 = require("./modules/auth/auth.service");
const server_schedules_module_1 = require("./modules/server-schedules/server-schedules.module");
const admin_command_module_1 = require("./modules/admin-command/admin-command.module");
const actions_record_module_1 = require("./modules/actions-record/actions-record.module");
const chat_message_module_1 = require("./modules/chat-message/chat-message.module");
const violations_record_module_1 = require("./modules/violations-record/violations-record.module");
const economy_module_1 = require("./modules/economy/economy.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cron_service_1 = require("./cron.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(auth_check_middleware_1.AuthCheckMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(ORMConfig),
            nestjs_redis_1.RedisModule.register({
                host: config_1.Config.getConf('REDIS_HOST'),
                port: +config_1.Config.getConf('REDIS_PORT'),
                password: config_1.Config.getConf('REDIS_PASS') || null,
                db: config_1.Config.getConf('REDIS_DB') ? parseInt(config_1.Config.getConf('REDIS_DB'), 10) : 0,
            }),
            user_module_1.UserModule,
            kill_module_1.KillModule,
            server_config_module_1.ServerConfigModule,
            server_schedules_module_1.ServerSchedulesModule,
            admin_command_module_1.AdminCommandModule,
            auth_module_1.AuthModule,
            actions_record_module_1.ActionsRecordModule,
            chat_message_module_1.ChatMessageModule,
            violations_record_module_1.ViolationsRecordModule,
            economy_module_1.EconomyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            cron_service_1.CronService,
            auth_service_1.AuthService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map