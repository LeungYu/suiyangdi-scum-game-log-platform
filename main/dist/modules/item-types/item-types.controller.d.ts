import { Response } from 'express';
import { ItemTypesInfoDto, ListChildrenItemTypesDto, ListItemTypesDto } from '../../dto/item-types';
import { Page } from "../../dto/page";
import { ItemTypesService } from "./item-types.service";
export declare class ItemTypesController {
    private readonly itemTypesService;
    constructor(itemTypesService: ItemTypesService);
    list(page: Page, query: ListItemTypesDto, res: Response): Promise<Response<any, Record<string, any>>>;
    listChildren(query: ListChildrenItemTypesDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: ItemTypesInfoDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
