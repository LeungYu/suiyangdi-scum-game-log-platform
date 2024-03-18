declare class NitradoLogs {
    constructor(serverId: string, nitradoAuthorizationToken: string, useType?: string);
    serverId: string;
    nitradoAuthorizationToken: string;
    generateNormalRequest(method: string, url: string, headers?: any, params?: any, data?: any, logger?: any): Promise<unknown>;
    generateDownloadRequest(method: string, url: string, headers?: any, params?: any, body?: any, logger?: any): Promise<unknown>;
    generateHeaders(): {
        connection: string;
        accept: string;
        'accept-encoding': string;
        authorization: string;
    };
    getLogsFileNamesJSon(): Promise<unknown>;
    getKillLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getLoginLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getAdminLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getChatLog(fileName: string): Promise<unknown>;
    getActionsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getViolationsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getEconomyLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getServerStatus(): Promise<unknown>;
}
export default NitradoLogs;
