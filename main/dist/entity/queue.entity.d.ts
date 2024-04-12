export declare class Queue {
    constructor(commands: string, type: string, status?: string, buyId?: any, buyUserId?: any, isNewSet?: boolean);
    id: number;
    commands: string;
    type: string;
    status: string;
    buyId: string;
    buyUserId: any;
    isNewSet: boolean;
    createdTimeStamp: string;
    updateTimeStamp: string;
}
