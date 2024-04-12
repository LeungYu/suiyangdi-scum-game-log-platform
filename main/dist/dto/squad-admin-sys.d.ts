export declare class ListSquadSysDto {
    name?: string;
    createdByUserName?: string;
    status?: number;
    timestampStart?: string;
    timestampEnd?: string;
}
export declare class SearchSquadsSysDto {
    keyword?: string;
}
export declare class UpdateSquadSysDto {
    id: number;
    name?: string;
}
export declare class SquadInfoSysDto {
    id: string;
}
export declare class DeleteSquadSysDto {
    id: string;
}
export declare class DisbandSquadSysDto {
    id: string;
}
export declare class ListSquadUserSysDto {
    squadId: number;
}
export declare class ListSquadHistorySysDto {
    squadId: number;
}
export declare class ListSquadJoinRequestSysDto {
    squadId: string;
}
