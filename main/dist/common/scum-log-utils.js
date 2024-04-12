"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tranferEconomyRecords = exports.tranferRawEconomyRecordsToBlocks = exports.tranferViolationsRecordLog = exports.tranferActionRecordLog = exports.tranferChatMessageLog = exports.tranferAdminCommandLog = exports.tranferLoginLog = exports.tranferKillLog = exports.isLaterThanLegalDaysAgo = void 0;
const moment = require("moment");
const configs_1 = require("../utils/configs");
const isLaterThanLegalDaysAgo = (rawText) => {
    const splitBackslash = rawText.split('\\');
    const rawDateTime = splitBackslash[splitBackslash.length - 1].substring(5, splitBackslash[splitBackslash.length - 1].indexOf('.'));
    const timeStamp = moment(rawDateTime, 'YYYYMMDDHHmmss').valueOf();
    const ThreeDayAgoTimeStamp = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return timeStamp >= ThreeDayAgoTimeStamp;
};
exports.isLaterThanLegalDaysAgo = isLaterThanLegalDaysAgo;
const tranferKillLog = (rawText, GameAreaRanges) => {
    const spliter = rawText.split(': ');
    if (spliter && spliter[1] && spliter[1].indexOf('{') === 0) {
        const BeJsonfied = rawText.substring(spliter[0].length + 2);
        try {
            const Json = JSON.parse(BeJsonfied);
            if (Json.Killer && typeof Json.Killer === 'object' && Json.Victim && typeof Json.Victim === 'object') {
                const killerSteamId = Json.Killer.UserId;
                const killerName = Json.Killer.ProfileName;
                const killerLocations = `${Json.Killer.ServerLocation.X},${Json.Killer.ServerLocation.Y},${Json.Killer.ServerLocation.Z}`;
                const killerArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, Json.Killer.ServerLocation.X, Json.Killer.ServerLocation.Y);
                const victimSteamId = Json.Victim.UserId;
                const victimName = Json.Victim.ProfileName;
                const victimLocations = `${Json.Victim.ServerLocation.X},${Json.Victim.ServerLocation.Y},${Json.Victim.ServerLocation.Z}`;
                const victimArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, Json.Victim.ServerLocation.X, Json.Victim.ServerLocation.Y);
                const weapon = Json.Weapon;
                const distance = weapon.endsWith('[Explosion]') ? 0 : parseFloat((Math.sqrt(Math.pow(Json.Killer.ServerLocation.X - Json.Victim.ServerLocation.X, 2) + Math.pow(Json.Killer.ServerLocation.Y - Json.Victim.ServerLocation.Y, 2) + Math.pow(Json.Killer.ServerLocation.Z - Json.Victim.ServerLocation.Z, 2)) / 100).toFixed(2));
                const isEventKill = Json.Victim.IsInGameEvent;
                const occuredTimeStamp = (moment(spliter[0], 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
                return {
                    logType: 'kill',
                    killerSteamId,
                    killerName,
                    killerLocations,
                    killerArea,
                    victimSteamId,
                    victimName,
                    victimLocations,
                    victimArea,
                    weapon,
                    distance,
                    isEventKill,
                    occuredTimeStamp
                };
            }
        }
        catch (e) {
            return undefined;
        }
    }
    else {
        return undefined;
    }
};
exports.tranferKillLog = tranferKillLog;
const normalLoginRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'([\s|\S]*) (\d{17}):([\s|\S]*)\((\d*)\)\' logged in at: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?)/;
const droneLoginRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'([\s|\S]*) (\d{17}):([\s|\S]*)\((\d*)\)\' logged in at: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?) \(as drone\)/;
const illegalDroneLoginRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'([\s|\S]*) (\d{17}):([\s|\S]*)\((\d*)\)\' attempted to log in as drone, but had no admin privileges/;
const normalLogoutRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'([\s|\S]*) (\d{17}):([\s|\S]*)\((\d*)\)\' logged out at: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?)/;
const tranferLoginLog = (rawText, GameAreaRanges) => {
    const isMatchNormalLogin = normalLoginRegExp.test(rawText);
    const isMatchDroneLogin = droneLoginRegExp.test(rawText);
    const isMatchIllegalDroneLogin = illegalDroneLoginRegExp.test(rawText);
    const isMatchNormalLogout = normalLogoutRegExp.test(rawText);
    if (isMatchNormalLogin || isMatchDroneLogin || isMatchIllegalDroneLogin || isMatchNormalLogout) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, loginIp, steamId, scumId, sessionId, originalLocationText, X, Y, Z] = normalLoginRegExp.exec(rawText) || droneLoginRegExp.exec(rawText) || illegalDroneLoginRegExp.exec(rawText) || normalLogoutRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let loginLocations = undefined;
        let loginArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            loginLocations = `${X},${Y},${Z}`;
            loginArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const otherConfig = {};
        if (loginArea !== undefined && loginLocations !== undefined) {
            otherConfig.loginArea = loginArea;
            otherConfig.loginLocations = loginLocations;
        }
        otherConfig.asDrone = isMatchDroneLogin || isMatchIllegalDroneLogin;
        otherConfig.illegalDrone = isMatchIllegalDroneLogin;
        return { logType: 'login', status: isMatchNormalLogout ? 'logout' : 'login', scumId, steamId, sessionId, loginIp, otherConfig, createdTimeStamp };
    }
    else {
        return undefined;
    }
};
exports.tranferLoginLog = tranferLoginLog;
const normalAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' Command: \'([\s|\S]*)\'/;
const illegalDroneAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' possessed a drone even though they are not an admin!/;
const mapClickTeleportToPlayerAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' Used map click teleport to player: \'(\d{17}):([\s|\S]*)\((\d*)\)\' Location: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?)/;
const mapClickTeleportToVehicleAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' Used map click teleport to vehicle: \'([\s|\S]*)\' Location: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?)/;
const targetTeleportToAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' Target of TeleportTo: \'(\d{17}):([\s|\S]*)\((\d*)\)\' Location: (X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)|\?)/;
const updateCustomZonesAdminCommandRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): Custom Zones updated by \{([\s|\S]*) \((\d*), (\d{17})\)\}/;
const tranferAdminCommandLog = (rawText, GameAreaRanges) => {
    const isMatchNormalAdminCommand = normalAdminCommandRegExp.test(rawText);
    const isMatchIllegalDroneAdminCommand = illegalDroneAdminCommandRegExp.test(rawText);
    const isMatchMapClickTeleportToPlayerAdminCommand = mapClickTeleportToPlayerAdminCommandRegExp.test(rawText);
    const isMatchMapClickTeleportToVehicleAdminCommand = mapClickTeleportToVehicleAdminCommandRegExp.test(rawText);
    const isMatchTargetTeleportToAdminCommand = targetTeleportToAdminCommandRegExp.test(rawText);
    const isMatchUpdateCustomZonesAdminCommand = updateCustomZonesAdminCommandRegExp.test(rawText);
    if (isMatchNormalAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId, content] = normalAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        return { scumId, steamId, sessionId, content, sendTimeStamp };
    }
    else if (isMatchIllegalDroneAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId] = illegalDroneAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        return { scumId, steamId, sessionId, content: '非管理员身份使用无人机进入服务器', sendTimeStamp };
    }
    else if (isMatchMapClickTeleportToPlayerAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId, toSteamId, toScumId, toSessionId, originalLocationText, X, Y, Z] = mapClickTeleportToPlayerAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let locations = undefined;
        let area = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            locations = `${X},${Y},${Z}`;
            area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return { scumId, steamId, sessionId, content: `在地图上点击玩家(steam ID: ${toSteamId} 玩家角色名称: '${toScumId}'[${toSessionId}])并传送到他身边 目标位置: X=${X} Y=${Y} Z=${Z}`, otherConfig: { locations, area }, sendTimeStamp };
    }
    else if (isMatchMapClickTeleportToVehicleAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId, toVehicleType, originalLocationText, X, Y, Z] = mapClickTeleportToVehicleAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let locations = undefined;
        let area = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            locations = `${X},${Y},${Z}`;
            area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return { scumId, steamId, sessionId, content: `在地图上点击载具(类型: ${toVehicleType})并传送到它身边 目标位置: X=${X} Y=${Y} Z=${Z}`, otherConfig: { locations, area }, sendTimeStamp };
    }
    else if (isMatchTargetTeleportToAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId, toSteamId, toScumId, toSessionId, originalLocationText, X, Y, Z] = targetTeleportToAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let locations = undefined;
        let area = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            locations = `${X},${Y},${Z}`;
            area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return { scumId, steamId, sessionId, content: `传送到玩家(steam ID: ${toSteamId} 玩家角色名称: '${toScumId}'[${toSessionId}])身边 目标位置: X=${X} Y=${Y} Z=${Z}`, otherConfig: { locations, area }, sendTimeStamp };
    }
    else if (isMatchUpdateCustomZonesAdminCommand) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, scumId, sessionId, steamId] = updateCustomZonesAdminCommandRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        return { scumId, steamId, sessionId, content: `更新地图圈`, sendTimeStamp };
    }
    else {
        return undefined;
    }
};
exports.tranferAdminCommandLog = tranferAdminCommandLog;
const normalChatMessageRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \'(\d{17}):([\s|\S]*)\((\d*)\)\' \'(Global|Squad|Local|Admin): ([\s|\S]*)\'/;
const tranferChatMessageLog = (rawText) => {
    const isMatchNormalChatMessage = normalChatMessageRegExp.test(rawText);
    if (isMatchNormalChatMessage) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, steamId, scumId, sessionId, type, content] = normalChatMessageRegExp.exec(rawText);
        const sendTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        return { scumId, steamId, sessionId, type, content, sendTimeStamp };
    }
    else {
        return undefined;
    }
};
exports.tranferChatMessageLog = tranferChatMessageLog;
const normalMineLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogTrap\] (Crafted|Armed|Disarmed)\. User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Trap name: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const triggeredMineLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogTrap\] (Triggered)\. User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Trap name: ([\s|\S]*)\. Owner: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A|-1\(\)|0\(World\))\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const triggeredWithoutOwnerMineLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogTrap\] (Triggered)\. User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Trap name: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const createdFlagLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] Created FlagId: ([\s|\S]*) Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\)) Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const destroyedFlagLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] Destroyed FlagId: ([\s|\S]*) Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\)) Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const overtakeStartedLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] Overtake started\. User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A) Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)\. Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. FlagId: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const overtakeCanceledLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] Overtake canceled\. User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. FlagId: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const overtakeAbandonedLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] Abandoned on overtake\. Overtaker: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Old owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. FlagId: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const overtakeOvertakenLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogBaseBuilding\] \[Flag\] (Overtaken|Overtaken \([\s|\S]*\))\. New owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Old owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. FlagId: ([\s|\S]*)\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const miniGameLockpickLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogMinigame\] \[[\s|\S]*Lockpick[\s|\S]*\] User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Success: ([\s|\S]*)\. Elapsed time: ([\s|\S]*)\. Failed attempts: (\d*)\. Target object: ([\s|\S]*)\. Lock type: ([\s|\S]*)\. User owner: ((\d*)\(\[(\d{17})\] ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const miniGameBombDefusalWithoutLockTypeLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogMinigame\] \[BP_BombDefusalMinigame_C\] User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Success: ([\s|\S]*)\. Elapsed time: ([\s|\S]*)\. Failed attempts: (\d*)\. Target object: ([\s|\S]*)\. User owner: ((\d*)\(\[(\d{17})\] ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const miniGameBombDefusalWithLockTypeLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogMinigame\] \[BP_LockBombDefusalMinigame_C\] User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Success: ([\s|\S]*)\. Elapsed time: ([\s|\S]*)\. Failed attempts: (\d*)\. Target object: ([\s|\S]*)\. Lock type: ([\s|\S]*)\. User owner: ((\d*)\(\[(\d{17})\] ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const miniGameBankATMLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogMinigame\] \[[\s|\S]*BankATM[\s|\S]*\] User: (([\s|\S]*) \((\d*), (\d{17})\)|N\/A)\. Success: ([\s|\S]*)\. Elapsed time: ([\s|\S]*)\. Failed attempts: (\d*)\./;
const buryChestLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogChest\] \[Bury\] ChestId: ([\s|\S]*) Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\)) Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*) Burier: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))/;
const unburyChestLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[LogChest\] \[Unbury\] ChestId: ([\s|\S]*) Owner: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\)) Location: X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*) Unburier: ((\d{17})\s?\((\d*), ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))/;
const isSpecialUserInfo = (rawUserInfo) => {
    if (rawUserInfo === 'N/A') {
        return '不存在';
    }
    else if (rawUserInfo === '-1()') {
        return '无';
    }
    else if (rawUserInfo === '0(World)') {
        return '地图专属';
    }
    else {
        return false;
    }
};
const tranferActionRecordLog = (rawText, GameAreaRanges) => {
    const isMatchNormalMineLog = normalMineLogRegExp.test(rawText);
    const isMatchTriggeredMineLog = triggeredMineLogRegExp.test(rawText);
    const isMatchTriggeredWithoutOwnerMineLog = triggeredWithoutOwnerMineLogRegExp.test(rawText);
    const isMatchCreatedFlagLog = createdFlagLogRegExp.test(rawText);
    const isMatchDestroyedFlagLog = destroyedFlagLogRegExp.test(rawText);
    const isMatchOvertakeStartedLog = overtakeStartedLogRegExp.test(rawText);
    const isMatchOvertakeCanceledLog = overtakeCanceledLogRegExp.test(rawText);
    const isMatchOvertakeAbandonedLog = overtakeAbandonedLogRegExp.test(rawText);
    const isMatchOvertakeOvertakenLog = overtakeOvertakenLogRegExp.test(rawText);
    const isMatchMiniGameLockpickLog = miniGameLockpickLogRegExp.test(rawText);
    const isMatchMiniGameBombDefusalWithoutLockTypeLog = miniGameBombDefusalWithoutLockTypeLogRegExp.test(rawText);
    const isMatchMiniGameBombDefusalWithLockTypeLog = miniGameBombDefusalWithLockTypeLogRegExp.test(rawText);
    const isMatchMiniGameBankATMLogRegExp = miniGameBankATMLogRegExp.test(rawText);
    const isMatchBuryChestLogRegExp = buryChestLogRegExp.test(rawText);
    const isMatchUnburyChestLogRegExp = unburyChestLogRegExp.test(rawText);
    if (!(isMatchNormalMineLog || isMatchTriggeredMineLog || isMatchTriggeredWithoutOwnerMineLog || isMatchOvertakeStartedLog || isMatchCreatedFlagLog || isMatchDestroyedFlagLog || isMatchOvertakeCanceledLog || isMatchOvertakeAbandonedLog || isMatchOvertakeOvertakenLog || isMatchMiniGameLockpickLog || isMatchMiniGameBombDefusalWithoutLockTypeLog || isMatchMiniGameBombDefusalWithLockTypeLog || isMatchMiniGameBankATMLogRegExp || isMatchBuryChestLogRegExp || isMatchUnburyChestLogRegExp)) {
        console.log("[UNKNOWN] ", rawText);
    }
    if (isMatchNormalMineLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, action, userOriginalText, scumId, sessionId, steamId, targetName, X, Y, Z] = normalMineLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return {
            scumId, steamId, sessionId, type: 'trap', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: { action: action.toLowerCase() }
        };
    }
    else if (isMatchTriggeredMineLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, action, userOriginalText, scumId, sessionId, steamId, targetName, ownerUserOriginalText, ownerScumId, ownerSessionId, ownerSteamId, X, Y, Z] = triggeredMineLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'trap', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: {
                action: action.toLowerCase(),
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' }
            }
        };
    }
    else if (isMatchTriggeredWithoutOwnerMineLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, action, userOriginalText, scumId, sessionId, steamId, targetName, X, Y, Z] = triggeredWithoutOwnerMineLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'trap', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: {
                action: action.toLowerCase()
            }
        };
    }
    else if (isMatchCreatedFlagLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, flagId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, flagX, flagY, flagZ] = createdFlagLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let flagLocations = undefined;
        let flagArea = undefined;
        if (flagX !== undefined && flagY !== undefined && flagZ !== undefined) {
            flagLocations = `${flagX},${flagY},${flagZ}`;
            flagArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, flagX, flagY);
        }
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '',
            type: 'flag', createdLocations: flagLocations, createdArea: flagArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: 'createdFlag',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                flag: { id: flagId, locations: flagLocations, area: flagArea }
            }
        };
    }
    else if (isMatchDestroyedFlagLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, flagId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, flagX, flagY, flagZ] = destroyedFlagLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let flagLocations = undefined;
        let flagArea = undefined;
        if (flagX !== undefined && flagY !== undefined && flagZ !== undefined) {
            flagLocations = `${flagX},${flagY},${flagZ}`;
            flagArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, flagX, flagY);
        }
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '',
            type: 'flag', createdLocations: flagLocations, createdArea: flagArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: 'destroyedFlag',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                flag: { id: flagId, locations: flagLocations, area: flagArea }
            }
        };
    }
    else if (isMatchOvertakeStartedLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, X, Y, Z, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, flagId, flagX, flagY, flagZ] = overtakeStartedLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        let flagLocations = undefined;
        let flagArea = undefined;
        if (flagX !== undefined && flagY !== undefined && flagZ !== undefined) {
            flagLocations = `${flagX},${flagY},${flagZ}`;
            flagArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, flagX, flagY);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'baseBuildingTake', createdLocations, createdArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: 'overtakeStarted',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                flag: { id: flagId, locations: flagLocations, area: flagArea }
            }
        };
    }
    else if (isMatchOvertakeCanceledLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, flagId, X, Y, Z] = overtakeCanceledLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'baseBuildingTake', createdLocations, createdArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: 'overtakeCanceled',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                flag: { id: flagId }
            }
        };
    }
    else if (isMatchOvertakeAbandonedLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, steamId, sessionId, scumId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, flagId, X, Y, Z] = overtakeAbandonedLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'baseBuildingTake', createdLocations, createdArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: 'overtakeAbandoned',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                flag: { id: flagId }
            }
        };
    }
    else if (isMatchOvertakeOvertakenLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, rawAction, newOwnerUserOriginalText, newOwnerSteamId, newOwnerSessionId, newOwnerScumId, oldOwnerUserOriginalText, oldOwnerSteamId, oldOwnerSessionId, oldOwnerScumId, flagId, X, Y, Z] = overtakeOvertakenLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialNewOwner = isSpecialUserInfo(newOwnerUserOriginalText);
        const isSpecialOldOwner = isSpecialUserInfo(oldOwnerUserOriginalText);
        return {
            scumId: isSpecialNewOwner === false ? newOwnerScumId : isSpecialNewOwner, steamId: isSpecialNewOwner === false ? newOwnerSteamId : '', sessionId: isSpecialNewOwner === false ? newOwnerSessionId : '',
            type: 'baseBuildingChange', createdLocations, createdArea, createdTimeStamp, targetName: 'flag',
            otherConfig: {
                action: rawAction === 'Overtaken' ? 'overtaken' : 'overtakenOther',
                owner: { scumId: isSpecialOldOwner === false ? oldOwnerScumId : isSpecialOldOwner, steamId: isSpecialOldOwner === false ? oldOwnerSteamId : '', sessionId: isSpecialOldOwner === false ? oldOwnerSessionId : '' },
                flag: { id: flagId }
            }
        };
    }
    else if (isMatchMiniGameLockpickLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, success, elapsedTime, failedAttempts, targetName, lockType, ownerUserOriginalText, ownerSessionId, ownerSteamId, ownerScumId, X, Y, Z] = miniGameLockpickLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'lockPick', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: {
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                success: success === 'Yes', elapsedTime, failedAttempts, lockType: lockType.toLowerCase()
            }
        };
    }
    else if (isMatchMiniGameBombDefusalWithoutLockTypeLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, success, elapsedTime, failedAttempts, targetName, ownerUserOriginalText, ownerSessionId, ownerSteamId, ownerScumId, X, Y, Z] = miniGameBombDefusalWithoutLockTypeLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'defusal', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: {
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                success: success === 'Yes', elapsedTime, failedAttempts
            }
        };
    }
    else if (isMatchMiniGameBombDefusalWithLockTypeLog) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, success, elapsedTime, failedAttempts, targetName, lockType, ownerUserOriginalText, ownerSessionId, ownerSteamId, ownerScumId, X, Y, Z] = miniGameBombDefusalWithLockTypeLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let createdLocations = undefined;
        let createdArea = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            createdLocations = `${X},${Y},${Z}`;
            createdArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'defusal', createdLocations, createdArea, createdTimeStamp, targetName,
            otherConfig: {
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                success: success === 'Yes', elapsedTime, failedAttempts, lockType: lockType.toLowerCase()
            }
        };
    }
    else if (isMatchMiniGameBankATMLogRegExp) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, userOriginalText, scumId, sessionId, steamId, success, elapsedTime, failedAttempts] = miniGameBankATMLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'bankAtm', createdLocations: 'none', createdArea: 'none', createdTimeStamp,
            otherConfig: {
                success, elapsedTime, failedAttempts
            }
        };
    }
    else if (isMatchBuryChestLogRegExp) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, chestId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, chestX, chestY, chestZ, userOriginalText, steamId, sessionId, scumId] = buryChestLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let chestLocations = undefined;
        let chestArea = undefined;
        if (chestX !== undefined && chestY !== undefined && chestZ !== undefined) {
            chestLocations = `${chestX},${chestY},${chestZ}`;
            chestArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, chestX, chestY);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'chest', createdLocations: chestLocations, createdArea: chestArea, createdTimeStamp, targetName: 'chest',
            otherConfig: {
                action: 'bury',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                chest: { id: chestId, locations: chestLocations, area: chestArea }
            }
        };
    }
    else if (isMatchUnburyChestLogRegExp) {
        const [originalText, YYYY, MM, DD, HH, mm, ss, chestId, ownerUserOriginalText, ownerSteamId, ownerSessionId, ownerScumId, chestX, chestY, chestZ, userOriginalText, steamId, sessionId, scumId] = unburyChestLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}.${MM}.${DD}-${HH}.${mm}.${ss}`, 'YYYY.MM.DD-HH.mm.ss').valueOf() + 1000 * 60 * 60 * 8) + '';
        let chestLocations = undefined;
        let chestArea = undefined;
        if (chestX !== undefined && chestY !== undefined && chestZ !== undefined) {
            chestLocations = `${chestX},${chestY},${chestZ}`;
            chestArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, chestX, chestY);
        }
        const isSpecialUser = isSpecialUserInfo(userOriginalText);
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            scumId: isSpecialUser === false ? scumId : isSpecialUser, steamId: isSpecialUser === false ? steamId : '', sessionId: isSpecialUser === false ? sessionId : '',
            type: 'chest', createdLocations: chestLocations, createdArea: chestArea, createdTimeStamp, targetName: 'chest',
            otherConfig: {
                action: 'unbury',
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                chest: { id: chestId, locations: chestLocations, area: chestArea }
            }
        };
    }
    else {
        return undefined;
    }
};
exports.tranferActionRecordLog = tranferActionRecordLog;
const autoKickPlayerLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): AConZGameMode::KickPlayer: User id: '(\d{17})', Reason: ([\s|\S]*)/;
const autoBanLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): AConZGameMode::BanPlayerById: User id: '(\d{17})'/;
const requestCharacterActionViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) detected -> User: ([\s|\S]*)\((\d*), (\d{17})\), Desc: ([\s|\S]*)_\d*, Action:[\s|\S]*/;
const ammoCountViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) detected for user -> Weapon: ([\s|\S]*), User: ([\s|\S]*) \((\d*), (\d{17})\), Location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)/;
const outOfInteractionRangeViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) detected -> OutOfInteractionRange[\s|\S]* User: ([\s|\S]*) \((\d*), (\d{17})\)[\s|\S]*Location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*), [\s|\S]*/;
const takeDamageViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) detected -> Attacker: ([\s|\S]*) \((\d*), (\d{17})\), Victim: [\s|\S]*/;
const godModeFillViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[InteractionViolations\]\[APlaceableActorBase\] Violation detected! User ([\s|\S]*) \[(\d{17})\][\s|\S]*/;
const falseTrapTriggerViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[FalseTrapTriggerViolation\] Prisoner ([\s|\S]*):(\d{17})[\s|\S]*/;
const throwItemViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) detected -> [\s|\S]* User: ([\s|\S]*) \((\d*), (\d{17})\)[\s|\S]*/;
const illegalLockpickViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): ([\s|\S]*) \((\d*), (\d{17})\) \(Location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)\) is removing locks illegally\. Location doesn't allow lockpicking\. Target object: ([\s|\S]*)\. Lock type: ([\s|\S]*)\. User owner: ((\d*)\(\[(\d{17})\] ([\s|\S]*)\)|N\/A|-1\(\)|0\(World\))\. Location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*)/;
const totalViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): Total violations detected for user -> User: ([\s|\S]*) \((\d*), (\d{17})\), Type: ([\s|\S]*), Count: (\d*)/;
const otherViolationLogRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): [\s|\S]*/;
const serverLocationRegExp = /[\s|\S]*Server location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*),[\s|\S]*/;
const clientLocationRegExp = /[\s|\S]*Client location: X=([\d|\-|\.]*) Y=([\d|\-|\.]*) Z=([\d|\-|\.]*),[\s|\S]*/;
const tranferViolationsRecordLog = (rawText, GameAreaRanges) => {
    const isMatchAutoKickPlayerLog = autoKickPlayerLogRegExp.test(rawText);
    const isMatchAutoBanLog = autoBanLogRegExp.test(rawText);
    const isMatchRequestCharacterActionViolationLog = requestCharacterActionViolationLogRegExp.test(rawText);
    const isMatchAmmoCountViolationLog = ammoCountViolationLogRegExp.test(rawText);
    const isMatchOutOfInteractionRangeViolationLog = outOfInteractionRangeViolationLogRegExp.test(rawText);
    const isMatchTakeDamageViolationLog = takeDamageViolationLogRegExp.test(rawText);
    const isMatchGodModeFillViolationLog = godModeFillViolationLogRegExp.test(rawText);
    const isMatchFalseTrapTriggerViolationLog = falseTrapTriggerViolationLogRegExp.test(rawText);
    const isMatchThrowItemViolationLog = throwItemViolationLogRegExp.test(rawText);
    const isMatchIllegalLockpickViolationLog = illegalLockpickViolationLogRegExp.test(rawText);
    const isMatchTotalViolationLog = totalViolationLogRegExp.test(rawText);
    const isMatchOtherViolationLog = otherViolationLogRegExp.test(rawText);
    if (isMatchAutoKickPlayerLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, steamId, reason] = autoKickPlayerLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `KickPlayer-${reason.replace(/\./g, '')}`, rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchAutoBanLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, steamId] = autoBanLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `BanPlayer`, rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchRequestCharacterActionViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, mainReason, scumId, sessionId, steamId, reason] = requestCharacterActionViolationLogRegExp.exec(rawText);
        const isMatchServerLocation = serverLocationRegExp.test(rawText);
        const isMatchClientLocation = clientLocationRegExp.test(rawText);
        let serverLocations = undefined;
        let serverArea = undefined;
        let clientLocations = undefined;
        let clientArea = undefined;
        if (isMatchServerLocation && isMatchClientLocation) {
            const [originalServerLocation, sX, sY, sZ] = serverLocationRegExp.exec(rawText);
            const [originalClientLocation, cX, cY, cZ] = clientLocationRegExp.exec(rawText);
            if (sX !== undefined && sY !== undefined && sZ !== undefined) {
                serverLocations = `${sX},${sY},${sZ}`;
                serverArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, sX, sY);
            }
            if (cX !== undefined && cY !== undefined && cZ !== undefined) {
                clientLocations = `${cX},${cY},${cZ}`;
                clientArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, cX, cY);
            }
        }
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `${mainReason.replace(/\./g, '')}-${reason.replace(/\./g, '')}`, rawContent: rawText, createdTimeStamp, steamId, count: 1, otherConfig: { serverLocations, serverArea, clientLocations, clientArea } };
    }
    else if (isMatchAmmoCountViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, mainReason, weapon, scumId, sessionId, steamId, X, Y, Z] = ammoCountViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        let locations = undefined;
        let area = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            locations = `${X},${Y},${Z}`;
            area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return { tag: 'AmmoCountViolation', rawContent: rawText, createdTimeStamp, steamId, count: 1, otherConfig: { locations, area } };
    }
    else if (isMatchOutOfInteractionRangeViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, reason, scumId, sessionId, steamId, X, Y, Z] = outOfInteractionRangeViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        let locations = undefined;
        let area = undefined;
        if (X !== undefined && Y !== undefined && Z !== undefined) {
            locations = `${X},${Y},${Z}`;
            area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
        }
        return { tag: `OutOfInteractionRangeViolation-${reason.replace(/\./g, '')}`, rawContent: rawText, createdTimeStamp, steamId, count: 1, otherConfig: { locations, area } };
    }
    else if (isMatchTakeDamageViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, reason, scumId, sessionId, steamId] = takeDamageViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `TakeDamageViolation-${reason.replace(/\./g, '')}`, rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchGodModeFillViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId] = godModeFillViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `GodModeFillViolation`, rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchFalseTrapTriggerViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId] = falseTrapTriggerViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: `FalseTrapTriggerViolation`, rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchThrowItemViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, reason, scumId, sessionId, steamId] = throwItemViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: reason.replace(/\./g, ''), rawContent: rawText, createdTimeStamp, steamId, count: 1 };
    }
    else if (isMatchIllegalLockpickViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, scumId, sessionId, steamId, clientX, clientY, clientZ, targetName, lockType, ownerUserOriginalText, ownerSessionId, ownerSteamId, ownerScumId, serverX, serverY, serverZ] = illegalLockpickViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        let serverLocations = undefined;
        let serverArea = undefined;
        let clientLocations = undefined;
        let clientArea = undefined;
        if (serverX !== undefined && serverY !== undefined && serverZ !== undefined) {
            serverLocations = `${serverX},${serverY},${serverZ}`;
            serverArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, serverX, serverY);
        }
        if (clientX !== undefined && clientY !== undefined && clientZ !== undefined) {
            clientLocations = `${clientX},${clientY},${clientZ}`;
            clientArea = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, clientX, clientY);
        }
        const isSpecialOwner = isSpecialUserInfo(ownerUserOriginalText);
        return {
            tag: 'illegalLockpick', rawContent: rawText, createdTimeStamp, steamId, count: 1,
            otherConfig: {
                targetName, lockType: lockType.toLowerCase(),
                owner: { scumId: isSpecialOwner === false ? ownerScumId : isSpecialOwner, steamId: isSpecialOwner === false ? ownerSteamId : '', sessionId: isSpecialOwner === false ? ownerSessionId : '' },
                serverLocations, serverArea, clientLocations, clientArea
            }
        };
    }
    else if (isMatchTotalViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss, scumId, sessionId, steamId, reason, count] = totalViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: reason.replace(/\./g, ''), rawContent: rawText, createdTimeStamp, steamId, count };
    }
    else if (isMatchOtherViolationLog) {
        const [original, YYYY, MM, DD, HH, mm, ss] = otherViolationLogRegExp.exec(rawText);
        const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
        return { tag: undefined, rawContent: rawText, createdTimeStamp, steamId: undefined, count: 1 };
    }
    else {
        return { tag: undefined, rawContent: rawText, createdTimeStamp: undefined, steamId: undefined, count: 1 };
    }
};
exports.tranferViolationsRecordLog = tranferViolationsRecordLog;
const changeNameRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): Player (([\s|\S]*) \((\d*), (\d{17})\)|N\/A) changed their name to ([\s|\S]*)\./;
const npcPurchaseDetailRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] Tradeable \(([\s|\S]*) \(x([\d|\-|\.]*)\)\) purchased by ([\s|\S]*)\((\d{17})\) for ([\d|\-|\.]*) money from trader ([\s|\S]*), old amount in store was ([\d|\-|\.]*), new amount is ([\d|\-|\.]*), and effective users online: ([\d|\-|\.]*)/;
const npcBeforePurchaseRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] Before purchasing tradeales from trader ([\s|\S]*), player ([\s|\S]*)\((\d{17})\) had ([\d|\-|\.]*) cash, ([\d|\-|\.]*) account balance and ([\d|\-|\.]*) gold and trader had ([\d|\-|\.]*) funds\./;
const npcAfterPurchaseRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] After tradeable purchase from trader ([\s|\S]*), player ([\s|\S]*)\((\d{17})\) has ([\d|\-|\.]*) cash, ([\d|\-|\.]*) bank account balance and ([\d|\-|\.]*) gold and trader has ([\d|\-|\.]*) funds\./;
const npcSellDetailRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] Tradeable \(([\s|\S]*) \(x([\d|\-|\.]*)\)\) sold by ([\s|\S]*)\((\d{17})\) for ([\d|\-|\.]*) \(([\d|\-|\.]*) \+ ([\d|\-|\.]*) worth of contained items\) to trader ([\s|\S]*), old amount in store is ([\d|\-|\.]*), new amount is ([\d|\-|\.]*), and effective users online: ([\d|\-|\.]*)/;
const npcBeforeSellRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] Before selling tradeables to trader ([\s|\S]*), player ([\s|\S]*)\((\d{17})\) had ([\d|\-|\.]*) cash, ([\d|\-|\.]*) account balance and ([\d|\-|\.]*) gold and trader had ([\d|\-|\.]*) funds\./;
const npcAfterSellRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Trade\] After tradeable sale to trader ([\s|\S]*), player ([\s|\S]*)\((\d{17})\) has ([\d|\-|\.]*) cash, ([\d|\-|\.]*) account balance and ([\d|\-|\.]*) gold and trader has ([\d|\-|\.]*) funds\./;
const bankPurchaseRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) purchased ([\s|\S]*) card \(free renewal: \), new account balance is ([\d|\-|\.]*) credits, at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)\./;
const bankPurchaseRegExp1 = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) purchased ([\s|\S]*) card \(free renewal: ([\s|\S]*)\), new account balance is ([\d|\-|\.]*) credits, at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)\./;
const bankCancelRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) cancelled ([\s|\S]*) card at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)\./;
const bankDepositeRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) deposited ([\d|\-|\.]*)\(([\d|\-|\.]*) was added\) to Account Number: ([\d|\-|\.]*)\(([\s|\S]*)\)\((\d{17})\) at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const bankWithdrawRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) withdrew ([\d|\-|\.]*)\(([\d|\-|\.]*) was removed\) from Account Number: ([\d|\-|\.]*)\(([\s|\S]*)\)\((\d{17})\) at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const bankDestroyRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) manually destroyed ([\s|\S]*) card belonging to Account Number:(\d*), at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)\./;
const bankTransferRegExp = /(\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2}): \[Bank\] ([\s|\S]*)\(ID:(\d{17})\)\(Account Number:(\d*)\) transferred ([\d|\-|\.]*)\(([\d|\-|\.]*) was removed\) from Account Number: (\d*)\(([\s|\S]*)\)\((\d{17})\) to Account Number: (\d*)\(([\s|\S]*)\)\((\d{17})\) at X=([\s|\S]*) Y=([\s|\S]*) Z=([\s|\S]*)/;
const tranferRawEconomyRecordsToBlocks = (rawLog) => {
    const rawLogSplitArray = rawLog
        .split('\n')
        .filter((T, key) => T && T.length && key > 1);
    const blocks = [];
    for (let from = 0, to = 0; to < rawLogSplitArray.length; to++) {
        if (from === to) {
            const isMatchChangeName = changeNameRegExp.test(rawLogSplitArray[to]);
            const isMatchBankPurchase = bankPurchaseRegExp.test(rawLogSplitArray[to]);
            const isMatchBankPurchase1 = bankPurchaseRegExp1.test(rawLogSplitArray[to]);
            const isMatchBankCancel = bankCancelRegExp.test(rawLogSplitArray[to]);
            const isMatchBankDeposite = bankDepositeRegExp.test(rawLogSplitArray[to]);
            const isMatchBankWithdraw = bankWithdrawRegExp.test(rawLogSplitArray[to]);
            const isMatchBankDestroy = bankDestroyRegExp.test(rawLogSplitArray[to]);
            const isMatchBankTransfer = bankTransferRegExp.test(rawLogSplitArray[to]);
            const isMatchNpcBeforePurchase = npcBeforePurchaseRegExp.test(rawLogSplitArray[to]);
            const isMatchNpcAfterPurchase = npcAfterPurchaseRegExp.test(rawLogSplitArray[to]);
            const isMatchNpcBeforeSell = npcBeforeSellRegExp.test(rawLogSplitArray[to]);
            const isMatchNpcAfterSell = npcAfterSellRegExp.test(rawLogSplitArray[to]);
            if ((isMatchChangeName || isMatchBankPurchase || isMatchBankPurchase1 || isMatchBankCancel || isMatchBankDeposite || isMatchBankWithdraw || isMatchBankDestroy || isMatchBankTransfer) &&
                !(isMatchNpcBeforePurchase || isMatchNpcAfterPurchase || isMatchNpcBeforeSell || isMatchNpcAfterSell)) {
                blocks.push([rawLogSplitArray[to]]);
                from++;
                continue;
            }
        }
        const isMatchNpcAfterPurchase = npcAfterPurchaseRegExp.test(rawLogSplitArray[to]);
        const isMatchNpcAfterSell = npcAfterSellRegExp.test(rawLogSplitArray[to]);
        if (isMatchNpcAfterPurchase || isMatchNpcAfterSell) {
            blocks.push(rawLogSplitArray.slice(from, to + 1));
            from = to + 1;
        }
    }
    return blocks;
};
exports.tranferRawEconomyRecordsToBlocks = tranferRawEconomyRecordsToBlocks;
const tranferEconomyRecords = (block, GameAreaRanges) => {
    if (block.length === 1) {
        const isMatchChangeName = changeNameRegExp.test(block[0]);
        const isMatchBankPurchase = bankPurchaseRegExp.test(block[0]);
        const isMatchBankPurchase1 = bankPurchaseRegExp1.test(block[0]);
        const isMatchBankCancel = bankCancelRegExp.test(block[0]);
        const isMatchBankDeposite = bankDepositeRegExp.test(block[0]);
        const isMatchBankWithdraw = bankWithdrawRegExp.test(block[0]);
        const isMatchBankDestroy = bankDestroyRegExp.test(block[0]);
        const isMatchBankTransfer = bankTransferRegExp.test(block[0]);
        if (isMatchChangeName) {
            const [original, YYYY, MM, DD, HH, mm, ss, userOriginalText, oldScumId, sessionId, steamId, newScumId] = changeNameRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            return {
                scumId: oldScumId, sessionId, steamId, type: 'changeName', createdTimeStamp,
                otherConfig: {
                    newScumId,
                }
            };
        }
        else if (isMatchBankPurchase) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, accountId, cardType, newCredit, X, Y, Z] = bankPurchaseRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankPurchase', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    purchaseInfo: {
                        cardType, accountId, newCredit
                    }
                }
            };
        }
        else if (isMatchBankPurchase1) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, accountId, cardType, newCredit, X, Y, Z] = bankPurchaseRegExp1.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankPurchase', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    purchaseInfo: {
                        cardType, accountId, newCredit
                    }
                }
            };
        }
        else if (isMatchBankCancel) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, accountId, cardType, X, Y, Z] = bankCancelRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankCancel', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    purchaseInfo: {
                        cardType, accountId
                    }
                }
            };
        }
        else if (isMatchBankDeposite) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, fromAccountId, dealTotal, dealReality, toAccountId, toScumId, toSteamId, X, Y, Z] = bankDepositeRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankDeposite', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    depositeInfo: {
                        from: { accountId: fromAccountId },
                        to: { accountId: toAccountId, scumId: toScumId, steamId: toSteamId },
                        deal: { total: dealTotal, reality: dealReality },
                    }
                }
            };
        }
        else if (isMatchBankWithdraw) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, toAccountId, dealTotal, dealReality, fromAccountId, fromScumId, fromSteamId, X, Y, Z] = bankWithdrawRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankWithdraw', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    withdrawInfo: {
                        from: { accountId: fromAccountId, scumId: fromScumId, steamId: fromSteamId },
                        to: { accountId: toAccountId },
                        deal: { total: dealTotal, reality: dealReality },
                    }
                }
            };
        }
        else if (isMatchBankDestroy) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, ownerAccountId, cardType, targetAccountId, X, Y, Z] = bankDestroyRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankDestroy', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    destroyInfo: {
                        cardType,
                        owner: { accountId: ownerAccountId },
                        target: { accountId: targetAccountId }
                    }
                }
            };
        }
        else if (isMatchBankTransfer) {
            const [original, YYYY, MM, DD, HH, mm, ss, scumId, steamId, ownerAccountId, transfeReality, transferTotal, fromAccountId, fromScumId, fromSteamId, toAccountId, toScumId, toSteamId, X, Y, Z] = bankTransferRegExp.exec(block[0]);
            const createdTimeStamp = (moment(`${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let locations = undefined;
            let area = undefined;
            if (X !== undefined && Y !== undefined && Z !== undefined) {
                locations = `${X},${Y},${Z}`;
                area = (0, configs_1.getAreaByLocationsArray)(GameAreaRanges, X, Y);
            }
            return {
                scumId: scumId, steamId: steamId, type: 'bankTransfer', createdTimeStamp,
                otherConfig: {
                    locations, area,
                    transferInfo: {
                        owner: { accountId: ownerAccountId },
                        from: { accountId: fromAccountId, scumId: fromScumId, steamId: fromSteamId },
                        to: { accountId: toAccountId, scumId: toScumId, steamId: toSteamId },
                        deal: { total: transferTotal, reality: transfeReality },
                    }
                }
            };
        }
        else {
            console.log("[UNKNOWN] ", block[0]);
            return undefined;
        }
    }
    else {
        const isMatchNpcBeforePurchase = npcBeforePurchaseRegExp.test(block[block.length - 2]);
        const isMatchNpcAfterPurchase = npcAfterPurchaseRegExp.test(block[block.length - 1]);
        const isMatchNpcBeforeSell = npcBeforeSellRegExp.test(block[block.length - 2]);
        const isMatchNpcAfterSell = npcAfterSellRegExp.test(block[block.length - 1]);
        if (isMatchNpcBeforePurchase && isMatchNpcAfterPurchase) {
            const [bOriginal, bYYYY, bMM, bDD, bHH, bMm, bSs, bTrader, bScumId, bSteamId, beforeCash, beforeBankAccountBalance, beforeGold, beforeTraderFunds] = npcBeforePurchaseRegExp.exec(block[block.length - 2]);
            const [aOriginal, aYYYY, aMM, aDD, aHH, aMm, aSs, aTrader, aScumId, aSteamId, afterCash, afterBankAccountBalance, afterGold, afterTraderFunds] = npcAfterPurchaseRegExp.exec(block[block.length - 1]);
            const createdTimeStamp = (moment(`${bYYYY}-${bMM}-${bDD} ${bHH}:${bMm}:${bSs}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let effectiveUsersOnline = '0', details = [];
            let detailsTotal = 0;
            for (let i = 0; i < block.length - 2; i++) {
                const isMatchNpcPurchaseDetail = npcPurchaseDetailRegExp.test(block[i]);
                if (isMatchNpcPurchaseDetail) {
                    const [pOriginal, pYYYY, pMM, pDD, pHH, pMm, pSs, detailsItem, detailsCount, pScumId, pSteamId, detailsPrice, pTrader, detailsOldAmount, detailsNewAmount, pEffectiveUsersOnline] = npcPurchaseDetailRegExp.exec(block[i]);
                    effectiveUsersOnline = pEffectiveUsersOnline;
                    details.push({ item: detailsItem, count: detailsCount, price: detailsPrice, oldAmount: detailsOldAmount, newAmount: detailsNewAmount });
                    detailsTotal += Number(detailsPrice);
                }
            }
            return {
                scumId: bScumId, steamId: bSteamId, type: 'npcPurchase', trader: bTrader, createdTimeStamp,
                otherConfig: {
                    effectiveUsersOnline,
                    before: {
                        cash: beforeCash, bankAccountBalance: beforeBankAccountBalance, gold: beforeGold, traderFunds: beforeTraderFunds
                    },
                    after: {
                        cash: afterCash, bankAccountBalance: afterBankAccountBalance, gold: afterGold, traderFunds: afterTraderFunds
                    },
                    detailsTotal,
                    details
                }
            };
        }
        else if (isMatchNpcBeforeSell && isMatchNpcAfterSell) {
            const [bOriginal, bYYYY, bMM, bDD, bHH, bMm, bSs, bTrader, bScumId, bSteamId, beforeCash, beforeBankAccountBalance, beforeGold, beforeTraderFunds] = npcBeforeSellRegExp.exec(block[block.length - 2]);
            const [aOriginal, aYYYY, aMM, aDD, aHH, aMm, aSs, aTrader, aScumId, aSteamId, afterCash, afterBankAccountBalance, afterGold, afterTraderFunds] = npcAfterSellRegExp.exec(block[block.length - 1]);
            const createdTimeStamp = (moment(`${bYYYY}-${bMM}-${bDD} ${bHH}:${bMm}:${bSs}`).valueOf() + 1000 * 60 * 60 * 8) + '';
            let effectiveUsersOnline = '0', details = [];
            let detailsTotal = 0;
            for (let i = 0; i < block.length - 2; i++) {
                const isMatchNpcSellDetail = npcSellDetailRegExp.test(block[i]);
                if (isMatchNpcSellDetail) {
                    const [sOriginal, sYYYY, sMM, sDD, sHH, sMm, sSs, detailsItem, detailsCount, sScumId, sSteamId, detailsTotalPrice, detailsItemPrice, detailsOriginalPrice, sTrader, detailsOldAmount, detailsNewAmount, sEffectiveUsersOnline] = npcSellDetailRegExp.exec(block[i]);
                    effectiveUsersOnline = sEffectiveUsersOnline;
                    details.push({ item: detailsItem, count: detailsCount, totalPrice: detailsTotalPrice, itemPrice: detailsItemPrice, originalPrice: detailsOriginalPrice, oldAmount: detailsOldAmount, newAmount: detailsNewAmount });
                    detailsTotal += Number(detailsTotalPrice);
                }
            }
            return {
                scumId: bScumId, steamId: bSteamId, type: 'npcSell', trader: bTrader, createdTimeStamp,
                otherConfig: {
                    effectiveUsersOnline,
                    before: {
                        cash: beforeCash, bankAccountBalance: beforeBankAccountBalance, gold: beforeGold, traderFunds: beforeTraderFunds
                    },
                    after: {
                        cash: afterCash, bankAccountBalance: afterBankAccountBalance, gold: afterGold, traderFunds: afterTraderFunds
                    },
                    detailsTotal,
                    details
                }
            };
        }
        else {
            return undefined;
        }
    }
};
exports.tranferEconomyRecords = tranferEconomyRecords;
//# sourceMappingURL=scum-log-utils.js.map