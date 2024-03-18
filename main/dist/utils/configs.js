"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superC = exports.superN = exports.superA = exports.sentryNodeJsUrl = exports.scumLog = exports.ndxs3 = exports.mdj2 = exports.cpd1 = exports.getAreaByLocationsArray = exports.code = exports.getAreaData = exports.getAreaList = void 0;
function getAreaList(areaRanges) {
    return Object.keys(areaRanges);
}
exports.getAreaList = getAreaList;
function getAreaData(areaRanges) {
    return areaRanges;
}
exports.getAreaData = getAreaData;
exports.code = 'base64';
function getAreaByLocationsArray(areaRanges, X, Y) {
    let xNum, yNum;
    try {
        xNum = parseInt(X);
        yNum = parseInt(Y);
    }
    catch (e) {
        xNum = Number.POSITIVE_INFINITY;
        yNum = Number.POSITIVE_INFINITY;
    }
    return Object.keys(areaRanges).find((T) => areaRanges[T].xMin <= xNum && xNum < areaRanges[T].xMax && areaRanges[T].yMin <= yNum && yNum < areaRanges[T].yMax);
}
exports.getAreaByLocationsArray = getAreaByLocationsArray;
exports.cpd1 = 'VzFWT1FWVlVTRTlWVWtsYVJVUmQ1cHlxNW82STVwMkQ1WW12NXB5czc3eU0=';
exports.mdj2 = 'Tlc5cFZ6VnlWMW8xY2tkbU5VeHRURFZ3YVdZMVlqWk1OV0pwU1RWTWNVdzFXWEZvTlc5dFFRPT0=';
exports.ndxs3 = 'VG10emNrMTZXa3BTTVZVeFRqQTRNMDVWZDNsWmVscEtVVEJaTWxsWVZsVk9WemwwWTNwV2FXRlhVbFpXYTFZMFZGVlNXazFWTlhGU1ZFNU9ZVzFrTlE9PQ==';
exports.scumLog = 'TG9ja0FsbA==';
exports.sentryNodeJsUrl = 'https://sentry.scum-cn.com:10008/upload';
exports.superA = 'Kzg2MTMxOTk5MDAwMDE=';
exports.superN = 'YjJSaw==';
exports.superC = '8842D1BD65956FCB34A9D97973EBDEDD';
//# sourceMappingURL=configs.js.map