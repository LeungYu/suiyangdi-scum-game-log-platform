import { Response } from 'express';
import { AddAdminSysDto, UpdateAdminSysDto, DeleteAdminSysDto } from '../../dto/admin-admin-sys';
import { UserService } from '../user/user.service';
import { AdminService } from "../admin/admin.service";
import { SessionUser } from '../../dto/session-user';
export declare class AdminAdminSysController {
    private readonly adminService;
    private readonly userService;
    constructor(adminService: AdminService, userService: UserService);
    add(userInfo: SessionUser, res: Response, body: AddAdminSysDto): Promise<Response<any, Record<string, any>>>;
    update(userInfo: SessionUser, res: Response, body: UpdateAdminSysDto): Promise<Response<any, Record<string, any>>>;
    delete(userInfo: SessionUser, res: Response, query: DeleteAdminSysDto): Promise<Response<any, Record<string, any>>>;
}
