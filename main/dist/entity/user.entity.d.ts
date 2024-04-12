export declare class User {
    constructor(email: string, phone: string, steamId: string, userName: string, hasBoughtWelcomepack?: boolean, buyWelcomeDidiCarTime?: number, status?: string);
    id: number;
    email: string;
    phone: string;
    steamId: string;
    userName: string;
    status: string;
    hasBoughtWelcomepack: boolean;
    buyWelcomeDidiCarTime: number;
    createdTimeStamp: string;
    lastCheckInTimeStamp: string;
    lastLoginTimeStamp: string;
    lastLogoutTimeStamp: string;
}
