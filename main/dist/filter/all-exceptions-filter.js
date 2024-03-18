"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const response_builder_1 = require("../common/response-builder");
const morgan_log_1 = require("../common/morgan-log");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.ForbiddenException) {
            return response.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.DEFINED_PERMISSION, {}, 'NO ACCESS'));
        }
        if (exception instanceof common_1.BadRequestException) {
            const d = exception.getResponse();
            (0, morgan_log_1.logBussiness)(d.message[0]);
            return response.json((0, response_builder_1.responseBuilder)(response_builder_1.ResponseStatusCode.VALIDATION_ERROR, {}, d.message[0]));
        }
        (0, morgan_log_1.logBussiness)(`${status} ${request.url}, ${exception.message}`);
        response.status(200).json({
            status,
            timestamp: new Date().toISOString(),
            path: request.url,
            msg: exception.message,
        });
        throw exception;
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all-exceptions-filter.js.map