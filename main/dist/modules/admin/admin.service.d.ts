import { User } from "../../entity/user.entity";
import { Admin } from "../../entity/admin.entity";
import { DeleteResult, Repository } from "typeorm";
import { Page } from "../../dto/page";
export declare class AdminService {
    private readonly userRepository;
    private readonly adminRepository;
    constructor(userRepository: Repository<User>, adminRepository: Repository<Admin>);
    saveAdmin(userId: any, isSysAdmin?: boolean, isReadOnly?: boolean): Promise<Admin>;
    updateAdmin(userId: any, isSysAdmin?: boolean, isReadOnly?: boolean): Promise<any>;
    getAdminList(page: Page, data?: any): Promise<any>;
    getAdmin(data: {
        userId: any;
    }): Promise<any>;
    deleteAdmin(data: {
        [props: string]: any;
    }): Promise<DeleteResult>;
}
