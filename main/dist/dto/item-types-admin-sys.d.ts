export declare class ListItemTypesSysDto {
    name?: string;
    cnName?: string;
    fatherItemTypeId?: string;
    canBeDeleted?: boolean;
}
export declare class ItemTypesInfoSysDto {
    id: string;
}
export declare class AddItemTypesSysDto {
    name: string;
    cnName?: string;
    fatherItemTypeId?: string;
    canBeDeleted?: boolean;
}
export declare class UpdateItemTypesSysDto {
    id: number;
    name?: string;
    cnName?: string;
    fatherItemTypeId?: string;
    canBeDeleted?: boolean;
    topTimeStamp?: string;
}
export declare class DeleteItemTypesSysDto {
    id: string;
}
export declare class DeleteItemsTypesSysDto {
    ids: string[];
}
export declare class ImportItemTypesSysDto {
    type: string;
    data: any[];
}
