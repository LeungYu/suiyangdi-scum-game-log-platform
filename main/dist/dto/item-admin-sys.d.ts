export declare class ListItemSysDto {
    name?: string;
    type?: string;
}
export declare class ItemInfoSysDto {
    id: number;
}
export declare class addItemSysDto {
    name: string;
    type: string;
    price: number;
    configType: string;
    isBlock: boolean;
    commands: string;
    imgSrc?: string;
    sales?: number;
    configs?: string;
}
export declare class updateItemSysDto {
    id: number;
    name?: string;
    type?: string;
    price?: number;
    configType?: string;
    isBlock?: string;
    commands?: string;
    imgSrc?: string;
    sales?: number;
    configs?: string;
    topTimeStamp?: string;
}
export declare class updateItemAllTeleportSysDto {
    isTeleport: boolean;
}
export declare class updateItemAllPriceSysDto {
    action: string;
    param: number;
}
export declare class updateItemsPriceSysDto {
    ids: string[];
    action: string;
    param: number;
}
export declare class deleteItemSysDto {
    id: string;
}
export declare class deleteItemsSysDto {
    ids: string[];
}
export declare class ImportItemsSysDto {
    type: string;
    data: any[];
}
