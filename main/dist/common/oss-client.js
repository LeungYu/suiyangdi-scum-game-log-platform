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
exports.deleteFile = exports.getFile = exports.getMeta = exports.getStream = exports.uploadFile = void 0;
const OSS = require("ali-oss");
const config_1 = require("../config/config");
const client = new OSS({
    region: config_1.Config.getConf('OSS_REGION'),
    accessKeyId: config_1.Config.getConf('OSS_ACCESS_KEY_ID'),
    accessKeySecret: config_1.Config.getConf('OSS_ACCESS_KEY_SECRET'),
    bucket: config_1.Config.getConf('OSS_BUCKET'),
});
function uploadFile(url, path) {
    return client.put(url, path).then(res => {
        return {
            statusCode: res.res.statusCode,
        };
    });
}
exports.uploadFile = uploadFile;
function getStream(filePath, options) {
    return client.getStream(filePath, options).then(res => {
        return {
            service: 'ali',
            status: res.res.status,
            headers: res.res.headers,
            stream: res.stream,
        };
    });
}
exports.getStream = getStream;
function getMeta(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return client.getObjectMeta(filePath, options).then(res => {
            return {
                service: 'ali',
                status: res.res.statusCode,
                headers: res.res.headers,
            };
        });
    });
}
exports.getMeta = getMeta;
function getFile(filePath, options) {
    return client.get(filePath, options).then(res => {
        return {
            service: 'ali',
            status: res.res.statusCode,
            content: res.content,
        };
    });
}
exports.getFile = getFile;
function deleteFile(url) {
    return client.delete(url);
}
exports.deleteFile = deleteFile;
const ossClient = {
    uploadFile,
    getStream,
    getFile,
    deleteFile,
    getMeta,
};
exports.default = ossClient;
//# sourceMappingURL=oss-client.js.map