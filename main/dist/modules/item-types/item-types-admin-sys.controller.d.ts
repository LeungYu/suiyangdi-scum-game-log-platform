import { Response } from 'express';
import { ListItemTypesSysDto, ItemTypesInfoSysDto, AddItemTypesSysDto, UpdateItemTypesSysDto, DeleteItemTypesSysDto, DeleteItemsTypesSysDto, ImportItemTypesSysDto } from '../../dto/item-types-admin-sys';
import { SessionUser } from '../../dto/session-user';
import { Page } from "../../dto/page";
import { ItemTypesService } from "./item-types.service";
import { ItemService } from "../item/item.service";
export declare class ItemTypesAdminSysController {
    private readonly itemService;
    private readonly itemTypesService;
    constructor(itemService: ItemService, itemTypesService: ItemTypesService);
    list(page: Page, query: ListItemTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listAllowFather(res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ItemTypesInfoSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    add(userInfo: SessionUser, body: AddItemTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, body: UpdateItemTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, query: DeleteItemTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteItemsTypes(userInfo: SessionUser, body: DeleteItemsTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
    export(userInfo: SessionUser, res: Response): Promise<Response<any, Record<string, any>>>;
    import(userInfo: SessionUser, body: ImportItemTypesSysDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
