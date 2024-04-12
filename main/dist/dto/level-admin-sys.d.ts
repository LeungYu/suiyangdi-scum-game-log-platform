export declare class ListLevelSysDto {
    level?: number;
    chargeDollars?: number;
    discount?: number;
    enableGesture?: boolean;
}
export declare class LevelInfoSysDto {
    id: string;
}
export declare class AddLevelSysDto {
    level: number;
    chargeDollars: number;
    discount: number;
    enableGesture: boolean;
    generalGesture?: string;
    checkInPrize?: number;
    onlinePrize?: number;
    minRewardOnlineTime?: number;
    enableLevelAnnounce?: boolean;
}
export declare class UpdateLevelSysDto {
    id: number;
    level: number;
    chargeDollars: number;
    discount: number;
    enableGesture: boolean;
    generalGesture?: string;
    checkInPrize?: number;
    onlinePrize?: number;
    minRewardOnlineTime?: number;
    enableLevelAnnounce?: boolean;
}
export declare class UpdateLevelInfoSysDto {
    id: number;
    chargeDollars: number;
    discount: number;
    enableGesture: boolean;
    generalGesture?: string;
    checkInPrize?: number;
    onlinePrize?: number;
    minRewardOnlineTime?: number;
    enableLevelAnnounce?: boolean;
}
export declare class DeleteLevelSysDto {
    id: string;
}
