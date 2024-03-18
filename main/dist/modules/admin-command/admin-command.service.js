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
exports.AdminCommandService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_command_entity_1 = require("../../entity/admin-command.entity");
const typeorm_2 = require("typeorm");
let AdminCommandService = class AdminCommandService {
    constructor(adminCommandRepository) {
        this.adminCommandRepository = adminCommandRepository;
    }
    saveAdminCommands(adminCommands) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let adminCommand of adminCommands) {
                const element = new admin_command_entity_1.AdminCommand(adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.scumId, adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.steamId, adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.sessionId, adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.content, adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.sendTimeStamp, adminCommand === null || adminCommand === void 0 ? void 0 : adminCommand.otherConfig);
                insertArray.push(element);
            }
            return yield this.adminCommandRepository.save(insertArray);
        });
    }
    saveAdminCommand(scumId, steamId, sessionId, content, sendTimeStamp, otherConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminCommandRepository.save(new admin_command_entity_1.AdminCommand(scumId, steamId, sessionId, content, sendTimeStamp, otherConfig));
        });
    }
    getAdminCommandList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminCommandRepository.createQueryBuilder('admin-command');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.scumId !== undefined) {
                res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
            }
            if (data.content !== undefined) {
                res = res.andWhere("content = :content", { content: data.content });
            }
            if (data.sendTimeStamp !== undefined) {
                res = res.andWhere("sendTimeStamp = :sendTimeStamp", { sendTimeStamp: data.sendTimeStamp });
            }
            return yield res
                .orderBy(`sendTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getAdminCommandListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminCommandRepository.createQueryBuilder('adminCommand');
            if (data.scumId !== undefined) {
                res = res.andWhere("adminCommand.scumId like :scumId", { scumId: `%${data.scumId}%` });
            }
            if (data.steamId !== undefined) {
                res = res.andWhere("adminCommand.steamId like :steamId", { steamId: `%${data.steamId}%` });
            }
            if (data.sessionId !== undefined) {
                res = res.andWhere("adminCommand.sessionId like :sessionId", { sessionId: `%${data.sessionId}%` });
            }
            if (data.content !== undefined) {
                res = res.andWhere("adminCommand.content like :content", { content: `%${data.content}%` });
            }
            if (data.sendTimeStamp !== undefined) {
                res = res.andWhere("adminCommand.sendTimeStamp like :sendTimeStamp", { sendTimeStamp: `%${data.sendTimeStamp}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("adminCommand.sendTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("adminCommand.sendTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            console.log(res.getSql());
            return yield res
                .orderBy(`adminCommand.sendTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getAdminCommand(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminCommandRepository.createQueryBuilder('adminCommand');
            if (data && (data.id || data.scumId !== undefined || data.steamId !== undefined || data.sessionId !== undefined || data.content !== undefined || data.sendTimeStamp !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.scumId !== undefined) {
                    res = res.andWhere("scumId = :scumId", { scumId: data.scumId });
                }
                if (data.steamId !== undefined) {
                    res = res.andWhere("steamId = :steamId", { steamId: data.steamId });
                }
                if (data.sessionId !== undefined) {
                    res = res.andWhere("sessionId = :sessionId", { sessionId: data.sessionId });
                }
                if (data.content !== undefined) {
                    res = res.andWhere("content = :content", { content: data.content });
                }
                if (data.sendTimeStamp !== undefined) {
                    res = res.andWhere("sendTimeStamp = :sendTimeStamp", { sendTimeStamp: data.sendTimeStamp });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    getLatestRecordTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let resLatestSendTimeStamp = yield this.adminCommandRepository
                .createQueryBuilder('admin-command')
                .setLock('pessimistic_write')
                .useTransaction(true)
                .orderBy(`sendTimeStamp`, 'DESC')
                .getOne();
            return (resLatestSendTimeStamp && resLatestSendTimeStamp.sendTimeStamp) ? resLatestSendTimeStamp.sendTimeStamp : null;
        });
    }
    deleteAdminCommand(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminCommandRepository.createQueryBuilder('adminCommand')
                .delete()
                .from(admin_command_entity_1.AdminCommand);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    limitAllAdminCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.adminCommandRepository.createQueryBuilder('adminCommand')
                .delete()
                .from(admin_command_entity_1.AdminCommand);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from admin_command ORDER BY sendTimeStamp DESC LIMIT 2000) t)");
            return yield res
                .execute();
        });
    }
    clearAdminCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminCommandRepository
                .clear();
        });
    }
};
AdminCommandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_command_entity_1.AdminCommand)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminCommandService);
exports.AdminCommandService = AdminCommandService;
//# sourceMappingURL=admin-command.service.js.map