export declare function uploadFile(url: string, path: any): any;
export declare function getStream(filePath: string, options: any): Promise<any>;
export declare function getMeta(filePath: string, options?: any): Promise<any>;
export declare function getFile(filePath: string, options: any): any;
export declare function deleteFile(url: string): any;
declare const ossClient: {
    uploadFile: typeof uploadFile;
    getStream: typeof getStream;
    getFile: typeof getFile;
    deleteFile: typeof deleteFile;
    getMeta: typeof getMeta;
};
export default ossClient;
