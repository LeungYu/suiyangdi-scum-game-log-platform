export declare class ListBuyByUserDto {
    itemId?: number;
    itemType?: string;
    number?: number;
    status?: string;
    ignoreSpecialRandomPrize?: boolean;
    specialRandomPrizeOnly?: boolean;
}
export declare class AddNormalBuyDto {
    itemId: number;
    number: number;
}
export declare class AddMultiBuyDto {
    items: any[];
}
export declare class AddWelcomePackBuyDto {
    itemId: number;
}
export declare class AddPrePurchaseSetBuyDto {
    itemId: number;
}
export declare class CommitPrePurchaseSetBuyDto {
    id: number;
}
export declare class AddFamesBuyDto {
    itemId: number;
    fame: number;
}
export declare class AddMessagesBuyDto {
    itemId: number;
    messages: string;
}
export declare class AddSafeZoneTeleportBuyDto {
    itemId: number;
    zone: string;
}
export declare class AddHotPointTeleportBuyDto {
    itemId: number;
    name: string;
}
export declare class AddMapTeleportBuyDto {
    itemId: number;
    location: string;
}
export declare class AddUserLocationTeleportBuyDto {
    itemId: number;
    userLocationId: number;
}
export declare class AddSquadMemberTeleportBuyDto {
    itemId: number;
    toUserId: number;
}
export declare class AddRandomPrizeBuyDto {
    itemId: number;
}
export declare class AddDollarAddBuyDto {
    itemId: number;
}
