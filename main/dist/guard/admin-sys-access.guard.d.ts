import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AdminSysGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
