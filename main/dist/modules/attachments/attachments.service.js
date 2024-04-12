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
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attachments_entity_1 = require("../../entity/attachments.entity");
const typeorm_2 = require("typeorm");
let AttachmentsService = class AttachmentsService {
    constructor(attachmentsRepository) {
        this.attachmentsRepository = attachmentsRepository;
    }
    saveAttachments(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.attachmentsRepository.save(new attachments_entity_1.Attachments(name, url));
        });
    }
    updateAttachments(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.attachmentsRepository
                .createQueryBuilder()
                .update(attachments_entity_1.Attachments)
                .set(attachments);
            res = res.andWhere('id = :id', {
                id: attachments.id,
            });
            return yield res.execute();
        });
    }
    getAttachmentsListLike(page, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.attachmentsRepository.createQueryBuilder('attachments');
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            if (data.name !== undefined) {
                res = res.andWhere("name like :name", { name: `%${data.name}%` });
            }
            if (data.url !== undefined) {
                res = res.andWhere("url like :url", { url: `%${data.url}%` });
            }
            if (data.timestampStart && data.timestampEnd) {
                res = res.andWhere("createdTimeStamp >= :timestampStart", { timestampStart: data.timestampStart });
                res = res.andWhere("createdTimeStamp <= :timestampEnd", { timestampEnd: data.timestampEnd });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    searchAttachmentsList(page, search) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.attachmentsRepository.createQueryBuilder('attachments');
            if (search !== undefined) {
                res = res.where("name like :name", { name: `%${search}%` });
                res = res.orWhere("url like :url", { url: `%${search}%` });
            }
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .skip(page.pageNum)
                .take(page.pageSize)
                .getManyAndCount();
        });
    }
    getAttachments(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.attachmentsRepository.createQueryBuilder('attachments');
            if (data && (data.id || data.name !== undefined || data.url !== undefined)) {
                if (data.id) {
                    res = res.andWhere("id = :id", { id: data.id });
                }
                if (data.name !== undefined) {
                    res = res.andWhere("name = :name", { name: data.name });
                }
                if (data.url !== undefined) {
                    res = res.andWhere("url = :url", { url: data.url });
                }
                return yield res
                    .getOne();
            }
            else {
                return undefined;
            }
        });
    }
    deleteAttachments(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.attachmentsRepository.createQueryBuilder('attachments')
                .delete()
                .from(attachments_entity_1.Attachments);
            if (data.id) {
                res = res.andWhere("id = :id", { id: data.id });
            }
            return yield res
                .execute();
        });
    }
    clearAttachments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.attachmentsRepository
                .clear();
        });
    }
    exportAttachmentsList() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.attachmentsRepository.createQueryBuilder('attachments');
            return yield res
                .orderBy(`createdTimeStamp`, 'DESC')
                .limit(999999)
                .getMany();
        });
    }
};
AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attachments_entity_1.Attachments)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttachmentsService);
exports.AttachmentsService = AttachmentsService;
//# sourceMappingURL=attachments.service.js.map