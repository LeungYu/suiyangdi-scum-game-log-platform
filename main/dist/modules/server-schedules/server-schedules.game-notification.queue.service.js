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
exports.ServerSchedulesGameNotificationQueueService = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("../queue/queue.service");
const server_config_service_1 = require("../server-config/server-config.service");
const task_qull_1 = require("../../common/task-qull");
const morgan_log_1 = require("../../common/morgan-log");
const config_1 = require("../../config/config");
var GameRoutineNotificationTaskType;
(function (GameRoutineNotificationTaskType) {
    GameRoutineNotificationTaskType[GameRoutineNotificationTaskType["SEND_GAME_ROUTINE_NOTIFICATION"] = 0] = "SEND_GAME_ROUTINE_NOTIFICATION";
})(GameRoutineNotificationTaskType || (GameRoutineNotificationTaskType = {}));
const FAILURE_RETRY_INTERVAL = 500;
let ServerSchedulesGameNotificationQueueService = class ServerSchedulesGameNotificationQueueService {
    constructor(queueService, serverConfigService) {
        this.queueService = queueService;
        this.serverConfigService = serverConfigService;
        this.serverSchedulesGameNotificationQueueHandler();
        this.add({
            timeStamp: Date.now() + '',
            taskType: GameRoutineNotificationTaskType.SEND_GAME_ROUTINE_NOTIFICATION
        }, {
            delay: 0,
        });
    }
    add(task, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            task_qull_1.GameRoutineNotificationQueue.add(task, Object.assign(Object.assign({}, opts), { attempts: 5, backoff: FAILURE_RETRY_INTERVAL, timeout: 10000 }));
        });
    }
    serverSchedulesGameNotificationQueueHandler() {
        task_qull_1.GameRoutineNotificationQueue.on('completed', (job, result) => __awaiter(this, void 0, void 0, function* () {
            if (result.proccess) {
                (0, morgan_log_1.logGameNotification)(true, `队列信息：任务【发送游戏定时公告】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】执行成功`);
            }
            else {
                (0, morgan_log_1.logGameNotification)(false, `队列信息：任务【发送游戏定时公告】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】跳过，原因：【内容为空或设置关闭】`);
            }
            let GameRoutineNotificationInterval = yield this.serverConfigService.getServerConfig({ name: 'GameRoutineNotificationInterval' });
            GameRoutineNotificationInterval = JSON.parse(GameRoutineNotificationInterval.value).value;
            yield this.add({
                timeStamp: Date.now() + '',
                taskType: GameRoutineNotificationTaskType.SEND_GAME_ROUTINE_NOTIFICATION,
            }, {
                delay: result.proccess ? GameRoutineNotificationInterval * 1000 * 60 : 10000,
            });
            job.remove();
        }));
        task_qull_1.GameRoutineNotificationQueue.on('failed', (job, err) => __awaiter(this, void 0, void 0, function* () {
            const delayedCount = yield task_qull_1.GameRoutineNotificationQueue.getDelayedCount();
            if (delayedCount === 0) {
                (0, morgan_log_1.logGameNotification)(true, `队列信息：任务【发送游戏定时公告】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】多次重试仍然失败，触发关闭定时公告保护`);
                const resDisableGameRoutineNotification = yield this.serverConfigService.updateServerConfig({
                    name: 'EnableGameRoutineNotification',
                    value: JSON.stringify({ value: false }),
                });
            }
            else {
                (0, morgan_log_1.logGameNotification)(true, `队列信息：任务【发送游戏定时公告】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】错误，原因：${err}`);
                (0, morgan_log_1.logGameNotification)(true, `队列信息：任务【发送游戏定时公告】【timeStamp: ${job.data.timeStamp}, taskType: ${job.data.taskType} 】重试，间隔${FAILURE_RETRY_INTERVAL}毫秒`);
            }
        }));
        task_qull_1.GameRoutineNotificationQueue.process((job, done) => __awaiter(this, void 0, void 0, function* () {
            process.title = `${config_1.Config.getConf('SCUM_STORE_NO')}后端`;
            (0, morgan_log_1.logGameNotification)(false, `队列信息：接收到任务【发送游戏定时公告】${job.data.taskType}`);
            const { taskType } = job.data;
            let res = undefined;
            switch (taskType) {
                case GameRoutineNotificationTaskType.SEND_GAME_ROUTINE_NOTIFICATION:
                    res = yield this.addGameRoutineNotificationToQueue();
                    break;
                default:
                    break;
            }
            if (res.error === undefined) {
                done(null, res);
            }
            else {
                const { error } = res;
                done(new Error(error));
            }
        }));
    }
    addGameRoutineNotificationToQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let EnableGameRoutineNotification = yield this.serverConfigService.getServerConfig({ name: 'EnableGameRoutineNotification' });
                EnableGameRoutineNotification = JSON.parse(EnableGameRoutineNotification.value).value;
                let GameRoutineNotification = yield this.serverConfigService.getServerConfig({ name: 'GameRoutineNotification' });
                GameRoutineNotification = JSON.parse(GameRoutineNotification.value).value;
                if (EnableGameRoutineNotification && GameRoutineNotification && GameRoutineNotification.length) {
                    const resSaveQueueItem = yield this.queueService.saveQueueItem(GameRoutineNotification.join('\n'), 'announceMsg');
                    return { proccess: true };
                }
                else {
                    return { proccess: false };
                }
            }
            catch (e) {
                return { error: e.toString() };
            }
        });
    }
};
ServerSchedulesGameNotificationQueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [queue_service_1.QueueService,
        server_config_service_1.ServerConfigService])
], ServerSchedulesGameNotificationQueueService);
exports.ServerSchedulesGameNotificationQueueService = ServerSchedulesGameNotificationQueueService;
//# sourceMappingURL=server-schedules.game-notification.queue.service.js.map