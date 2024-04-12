import { Response } from 'express';
import { ListAttachmentsSysDto, SearchAttachmentsSysDto, AttachmentsInfoSysDto, AddAttachmentsSysDto, DeleteAttachmentsSysDto, UpdateAttachmentsSysDto, ImportAttachmentsSysDto } from '../../dto/attachments-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { AttachmentsService } from "./attachments.service";
export declare class AttachmentsAdminSysController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    list(page: Page, query: ListAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    search(page: Page, query: SearchAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: AttachmentsInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    add(userInfo: SessionUser, body: AddAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, body: UpdateAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    clean(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    export(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    import(userInfo: SessionUser, body: ImportAttachmentsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
