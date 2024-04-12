export declare class ListBuySysDto {
    id?: string;
    userName?: string;
    userSteamId?: string;
    itemName?: string;
    itemType?: string;
    isPrePurchase?: boolean;
    status?: string;
    ignoreSpecialRandomPrize?: boolean;
    specialRandomPrizeOnly?: boolean;
    timestampStart?: string;
    timestampEnd?: string;
}
export declare class InfoBuySysDto {
    id: string;
}
export declare class updateStatusSysDto {
    id: number;
    status: string;
}
export declare class ResendBuySysDto {
    id: number;
}
export declare class RefundBuySysDto {
    id: number;
}
export declare class DeleteBuySysDto {
    id: string;
}
export declare class CleanVehiclesSysDto {
    vehicleIds: number[];
}
