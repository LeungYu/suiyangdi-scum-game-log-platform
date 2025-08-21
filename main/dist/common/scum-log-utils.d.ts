export declare const isLaterThanLegalDaysAgo: (rawText: any) => boolean;
export declare const tranferKillLog: (rawText: string, GameAreaRanges: any) => {
    logType: string;
    killerSteamId: any;
    killerName: any;
    killerLocations: string;
    killerArea: string;
    victimSteamId: any;
    victimName: any;
    victimLocations: string;
    victimArea: string;
    weapon: any;
    distance: number;
    isEventKill: any;
    occuredTimeStamp: string;
    rawText: string;
    unrecognized?: undefined;
    createdTimeStamp?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    logType?: undefined;
    killerSteamId?: undefined;
    killerName?: undefined;
    killerLocations?: undefined;
    killerArea?: undefined;
    victimSteamId?: undefined;
    victimName?: undefined;
    victimLocations?: undefined;
    victimArea?: undefined;
    weapon?: undefined;
    distance?: undefined;
    isEventKill?: undefined;
    occuredTimeStamp?: undefined;
};
export declare const tranferLoginLog: (rawText: string, GameAreaRanges: any) => {
    logType: string;
    status: string;
    scumId: string;
    steamId: string;
    sessionId: string;
    loginIp: string;
    otherConfig: any;
    createdTimeStamp: string;
    rawText: string;
    unrecognized?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    logType?: undefined;
    status?: undefined;
    scumId?: undefined;
    steamId?: undefined;
    sessionId?: undefined;
    loginIp?: undefined;
    otherConfig?: undefined;
};
export declare const tranferAdminCommandLog: (rawText: string, GameAreaRanges: any) => {
    scumId: string;
    steamId: string;
    sessionId: string;
    content: string;
    sendTimeStamp: string;
    otherConfig?: undefined;
    rawText?: undefined;
    unrecognized?: undefined;
    createdTimeStamp?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    content: string;
    otherConfig: {
        locations: any;
        area: any;
    };
    sendTimeStamp: string;
    rawText: string;
    unrecognized?: undefined;
    createdTimeStamp?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    content: string;
    sendTimeStamp: string;
    rawText: string;
    otherConfig?: undefined;
    unrecognized?: undefined;
    createdTimeStamp?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    scumId?: undefined;
    steamId?: undefined;
    sessionId?: undefined;
    content?: undefined;
    sendTimeStamp?: undefined;
    otherConfig?: undefined;
};
export declare const tranferChatMessageLog: (rawText: string) => {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    content: string;
    sendTimeStamp: string;
    rawText: string;
    unrecognized?: undefined;
    createdTimeStamp?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    scumId?: undefined;
    steamId?: undefined;
    sessionId?: undefined;
    type?: undefined;
    content?: undefined;
    sendTimeStamp?: undefined;
};
export declare const tranferActionRecordLog: (rawText: string, GameAreaRanges: any) => {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    scumId?: undefined;
    steamId?: undefined;
    sessionId?: undefined;
    type?: undefined;
    createdLocations?: undefined;
    createdArea?: undefined;
    targetName?: undefined;
    otherConfig?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        action: string;
        owner?: undefined;
        flag?: undefined;
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        action: string;
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        flag?: undefined;
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        action: string;
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        flag: {
            id: string;
            locations: any;
            area: any;
        };
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        action: string;
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        flag: {
            id: string;
            locations?: undefined;
            area?: undefined;
        };
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        success: boolean;
        elapsedTime: string;
        failedAttempts: string;
        lockType: string;
        action?: undefined;
        flag?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        success: boolean;
        elapsedTime: string;
        failedAttempts: string;
        action?: undefined;
        flag?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: string;
    createdArea: string;
    createdTimeStamp: string;
    rawText: string;
    otherConfig: {
        success: string;
        elapsedTime: string;
        failedAttempts: string;
        action?: undefined;
        owner?: undefined;
        flag?: undefined;
        lockType?: undefined;
        chest?: undefined;
    };
    unrecognized?: undefined;
    targetName?: undefined;
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    rawText: string;
    otherConfig: {
        action: string;
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        chest: {
            id: string;
            locations: any;
            area: any;
        };
        flag?: undefined;
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
    };
    unrecognized?: undefined;
};
export declare const tranferViolationsRecordLog: (rawText: string, GameAreaRanges: any) => {
    tag: string;
    rawContent: string;
    createdTimeStamp: string;
    steamId: string;
    count: number;
    otherConfig?: undefined;
} | {
    tag: string;
    rawContent: string;
    createdTimeStamp: string;
    steamId: string;
    count: number;
    otherConfig: {
        serverLocations: any;
        serverArea: any;
        clientLocations: any;
        clientArea: any;
        locations?: undefined;
        area?: undefined;
        targetName?: undefined;
        lockType?: undefined;
        owner?: undefined;
    };
} | {
    tag: string;
    rawContent: string;
    createdTimeStamp: string;
    steamId: string;
    count: number;
    otherConfig: {
        locations: any;
        area: any;
        serverLocations?: undefined;
        serverArea?: undefined;
        clientLocations?: undefined;
        clientArea?: undefined;
        targetName?: undefined;
        lockType?: undefined;
        owner?: undefined;
    };
} | {
    tag: string;
    rawContent: string;
    createdTimeStamp: string;
    steamId: string;
    count: number;
    otherConfig: {
        targetName: string;
        lockType: string;
        owner: {
            scumId: string;
            steamId: string;
            sessionId: string;
        };
        serverLocations: any;
        serverArea: any;
        clientLocations: any;
        clientArea: any;
        locations?: undefined;
        area?: undefined;
    };
} | {
    tag: string;
    rawContent: string;
    createdTimeStamp: string;
    steamId: string;
    count: string;
    otherConfig?: undefined;
};
export declare const tranferRawEconomyRecordsToBlocks: (rawLog: string) => any[];
export declare const tranferEconomyRecords: (block: string[], GameAreaRanges: any) => {
    scumId: string;
    sessionId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        newScumId: string;
        locations?: undefined;
        area?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        purchaseInfo: {
            cardType: string;
            accountId: string;
            newCredit: string;
        };
        newScumId?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        purchaseInfo: {
            cardType: string;
            accountId: string;
            newCredit?: undefined;
        };
        newScumId?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        depositeInfo: {
            from: {
                accountId: string;
            };
            to: {
                accountId: string;
                scumId: string;
                steamId: string;
            };
            deal: {
                total: string;
                reality: string;
            };
        };
        newScumId?: undefined;
        purchaseInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        withdrawInfo: {
            from: {
                accountId: string;
                scumId: string;
                steamId: string;
            };
            to: {
                accountId: string;
            };
            deal: {
                total: string;
                reality: string;
            };
        };
        newScumId?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        destroyInfo: {
            cardType: string;
            owner: {
                accountId: string;
            };
            target: {
                accountId: string;
            };
        };
        newScumId?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    createdTimeStamp: string;
    otherConfig: {
        locations: any;
        area: any;
        transferInfo: {
            owner: {
                accountId: string;
            };
            from: {
                accountId: string;
                scumId: string;
                steamId: string;
            };
            to: {
                accountId: string;
                scumId: string;
                steamId: string;
            };
            deal: {
                total: string;
                reality: string;
            };
        };
        newScumId?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        detailsTotal?: undefined;
        details?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
    trader?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    scumId?: undefined;
    sessionId?: undefined;
    steamId?: undefined;
    type?: undefined;
    otherConfig?: undefined;
    trader?: undefined;
} | {
    scumId: string;
    steamId: string;
    type: string;
    trader: string;
    createdTimeStamp: string;
    otherConfig: {
        effectiveUsersOnline: string;
        before: {
            cash: string;
            bankAccountBalance: string;
            gold: string;
            traderFunds: string;
        };
        after: {
            cash: string;
            bankAccountBalance: string;
            gold: string;
            traderFunds: string;
        };
        detailsTotal: number;
        details: any[];
        newScumId?: undefined;
        locations?: undefined;
        area?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
    };
    sessionId?: undefined;
    unrecognized?: undefined;
    rawText?: undefined;
};
export declare const tranferChestOwnershipRecordLog: (rawText: string, GameAreaRanges: any) => {
    chestId: string;
    fromSteamId: string;
    fromScumId: string;
    toSteamId: string;
    toScumId: string;
    createdTimeStamp: string;
    rawText: string;
    toSessionId?: undefined;
    locations?: undefined;
    area?: undefined;
    unrecognized?: undefined;
} | {
    chestId: string;
    toSteamId: string;
    toScumId: string;
    createdTimeStamp: string;
    rawText: string;
    fromSteamId?: undefined;
    fromScumId?: undefined;
    toSessionId?: undefined;
    locations?: undefined;
    area?: undefined;
    unrecognized?: undefined;
} | {
    chestId: string;
    toSteamId: string;
    toSessionId: string;
    toScumId: string;
    locations: any;
    area: any;
    createdTimeStamp: string;
    rawText: string;
    fromSteamId?: undefined;
    fromScumId?: undefined;
    unrecognized?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    chestId?: undefined;
    fromSteamId?: undefined;
    fromScumId?: undefined;
    toSteamId?: undefined;
    toScumId?: undefined;
    toSessionId?: undefined;
    locations?: undefined;
    area?: undefined;
};
export declare const tranferVehicleDestructionRecordLog: (rawText: string, GameAreaRanges: any) => {
    actionType: string;
    vehicleType: string;
    vehicleId: string;
    ownerSteamId: string;
    ownerSessionId: string;
    ownerScumId: string;
    locations: any;
    area: any;
    createdTimeStamp: string;
    rawText: string;
    unrecognized?: undefined;
} | {
    unrecognized: boolean;
    rawText: string;
    createdTimeStamp: string;
    actionType?: undefined;
    vehicleType?: undefined;
    vehicleId?: undefined;
    ownerSteamId?: undefined;
    ownerSessionId?: undefined;
    ownerScumId?: undefined;
    locations?: undefined;
    area?: undefined;
};
