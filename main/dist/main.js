"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require('express');
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const compression = require("compression");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app_module_1 = require("./app.module");
const config_1 = require("./config/config");
const morgan_log_1 = require("./common/morgan-log");
const all_exceptions_filter_1 = require("./filter/all-exceptions-filter");
const permissions_guard_1 = require("./guard/permissions.guard");
const redisStore_1 = require("./common/redisStore");
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, morgan_log_1.createMorgan)();
        (0, morgan_log_1.logBussiness)('----------------------------------', process.env.SERVER_NODE_ENV);
        let app;
        if (config_1.Config.getConf('LINK_MODE') === 'HTTPS') {
            const fs = require('fs');
            const path = require('path');
            const keyPath = path.resolve(__dirname, '../.env/keys/private.pem');
            const certPath = path.resolve(__dirname, '../.env/keys/certificate.crt');
            const httpsOptions = {
                key: fs.readFileSync(keyPath),
                cert: fs.readFileSync(certPath)
            };
            app = yield core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
        }
        else {
            app = yield core_1.NestFactory.create(app_module_1.AppModule, {});
        }
        const path = require('path');
        app.use('/admin', express.static(path.resolve(__dirname, '../admin')));
        app.use('/', (req, res, next) => {
            if (req.path === '/') {
                return res.redirect('/admin');
            }
            next();
        });
        app.use(session({
            store: redisStore_1.default,
            secret: config_1.Config.getConf('SESSION_SECRET'),
            resave: false,
            rolling: false,
            saveUninitialized: false,
            name: `scum.log.tool-${config_1.Config.getConf('SCUM_NO')}.sid`,
            cookie: {
                maxAge: 3 * 24 * 3600 * 1000,
                domain: config_1.Config.getConf('COOKIE_DOMAIN'),
                httpOnly: true,
            },
        }));
        app.enableCors({
            origin(requestOrigin, callback) {
                const CORS_DOMAIN = config_1.Config.getConf('CORS_DOMAIN') === undefined ? [undefined] : config_1.Config.getConf('CORS_DOMAIN').split(',');
                const result = !![
                    `${config_1.Config.getConf('COOKIE_DOMAIN')}`,
                    ...CORS_DOMAIN,
                ].filter(item => item !== undefined).filter(item => requestOrigin && requestOrigin.indexOf(item) !== -1).length;
                callback(null, result);
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
            allowedHeaders: ['with-credentials', 'content-type'],
        });
        app.use(cookieParser());
        app.use(helmet());
        app.use(bodyParser.json({ limit: '100kb' }));
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
        }));
        app.useGlobalGuards(new permissions_guard_1.PermissionsGuard());
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        app.use(compression({ filter: shouldCompress }));
        app.use(function (err, req, res, next) {
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            next();
        });
        app.disable('x-powered-by');
        app.use((0, morgan_log_1.getMorgan)());
        yield app.listen(config_1.Config.getConf('SERVER_PORT'), '0.0.0.0');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map