export declare class ListServerConfigSysDto {
    name?: string;
    cnName?: string;
}
export declare class UpdateAllGportalSettingsSysDto {
    GameServerType: string;
    BattleMetricServerId: string;
    ServerId: string;
    GPortalFTPUrl: string;
    GPortalFTPAccount: string;
    GPortalFTPPassword: string;
    EnableGPortalLogsRollback: boolean;
    GPortalLogsRollbackSingleTimeout: number;
    GPortalLogsRollbackInterval: number;
    NitradoAuthorizationToken: string;
    EnableNitradoLogsRollback: boolean;
    NitradoLogsRollbackInterval: number;
    GGHostServerDetail: string;
    GGHostFTPPath: string;
    GGHostFTPType: string;
    GGHostFTPUrl: string;
    GGHostFTPAccount: string;
    GGHostFTPPassword: string;
    EnableGGHostLogsRollback: boolean;
    GGHostLogsRollbackSingleTimeout: number;
    GGHostLogsRollbackInterval: number;
    PrivateBaseFolderPath: string;
    EnablePrivateLogsRollback: boolean;
    PrivateLogsRollbackSingleTimeout: number;
    PrivateLogsRollbackInterval: number;
    GameMapBorderInfo: {
        [props: string]: any;
    };
    GameMapImageUrl: string;
    GameAreaRanges: {
        [props: string]: any;
    };
    SteamAPIToken: {
        [props: string]: any;
    };
}
export declare class UpdateGportalSettingsSysDto {
    EnableGPortalLogsRollback: boolean;
    GPortalLogsRollbackSingleTimeout: number;
    GPortalLogsRollbackInterval: number;
    EnableNitradoLogsRollback: boolean;
    NitradoLogsRollbackInterval: number;
    EnableGGHostLogsRollback: boolean;
    GGHostLogsRollbackSingleTimeout: number;
    GGHostLogsRollbackInterval: number;
    EnablePrivateLogsRollback: boolean;
    PrivateLogsRollbackSingleTimeout: number;
    PrivateLogsRollbackInterval: number;
    GameAreaRanges: {
        [props: string]: any;
    };
    SteamAPIToken: {
        [props: string]: any;
    };
}
export declare class UpdateScumLogSysDto {
    ScumLog: boolean;
}
