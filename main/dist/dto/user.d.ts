export declare class ListTopNUsersDollarDto {
    top?: number;
}
export declare class ListTopNUsersChargeDollarsDto {
    top?: number;
}
export declare class AddUserDto {
    email: string;
    phone: string;
    steamId: string;
    userName: string;
    password: string;
}
export declare class UpdateUserDto {
    userName: string;
}
export declare class UserDollarTransitionDto {
    toSteamId: string;
    dollar: number;
}
export declare class UpdateUserPasswordDto {
    originPassword: string;
    password: string;
}
export declare class UserCheckInDto {
}
export declare class UpdateUserLoginsDto {
    records: any[];
}
