import { ItemTypes } from "../../entity/item-types.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class ItemTypesService {
    private readonly itemTypesRepository;
    constructor(itemTypesRepository: Repository<ItemTypes>);
    saveItem(name: string, cnName?: string, canBeDeleted?: boolean, fatherItemTypeId?: string): Promise<ItemTypes>;
    updateItemTypes(itemTypes: ItemTypes): Promise<UpdateResult> | undefined;
    listAllowFather(): Promise<any>;
    listChildren(data?: any): Promise<any>;
    getItemTypesList(page: Page, data?: any): Promise<any>;
    getItemTypesListLike(page: Page, data?: any): Promise<any>;
    getItemTypes(data: {
        [props: string]: any;
    }): Promise<any>;
    deleteItemTypes(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    exportItemTypesList(): Promise<any>;
}
