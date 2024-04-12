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
exports.DbHistoryService = exports.DatabseStatsTaskType = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const db_history_entity_1 = require("../../entity/db-history.entity");
const task_qull_1 = require("../../common/task-qull");
const morgan_log_1 = require("../../common/morgan-log");
const typeorm_3 = require("typeorm");
const config_1 = require("../../config/config");
var DatabseStatsTaskType;
(function (DatabseStatsTaskType) {
    DatabseStatsTaskType[DatabseStatsTaskType["DATABASE_STATS"] = 0] = "DATABASE_STATS";
})(DatabseStatsTaskType = exports.DatabseStatsTaskType || (exports.DatabseStatsTaskType = {}));
const FAILURE_RETRY_INTERVAL = 3000;
let DbHistoryService = class DbHistoryService {
    constructor(dbHistoryRepository) {
        this.dbHistoryRepository = dbHistoryRepository;
        this.databseStatsQueueHandler();
        this.add({
            timeStamp: Date.now() + '',
            taskType: DatabseStatsTaskType.DATABASE_STATS
        }, {
            delay: 0,
        });
    }
    add(task, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            task_qull_1.DatabaseStatsQueue.add(task, Object.assign(Object.assign({}, opts), { backoff: FAILURE_RETRY_INTERVAL, timeout: 20000 }));
        });
    }
    databseStatsQueueHandler() {
        task_qull_1.DatabaseStatsQueue.on('completed', (job, result) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(true, `队列信息：任务【定时统计库表数据】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】执行成功`);
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: DatabseStatsTaskType.DATABASE_STATS,
            }, {
                delay: 1000 * 60 * 5,
            });
            job.remove();
        }));
        task_qull_1.DatabaseStatsQueue.on('failed', (job, err) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(true, `队列信息：任务【定时统计库表数据】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】错误，原因：${err}`);
            (0, morgan_log_1.logDatabaseStats)(true, `队列信息：任务【定时统计库表数据】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】重试，间隔${FAILURE_RETRY_INTERVAL}毫秒`);
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: DatabseStatsTaskType.DATABASE_STATS,
            }, {
                delay: FAILURE_RETRY_INTERVAL,
            });
        }));
        task_qull_1.DatabaseStatsQueue.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            (0, morgan_log_1.logDatabaseStats)(false, `队列信息：接收到任务【定时统计库表数据】${job.data.taskType}`);
            const { taskType } = job.data;
            let res = undefined;
            switch (taskType) {
                case DatabseStatsTaskType.DATABASE_STATS:
                    res = yield this.databseStats();
                    break;
                default:
                    break;
            }
            if (res.error === undefined) {
                done(null, res);
            }
            else {
                const { error } = res;
                done(new Error(typeof error === 'object' ? JSON.stringify(error) : error));
            }
        }));
    }
    databseStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rawResults = yield (0, typeorm_3.getConnection)()
                    .query(`SELECT table_name,table_rows FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${config_1.Config.getConf('MYSQL_DATABASE')}' ORDER BY table_rows DESC`);
                const records = {};
                for (const record of rawResults) {
                    records[record.table_name] = record.table_rows;
                }
                yield this.dbHistoryRepository.save(new db_history_entity_1.DbHistory(JSON.stringify(records)));
                yield this.dbHistoryRepository
                    .createQueryBuilder()
                    .delete()
                    .from(db_history_entity_1.DbHistory).
                    where("createdTimeStamp < :createdTimeStamp", { createdTimeStamp: Date.now() - 1000 * 60 * 60 * 24 * 7 })
                    .execute();
                return { process: true };
            }
            catch (e) {
                return { error: e.toString() };
            }
        });
    }
};
DbHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(db_history_entity_1.DbHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DbHistoryService);
exports.DbHistoryService = DbHistoryService;
//# sourceMappingURL=db-history.service.js.map