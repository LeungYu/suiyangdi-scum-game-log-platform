export declare class Level {
    constructor(level: number, chargeDollars: number, discount: number, enableGesture: boolean, generalGesture?: string, checkInPrize?: number, onlinePrize?: number, minRewardOnlineTime?: number, enableLevelAnnounce?: boolean);
    id: number;
    level: number;
    chargeDollars: number;
    discount: number;
    enableGesture: boolean;
    generalGesture: string;
    checkInPrize: number;
    onlinePrize: number;
    minRewardOnlineTime: number;
    enableLevelAnnounce: boolean;
    createdTimeStamp: string;
}
