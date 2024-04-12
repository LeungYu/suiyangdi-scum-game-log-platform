import { Response } from 'express';
import { addItemSysDto, deleteItemSysDto, deleteItemsSysDto, ImportItemsSysDto, ItemInfoSysDto, ListItemSysDto, updateItemAllTeleportSysDto, updateItemAllPriceSysDto, updateItemsPriceSysDto, updateItemSysDto } from '../../dto/item-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ItemService } from "./item.service";
export declare class ItemAdminSysController {
    private readonly itemService;
    constructor(itemService: ItemService);
    list(page: Page, query: ListItemSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ItemInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    add(userInfo: SessionUser, body: addItemSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, body: updateItemSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateAllTeleport(userInfo: SessionUser, body: updateItemAllTeleportSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateItemAllPrice(userInfo: SessionUser, body: updateItemAllPriceSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateItemsPrice(userInfo: SessionUser, body: updateItemsPriceSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: deleteItemSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteItems(userInfo: SessionUser, body: deleteItemsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    export(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    import(userInfo: SessionUser, body: ImportItemsSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    specialImportByCsv(userInfo: SessionUser, file: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
