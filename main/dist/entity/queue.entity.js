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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const typeorm_1 = require("typeorm");
let Queue = class Queue {
    constructor(commands, type, status, buyId, buyUserId, isNewSet) {
        this.commands = commands;
        this.type = type;
        this.createdTimeStamp = Date.now() + '';
        if (status !== undefined) {
            this.status = status;
        }
        if (buyId !== undefined) {
            this.buyId = buyId;
        }
        if (buyUserId !== undefined) {
            this.buyUserId = buyUserId;
        }
        if (isNewSet !== undefined) {
            this.isNewSet = isNewSet;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Queue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Queue.prototype, "commands", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], Queue.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, default: 'created' }),
    __metadata("design:type", String)
], Queue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], Queue.prototype, "buyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: null }),
    __metadata("design:type", Object)
], Queue.prototype, "buyUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: null }),
    __metadata("design:type", Boolean)
], Queue.prototype, "isNewSet", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Queue.prototype, "createdTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], Queue.prototype, "updateTimeStamp", void 0);
Queue = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, Object, Object, Boolean])
], Queue);
exports.Queue = Queue;
//# sourceMappingURL=queue.entity.js.map