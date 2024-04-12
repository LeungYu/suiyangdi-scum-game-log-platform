import { UserPassword } from '../../entity/user-password.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
export declare class UserPasswordService {
    private readonly userPasswordRepository;
    constructor(userPasswordRepository: Repository<UserPassword>);
    getUserPassword(userId: any): Promise<UserPassword>;
    saveUserPassword(userId: any, password: string): Promise<UserPassword>;
    updateUserPassword(userPassword: UserPassword): Promise<UpdateResult> | undefined;
    deleteUserPassword(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
    exportUserPasswordList(): Promise<any>;
}
