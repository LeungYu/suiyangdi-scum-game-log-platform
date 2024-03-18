"use strict";
const config_1 = require("./config");
const path = require("path");
const TYPEORM_SYNC = config_1.Config.getConf('MYSQL_HOST') === 'localhost';
const ORMConfig = {
    type: 'mysql',
    charset: 'utf8mb4',
    host: config_1.Config.getConf('MYSQL_HOST'),
    port: +config_1.Config.getConf('MYSQL_PORT'),
    username: config_1.Config.getConf('MYSQL_USERNAME'),
    password: config_1.Config.getConf('MYSQL_PASS'),
    database: config_1.Config.getConf('MYSQL_DATABASE'),
    entities: [path.resolve(__dirname, '../', './**/*.entity{.ts,.js}')],
    synchronize: TYPEORM_SYNC,
    logging: false,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrate',
    migrations: [path.resolve(__dirname, '../', './migrations/**/*{.ts,.js}')],
    cli: {
        migrationsDir: 'migrations',
    },
    extra: {
        options: '-c lock_timeout=60000ms',
        statement_timeout: 60000,
    },
};
module.exports = ORMConfig;
//# sourceMappingURL=typeorm.config.js.map