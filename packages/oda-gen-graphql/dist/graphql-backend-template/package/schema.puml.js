"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'package/schema.puml.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(pack, typeMapper) {
    const mapToGQLTypes = typeMapper.graphql;
    let relList = new Map(pack.relations.entries());
    relList.forEach((rels, entity) => {
        rels.forEach((rel, fields) => {
            if (rel.relation.opposite) {
                relList.get(rel.relation.ref.entity).delete(rel.relation.opposite);
            }
            else {
                let ent = pack.entities.get(rel.relation.ref.entity);
                let opposites = Array.from(ent.fields.values()).filter((f) => (f.relation &&
                    f.relation.ref.entity === entity &&
                    f.relation.ref.field === rel.name) ||
                    (f.relation &&
                        f.relation.verb === 'BelongsToMany' &&
                        rel.relation.verb === 'BelongsToMany' &&
                        f.relation.using &&
                        f.relation.using.entity ===
                            rel.relation.using.entity));
                if (opposites[0]) {
                    relList.get(rel.relation.ref.entity).delete(opposites[0].name);
                    rel.relation.opposite = opposites[0].name;
                }
            }
        });
    });
    let relations = Array.from(relList).reduce((result, curEntity) => {
        let src = curEntity[0];
        Array.from(curEntity[1].entries()).reduce((res, cur) => {
            res.push({
                src,
                field: cur[0],
                dest: cur[1].relation.ref.entity,
                single: cur[1].relation.single,
                verb: cur[1].relation.verb,
                opposite: cur[1].relation.opposite,
                using: cur[1].relation.verb === 'BelongsToMany'
                    ? cur[1].relation.using.entity
                    : '',
            });
            return res;
        }, result);
        return result;
    }, []);
    return {
        name: pack.name,
        relations,
        entities: queries_1.getRealEntities(pack).map((e) => ({
            name: e.name,
            fields: queries_1.getFields(e)
                .filter(f => queries_1.persistentFields(f) || queries_1.storedRelationsExistingIn(pack)(f))
                .map(f => ({
                name: f.name,
                type: (f.relation && f.relation.ref.toString()) || mapToGQLTypes(f.type),
            })),
            queries: queries_1.getFields(e)
                .filter(queries_1.derivedFieldsAndRelations)
                .map(f => ({
                name: f.name,
                type: (f.relation && f.relation.ref.entity) || mapToGQLTypes(f.type),
                args: ((f.args && f.args.map(a => `${a.name}: ${a.type}`)) ||
                    []).join(','),
                single: (f.relation && f.relation.single) || true,
            })),
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=schema.puml.js.map