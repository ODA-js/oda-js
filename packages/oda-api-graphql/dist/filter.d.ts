export declare function getValue(value: any, idMap: any, id: any): any;
export declare class Filter {
    static types: {};
    static operations: {
        eq(value: any, idMap: any, id: any): {
            $eq: any;
        };
        all(value: any, idMap: any, id: any): {
            $all: any;
        };
        size(value: any, idMap: any, id: any): {
            $size: any;
        };
        gt(value: any, idMap: any, id: any): {
            $gt: any;
        };
        gte(value: any, idMap: any, id: any): {
            $gte: any;
        };
        lt(value: any, idMap: any, id: any): {
            $lt: any;
        };
        lte(value: any, idMap: any, id: any): {
            $lte: any;
        };
        ne(value: any, idMap: any, id: any): {
            $ne: any;
        };
        in(value: any, idMap: any, id: any): {
            $in: any;
        };
        nin(value: any, idMap: any, id: any): {
            $nin: any;
        };
        or(value: any, idMap: any, id: any): {
            $or: any;
        };
        and(value: any, idMap: any, id: any): {
            $and: any;
        };
        nor(value: any, idMap: any, id: any): {
            $nor: any;
        };
        not(value: any, idMap: any, id: any): {
            $not: any;
        };
        exists(value: any, idMap: any, id: any): {
            $exists: boolean;
        };
        match(value: any, idMap: any, id: any): {
            $regex: RegExp;
        };
        imatch(value: any, idMap: any, id: any): {
            $regex: RegExp;
        };
        query(value: any, idMap: any, id: any): any;
        geometry(value: any, idMap: any, id: any): {
            $geometry: any;
        };
        maxDistance(value: any, idMap: any, id: any): {
            $maxDistance: number;
        };
        minDistance(value: any, idMap: any, id: any): {
            $minDistance: number;
        };
        geoIntersects(value: any, idMap: any, id: any): {
            $geoIntersects: any;
        };
        geoWithin(value: any, idMap: any, id: any): {
            $geoWithin: any;
        };
        near(value: any, idMap: any, id: any): {
            $near: any;
        };
        nearSphere(value: any, idMap: any, id: any): {
            $nearSphere: any;
        };
        box(value: any, idMap: any, id: any): {
            $box: any;
        };
        center(value: any, idMap: any, id: any): {
            $center: any;
        };
        centerSphere(value: any, idMap: any, id: any): {
            $centerSphere: any;
        };
        polygon(value: any, idMap: any, id: any): {
            $polygon: any;
        };
    };
    static parse(node: any, idMap?: {
        id: string;
    }, id?: boolean): any;
}
export declare class Process {
    static skip: {
        query: boolean;
        geometry: boolean;
        maxDistance: boolean;
        minDistance: boolean;
        geoIntersects: boolean;
        geoWithin: boolean;
        near: boolean;
        nearSphere: boolean;
        box: boolean;
        center: boolean;
        centerSphere: boolean;
        polygon: boolean;
    };
    static operations: {
        eq(value: any, idMap: any, id: any): string;
        size(value: any, idMap: any, id: any): string;
        gt(value: any, idMap: any, id: any): string;
        gte(value: any, idMap: any, id: any): string;
        lt(value: any, idMap: any, id: any): string;
        lte(value: any, idMap: any, id: any): string;
        ne(value: any, idMap: any, id: any): string;
        in(value: any, idMap: any, id: any): string;
        nin(value: any, idMap: any, id: any): string;
        contains(value: any, idMap: any, id: any): string;
        some(value: any, idMap: any, id: any): string;
        every(value: any, idMap: any, id: any): string;
        except(value: any, idMap: any, id: any): string;
        none(value: any, idMap: any, id: any): string;
        or(value: any, idMap: any, id: any): string;
        and(value: any, idMap: any, id: any): string;
        nor(value: any, idMap: any, id: any): string;
        not(value: any, idMap: any, id: any): string;
        exists(value: any, idMap: any, id: any): string;
        match(value: any, idMap: any, id: any): string;
        imatch(value: any, idMap: any, id: any): string;
    };
    static create(obj: any, idMap?: {
        [key: string]: any;
    }): any;
    static go(node: object[] | object, idMap?: {
        [key: string]: any;
    }, id?: boolean, result?: any): any;
}
export declare function withContext(subscriptionHandler: any, idMap?: {
    [key: string]: any;
}): (root: any, args: any, context: any, info: any) => any;
//# sourceMappingURL=filter.d.ts.map