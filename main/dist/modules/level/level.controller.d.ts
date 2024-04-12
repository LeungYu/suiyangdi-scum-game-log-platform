import { Response } from 'express';
import { LevelInfoDto, ListLevelDto } from '../../dto/level';
import { Page } from "../../dto/page";
import { LevelService } from "./level.service";
export declare class LevelController {
    private readonly levelService;
    constructor(levelService: LevelService);
    list(page: Page, query: ListLevelDto, res: Response): Promise<Response<any, Record<string, any>>>;
    info(query: LevelInfoDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
