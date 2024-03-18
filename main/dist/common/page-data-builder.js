"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageDataBuilder = void 0;
function pageDataBuilder(pageData, page) {
    return {
        pageSize: page.pageSize,
        pageNum: page.pageNum + 1,
        count: pageData[1],
        list: pageData[0],
    };
}
exports.pageDataBuilder = pageDataBuilder;
//# sourceMappingURL=page-data-builder.js.map