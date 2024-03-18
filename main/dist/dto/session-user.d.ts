export declare class SessionUser {
    userId: number;
    role: 'sysAdmin' | 'admin' | 'adminReadOnly';
    permissions: string[];
}
