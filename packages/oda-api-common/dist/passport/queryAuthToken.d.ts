export declare class Strategy {
    name: string;
    private _verify;
    constructor(verify: any);
    success(user: any, info?: any): void;
    fail(): void;
    error(user: any, info?: any): void;
    pass(): void;
    authenticate(req: any, res: any): void;
}
//# sourceMappingURL=queryAuthToken.d.ts.map