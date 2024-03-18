"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPageQuery = void 0;
function formatPageQuery(page) {
    if (!page || page.pageSize === undefined || page.pageNum === undefined) {
        return Object.assign({ pageSize: 100, pageNum: 0 }, page);
    }
    else {
        page.pageSize > 999999 && (page.pageSize = 999999);
        page.pageSize < 0 && (page.pageSize = 10);
        page.pageNum = page.pageNum > 1 ? (page.pageNum - 1) * page.pageSize : 0;
        return page;
    }
}
exports.formatPageQuery = formatPageQuery;
//# sourceMappingURL=format-page-query.js.map