import { ResolvedGlobalId } from './globalIds';
export declare class IdGenerator {
    private static browser;
    private static counter;
    static generateMongoId(): string;
    static generateIdFor(typeName: any): string;
    static getIdForFromKey(typeName: any, key: any): string;
    static generateIdForWithId(typeName: any, id: any): string;
    static reverse(id: any): ResolvedGlobalId;
}
//# sourceMappingURL=idGenerator.d.ts.map