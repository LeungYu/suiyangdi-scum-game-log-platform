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
};
export declare const tranferAdminCommandLog: (rawText: string, GameAreaRanges: any) => {
    scumId: string;
    steamId: string;
    sessionId: string;
    content: string;
    sendTimeStamp: string;
    otherConfig?: undefined;
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
};
export declare const tranferChatMessageLog: (rawText: string) => {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    content: string;
    sendTimeStamp: string;
};
export declare const tranferActionRecordLog: (rawText: string, GameAreaRanges: any) => {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
    otherConfig: {
        action: string;
        owner?: undefined;
        flag?: undefined;
        success?: undefined;
        elapsedTime?: undefined;
        failedAttempts?: undefined;
        lockType?: undefined;
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
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
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
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
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
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
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
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
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: any;
    createdArea: any;
    createdTimeStamp: string;
    targetName: string;
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
    };
} | {
    scumId: string;
    steamId: string;
    sessionId: string;
    type: string;
    createdLocations: string;
    createdArea: string;
    createdTimeStamp: string;
    otherConfig: {
        success: string;
        elapsedTime: string;
        failedAttempts: string;
        action?: undefined;
        owner?: undefined;
        flag?: undefined;
        lockType?: undefined;
    };
    targetName?: undefined;
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
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        purchaseInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        transferInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        effectiveUsersOnline?: undefined;
        before?: undefined;
        after?: undefined;
        details?: undefined;
    };
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
        details: any[];
        locations?: undefined;
        area?: undefined;
        purchaseInfo?: undefined;
        depositeInfo?: undefined;
        withdrawInfo?: undefined;
        destroyInfo?: undefined;
        transferInfo?: undefined;
    };
};
