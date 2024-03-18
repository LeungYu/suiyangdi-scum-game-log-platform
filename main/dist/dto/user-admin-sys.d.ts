export declare class SearchUserLoginMultiSysDto {
    keywords?: string[];
}
export declare class ListUserLoginSysDto {
    steamId?: string;
    userName?: string;
    scumId?: string;
    timestampStart?: string;
    timestampEnd?: string;
    type?: string;
}
export declare class SearchUserLoginSysDto {
    keyword?: string;
}
export declare class CleanUserLoginSysDto {
    userId: any;
}
export declare class GetSteamInfoSysDto {
    steamId: string;
}
