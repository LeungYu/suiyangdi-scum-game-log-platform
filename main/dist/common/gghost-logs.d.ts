declare class GGHostLogs {
    constructor(serverHost: string, serverPort: string, ftpPath: string, ftpType: string, ftpHost: string, ftpPort: string, ftpAccount: string, ftpPassword: string, useType?: string);
    serverHost: string;
    serverPort: string;
    ftpPath: string;
    ftpType: string;
    ftpHost: string;
    ftpPort: string;
    ftpAccount: string;
    ftpPassword: string;
    generateNormalRequest(method: string, url: string, headers?: any, params?: any, data?: any, logger?: any, otherConfigs?: any, toJson?: boolean): Promise<unknown>;
    generateFormDataRequest(url: string, form: any, headers?: any, logger?: any, otherConfigs?: any): Promise<unknown>;
    getLogsFileNamesJSon(): Promise<unknown>;
    getKillLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getLoginLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getAdminLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getChatLog(fileName: string): Promise<unknown>;
    getActionsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getViolationsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getEconomyLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
}
export default GGHostLogs;
