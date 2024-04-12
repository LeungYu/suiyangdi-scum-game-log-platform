import { User } from '../../entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Page } from '../../dto/page';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    saveUser(email: string, phone: string, steamId: string, userName: string, hasBoughtWelcomepack?: boolean, buyWelcomeDidiCarTime?: number, status?: string): Promise<User>;
    updateUser(user: User): Promise<UpdateResult> | undefined;
    getUserList(page: Page, data?: any): Promise<any>;
    getDistinctUserList(keyword?: string): Promise<any>;
    getUserListLike(page: Page, data?: any): Promise<any>;
    getUser(data: {
        [props: string]: any;
    }): Promise<User>;
    deleteUser(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    exportUsersList(): Promise<any>;
}
