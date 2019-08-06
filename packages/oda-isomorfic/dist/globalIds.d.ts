export interface ResolvedGlobalId {
    type: string;
    id: string;
}
export declare function fromGlobalId(globalId: string, delimiter?: string): ResolvedGlobalId;
export declare function toGlobalId(type: string, id: string, delimiter?: string): string;
//# sourceMappingURL=globalIds.d.ts.map