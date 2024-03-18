import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class PermissionsGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
