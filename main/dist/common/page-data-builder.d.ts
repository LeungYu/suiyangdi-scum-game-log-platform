import { Page } from '../dto/page';
export declare function pageDataBuilder(pageData: [any[], number], page: Page): {
    pageSize: number;
    pageNum: number;
    count: number;
    list: any[];
};
