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
exports.Item = void 0;
const typeorm_1 = require("typeorm");
let Item = class Item {
    constructor(name, type, price, configType, isBlock, commands, imgSrc, sales, configs) {
        this.name = name;
        this.type = type;
        const timeStamp = Date.now() + '';
        this.createdTimeStamp = timeStamp;
        this.topTimeStamp = timeStamp;
        if (price) {
            this.price = price;
        }
        if (configType) {
            this.configType = configType;
        }
        if (typeof isBlock === 'boolean') {
            this.isBlock = isBlock;
        }
        if (commands) {
            this.commands = commands;
        }
        if (imgSrc) {
            this.imgSrc = imgSrc;
        }
        if (sales) {
            this.sales = sales;
        }
        if (configs) {
            this.configs = configs;
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, unique: true }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: null }),
    __metadata("design:type", String)
], Item.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: null }),
    __metadata("design:type", String)
], Item.prototype, "configType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "isBlock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], Item.prototype, "commands", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], Item.prototype, "imgSrc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: null }),
    __metadata("design:type", String)
], Item.prototype, "configs", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13, default: null }),
    __metadata("design:type", String)
], Item.prototype, "topTimeStamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 13 }),
    __metadata("design:type", String)
], Item.prototype, "createdTimeStamp", void 0);
Item = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Number, String, Boolean, String, String, Number, String])
], Item);
exports.Item = Item;
//# sourceMappingURL=item.entity.js.map