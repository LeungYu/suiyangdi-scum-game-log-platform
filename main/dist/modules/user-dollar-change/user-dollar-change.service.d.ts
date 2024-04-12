import { User } from "../../entity/user.entity";
import { UserDollarChange } from "../../entity/user-dollar-change.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Page } from "../../dto/page";
export declare class UserDollarChangeService {
    private readonly userRepository;
    private readonly userDollarChangeRepository;
    constructor(userRepository: Repository<User>, userDollarChangeRepository: Repository<UserDollarChange>);
    saveUserDollarChanges(userDollarChanges: any[]): Promise<UserDollarChange[]>;
    saveUserDollarChange(userId: any, balance: number, reason?: string): Promise<UserDollarChange>;
    getUserDollarChangeList(page: Page, data?: any): Promise<any>;
    updateUserDollarChange(userDollarChange: UserDollarChange): Promise<UpdateResult> | undefined;
    deleteUserDollarChange(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    cleanUserDollarChange(userId: any): Promise<DeleteResult>;
    cleanAllDollarChange(): Promise<any>;
}
