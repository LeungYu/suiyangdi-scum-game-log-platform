import { Attachments } from "../../entity/attachments.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class AttachmentsService {
    private readonly attachmentsRepository;
    constructor(attachmentsRepository: Repository<Attachments>);
    saveAttachments(name: string, url: string): Promise<Attachments>;
    updateAttachments(attachments: Attachments): Promise<UpdateResult> | undefined;
    getAttachmentsListLike(page: Page, data?: any): Promise<any>;
    searchAttachmentsList(page: Page, search?: string): Promise<any>;
    getAttachments(data: {
        [props: string]: any;
    }): Promise<Attachments>;
    deleteAttachments(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    clearAttachments(): Promise<any>;
    exportAttachmentsList(): Promise<any>;
}
