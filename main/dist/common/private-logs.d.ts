declare class PrivateLogs {
    constructor(baseFolderPath: string, useType?: string);
    baseFolderPath: string;
    generateNormalRequest(method: string, url: string, headers?: any, params?: any, data?: any, logger?: any, otherConfigs?: any, toJson?: boolean): Promise<unknown>;
    getLogsFileNamesJSon(): Promise<unknown>;
    getKillLog(GameAreaRanges: any, fileName: any): Promise<unknown>;
    getLoginLog(GameAreaRanges: any, fileName: any): Promise<unknown>;
    getAdminLog(GameAreaRanges: any, fileName: any): Promise<unknown>;
    getChatLog(fileName: any): Promise<unknown>;
    getActionsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getViolationsLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getEconomyLog(GameAreaRanges: any, fileName: string): Promise<unknown>;
    getServerStatus(battleMetricServerId: any): Promise<unknown>;
}
export default PrivateLogs;
