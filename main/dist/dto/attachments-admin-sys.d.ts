export declare class ListAttachmentsSysDto {
    name?: string;
    url?: string;
    timestampStart?: string;
    timestampEnd?: string;
}
export declare class SearchAttachmentsSysDto {
    search?: string;
}
export declare class AttachmentsInfoSysDto {
    id: string;
}
export declare class AddAttachmentsSysDto {
    name: string;
    url: string;
}
export declare class UpdateAttachmentsSysDto {
    id: number;
    name: string;
    url: string;
}
export declare class DeleteAttachmentsSysDto {
    id: string;
}
export declare class ImportAttachmentsSysDto {
    data: any[];
}
