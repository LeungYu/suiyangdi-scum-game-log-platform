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
exports.dirExists = exports.readDir = exports.getStat = void 0;
const fs = require("fs");
const path = require("path");
function getStat(targetPath) {
    return new Promise((resolve, reject) => {
        fs.stat(targetPath, (err, stats) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(stats);
            }
        });
    });
}
exports.getStat = getStat;
function readDir(targetPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(targetPath, (err, files) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(files);
            }
        });
    });
}
exports.readDir = readDir;
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
function dirExists(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExists = yield getStat(dir);
        if (isExists && isExists.isDirectory()) {
            return true;
        }
        else if (isExists) {
            return false;
        }
        const tempDir = path.parse(dir).dir;
        const status = yield dirExists(tempDir);
        let mkdirStatus;
        if (status) {
            mkdirStatus = yield mkdir(dir);
        }
        return mkdirStatus;
    });
}
exports.dirExists = dirExists;
//# sourceMappingURL=files.js.map