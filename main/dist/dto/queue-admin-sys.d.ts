export declare class ListQueueSysDto {
    type?: string;
    status?: string;
    buyId?: number;
    buyUserId?: any;
    timestampStart?: string;
    timestampEnd?: string;
}
export declare class InfoQueueSysDto {
    id: string;
}
export declare class AddQueueSysDto {
    commands: string;
    type: string;
    buyId?: number;
    buyUserId?: number;
}
export declare class updateStatusSysDto {
    id: number;
    status: string;
}
export declare class updateAllStatusSysDto {
    status: string;
}
export declare class RedoQueueSysDto {
    id: number;
}
export declare class DeleteQueueItemSysDto {
    id: string;
}
