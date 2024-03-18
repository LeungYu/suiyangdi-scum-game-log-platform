"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = void 0;
const crypto = require('crypto');
function md5(str) {
    const m = crypto.createHash('md5');
    m.update(str, 'utf8');
    return m.digest('hex').toUpperCase();
}
exports.md5 = md5;
//# sourceMappingURL=md5.js.map