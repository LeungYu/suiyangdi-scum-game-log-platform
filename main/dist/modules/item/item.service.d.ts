import { Item } from "../../entity/item.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class ItemService {
    private readonly itemRepository;
    constructor(itemRepository: Repository<Item>);
    saveItem(name: string, type: string, price?: number, configType?: string, isBlock?: boolean, commands?: string, imgSrc?: string, sales?: number, configs?: string): Promise<Item>;
    updateItem(item: Item): Promise<UpdateResult> | undefined;
    updateAllItemPrice(action: string, param: number): Promise<UpdateResult> | undefined;
    updateItemPrice(itemId: string, action: string, param: number): Promise<UpdateResult> | undefined;
    updateAllItemType(originItemType: string, newItemType: string): Promise<UpdateResult> | undefined;
    updateItemSales(id: number, change: number): Promise<UpdateResult> | undefined;
    getItemList(page: Page, data?: any, noBlock?: boolean | undefined): Promise<any>;
    getItemListLike(page: Page, data?: any): Promise<any>;
    getItem(data: {
        [props: string]: any;
    }, noBlock?: boolean | undefined): Promise<Item>;
    deleteItem(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    exportItemsList(): Promise<any>;
}
