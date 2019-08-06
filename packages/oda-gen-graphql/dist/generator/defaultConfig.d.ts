declare const _default: {
    graphql: boolean;
    ts: boolean;
    schema: boolean;
    ui: boolean;
    package: {
        mutation: {
            entry: boolean;
            types: boolean;
            resolver: boolean;
            index: boolean;
        };
        entity: {
            index: boolean;
            type: {
                entry: boolean;
                enums: boolean;
                resolver: boolean;
            };
            query: {
                entry: boolean;
                resolver: boolean;
            };
            viewer: {
                entry: boolean;
                resolver: boolean;
            };
            dataPump: {
                queries: boolean;
                config: boolean;
            };
            UI: {
                queries: boolean;
                forms: boolean;
                index: boolean;
            };
            mutations: {
                entry: boolean;
                types: boolean;
                resolver: boolean;
            };
            subscriptions: {
                entry: boolean;
                types: boolean;
                resolver: boolean;
            };
            data: {
                adapter: {
                    connector: boolean;
                    schema: boolean;
                };
                types: {
                    model: boolean;
                };
            };
            connections: {
                mutations: {
                    entry: boolean;
                    types: boolean;
                    resolver: boolean;
                };
                types: boolean;
            };
        };
        enums: {
            UI: boolean;
        };
        packages: {
            typeIndex: boolean;
            mutationIndex: boolean;
        };
    };
};
export default _default;
//# sourceMappingURL=defaultConfig.d.ts.map