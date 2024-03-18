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
exports.ServerConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const server_config_entity_1 = require("../../entity/server-config.entity");
const typeorm_2 = require("typeorm");
let ServerConfigService = class ServerConfigService {
    constructor(serverConfigRepository) {
        this.serverConfigRepository = serverConfigRepository;
    }
    saveItem(name, cnName, value, modify) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.serverConfigRepository.save(new server_config_entity_1.ServerConfig(name, cnName, JSON.stringify({ value }), modify));
        });
    }
    updateServerConfig(serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.serverConfigRepository
                .createQueryBuilder()
                .update(server_config_entity_1.ServerConfig)
                .set(serverConfig);
            if (serverConfig.id) {
                res = res.andWhere("id = :id", { id: serverConfig.id });
            }
            if (serverConfig.name) {
                res = res.andWhere("name = :name", { name: serverConfig.name });
            }
            return yield res.execute();
        });
    }
    getServerConfig(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.serverConfigRepository.createQueryBuilder('server-config');
            if (data && (data.id || data.name || data.cnName || data.value || data.modify)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.name) {
                    res = res.andWhere("name = :name", { name: data.name });
                }
                if (data.cnName) {
                    res = res.andWhere("cnName = :cnName", { cnName: data.cnName });
                }
                if (data.value !== undefined) {
                    res = res.andWhere("value = :value", { value: JSON.stringify({ value: data.value }) });
                }
                if (data.modify !== undefined) {
                    res = res.andWhere("modify = :modify", { modify: data.modify === 'true' });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
};
ServerConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_config_entity_1.ServerConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServerConfigService);
exports.ServerConfigService = ServerConfigService;
//# sourceMappingURL=server-config.service.js.map