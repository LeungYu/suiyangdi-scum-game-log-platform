"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessUser = void 0;
const common_1 = require("@nestjs/common");
exports.SessUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.session) {
        const userInfo = request.session.user;
        return userInfo;
    }
    return null;
});
//# sourceMappingURL=user.decorator.js.map