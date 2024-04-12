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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const queue_entity_1 = require("../../entity/queue.entity");
const user_entity_1 = require("../../entity/user.entity");
const user_dollar_entity_1 = require("../../entity/user-dollar.entity");
let QueueService = class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    saveQueues(queues) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertArray = [];
            for (let queue of queues) {
                const element = new queue_entity_1.Queue(queue === null || queue === void 0 ? void 0 : queue.commands.split('\n').filter(T => T.trim().length > 0).join('\n'), queue === null || queue === void 0 ? void 0 : queue.type, queue === null || queue === void 0 ? void 0 : queue.status, queue === null || queue === void 0 ? void 0 : queue.buyId, queue === null || queue === void 0 ? void 0 : queue.buyUserId, queue === null || queue === void 0 ? void 0 : queue.isNewSet);
                insertArray.push(element);
            }
            return yield this.queueRepository.save(insertArray);
        });
    }
    saveQueueItem(commands, type, status, buyId, buyUserId, isNewSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queueRepository.save(new queue_entity_1.Queue(commands.split('\n').filter(T => T.trim().length > 0).join('\n'), type, status, buyId, buyUserId, isNewSet));
        });
    }
    updateQueueItem(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.queueRepository
                .createQueryBuilder()
                .setLock('pessimistic_write')
                .useTransaction(true)
                .update(queue_entity_1.Queue)
                .set(queue);
            res = res.andWhere('id = :id', {
                id: queue.id,
            });
            return yield res.execute();
        });
    }
    updateAllQueueStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.queueRepository
                .createQueryBuilder()
                .setLock('pessimistic_write')
                .useTransaction(true)
                .update(queue_entity_1.Queue)
                .set({ status });
            return yield res.execute();
        });
    }
    getQueueList(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this
                .queueRepository.createQueryBuilder('queue')
                .setLock('pessimistic_write')
                .useTransaction(true);
            res = res.leftJoinAndMapOne('queue.user', user_entity_1.User, "user", "queue.buyUserId = user.id");
            res = res.leftJoinAndMapOne('queue.userDollar', user_dollar_entity_1.UserDollar, "userDollar", "user.id = userDollar.userId");
            if (data.id) {
                res = res.andWhere("queue.id = :id", { id: data.id });
            }
            if (data.type) {
                res = res.andWhere("queue.type = :type", { type: data.type });
            }
            if (data.status) {
                res = res.andWhere("queue.status = :status", { status: data.status });
            }
            if (data.buyId) {
                res = res.andWhere("queue.buyId = :buyId", { buyId: data.buyId });
            }
            if (data.buyUserId) {
                res = res.andWhere("queue.buyUserId = :buyUserId", { buyUserId: data.buyUserId });
            }
            if (data.enableMonitor === undefined || data.enableMonitor === false) {
                res = res.andWhere("queue.type != :type", { type: 'monitorMsg' });
            }
            else {
                res = res.andWhere("queue.type = :type", { type: 'monitorMsg' });
            }
            if (data.enableVipPriority === true) {
                res = res.addOrderBy(`userDollar.level`, 'DESC');
            }
            return yield res
                .addOrderBy(`queue.createdTimeStamp`, data.order ? data.order : 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getQueueListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this
                .queueRepository.createQueryBuilder('queue')
                .setLock('pessimistic_write')
                .useTransaction(true);
            res = res.leftJoinAndMapOne('queue.user', user_entity_1.User, "user", "queue.buyUserId = user.id");
            if (data.type) {
                res = res.andWhere("queue.type = :type", { type: data.type });
            }
            if (data.status) {
                res = res.andWhere("queue.status = :status", { status: data.status });
            }
            if (data.buyId) {
                res = res.andWhere("queue.buyId like :buyId", { buyId: `%${data.buyId}%` });
            }
            if (data.buyUserId) {
                res = res.andWhere("queue.buyUserId like :buyUserId", { buyUserId: `%${data.buyUserId}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("queue.createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("queue.createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`queue.createdTimeStamp`, data.order ? data.order : 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getQueueListPending(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.queueRepository.createQueryBuilder('queue');
            res = res.where("status = created").orWhere("status = processed");
            if (data.limit) {
                res = res.limit(data.limit);
            }
            return yield res
                .orderBy(`createdTimeStamp`, data.order ? data.order : 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getBuyQueuePending() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.queueRepository.createQueryBuilder('queue');
            res = res.where("(status = 'created' or 'status' = 'processed') and type = 'buyMsg'");
            return yield res
                .getOne();
        });
    }
    getQueueItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.queueRepository
                .createQueryBuilder('queue')
                .setLock('pessimistic_write')
                .useTransaction(true);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.buyId) {
                res = res.andWhere("buyId = :buyId", { buyId: data.buyId });
            }
            return yield res
                .getOne();
        });
    }
    deleteQueueItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.queueRepository.createQueryBuilder('queue')
                .delete()
                .from(queue_entity_1.Queue);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    cleanQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queueRepository.clear();
        });
    }
    limitAllQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.queueRepository.createQueryBuilder('queue')
                .delete()
                .from(queue_entity_1.Queue);
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from queue ORDER BY createdTimeStamp DESC LIMIT 2000) t)");
            res = res.andWhere("id NOT IN (SELECT id from (SELECT id from queue where status != 'created') t)");
            return yield res
                .execute();
        });
    }
};
QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(queue_entity_1.Queue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QueueService);
exports.QueueService = QueueService;
//# sourceMappingURL=queue.service.js.map