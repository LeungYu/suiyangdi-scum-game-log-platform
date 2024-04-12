import { Response } from 'express';
import { ItemInfoDto, ListItemDto, ListItemInfoByIdDto } from '../../dto/item';
import { Page } from "../../dto/page";
import { ItemService } from "./item.service";
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    listItemInfoById(body: ListItemInfoByIdDto, res: Response): Promise<Response<any, Record<string, any>>>;
    list(page: Page, query: ListItemDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ItemInfoDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
