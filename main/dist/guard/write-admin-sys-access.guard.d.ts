import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WriteAdminSysGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
