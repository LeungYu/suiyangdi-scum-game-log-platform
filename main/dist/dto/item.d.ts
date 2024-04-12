export declare class ListItemDto {
    id?: string;
    name?: string;
    nameLike?: string;
    type?: string;
    price?: number;
    commands?: string;
    imgSrc?: string;
    sales?: number;
    configs?: string;
}
export declare class ItemInfoDto {
    id?: string;
    name?: string;
    type?: string;
    price?: number;
    commands?: string;
    imgSrc?: string;
    sales?: number;
    configs?: string;
}
export declare class ListItemInfoByIdDto {
    itemIds: any[];
}
