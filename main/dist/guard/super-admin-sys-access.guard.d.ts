import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SuperAdminSysGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
