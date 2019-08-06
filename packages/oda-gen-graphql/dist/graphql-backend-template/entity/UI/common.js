"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const utils_1 = require("../../utils");
const string_humanize_1 = __importDefault(require("string-humanize"));
const inflected_1 = require("inflected");
const queries_1 = require("../../queries");
function visibility(pack, entity, aclAllow, role, aor) {
    const result = {
        listName: guessListLabel(entity.name, aclAllow, role, pack),
        quickSearch: guessQuickSearch(entity, aclAllow, role, pack, aor),
        hidden: [],
        edit: [],
        show: [],
        list: [],
        embedded: [],
    };
    let allFields = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    result.edit.push(...allFields.map(f => f.name));
    result.show.push(...result.edit);
    result.list = [...result.quickSearch];
    const UI = entity.getMetadata('UI');
    if (UI) {
        if (UI.hidden && Array.isArray(UI.hidden)) {
            result.hidden.push(...UI.hidden);
        }
        if (UI.edit && Array.isArray(UI.edit)) {
            result.edit.push(...UI.edit);
        }
        if (UI.show && Array.isArray(UI.show)) {
            result.show.push(...UI.show);
        }
        if (UI.list && Array.isArray(UI.list)) {
            result.list.push(...UI.list);
        }
        if (UI.embedded && Array.isArray(UI.embedded)) {
            result.embedded.push(...UI.embedded);
        }
        if (UI.quickSearch && Array.isArray(UI.quickSearch)) {
            result.quickSearch.push(...UI.quickSearch);
        }
    }
    const res = {
        listName: result.listName,
        quickSearch: result.quickSearch.reduce((r, c) => {
            if (r.indexOf(c) === -1) {
                r.push(c);
            }
            return r;
        }, []),
        hidden: result.hidden.reduce((r, c) => {
            if (r[c] !== false) {
                if (!/\^/.test(c)) {
                    r[c] = true;
                }
                else {
                    r[c.slice(1)] = false;
                }
            }
            return r;
        }, {}),
    };
    res.list = result.list
        .filter(f => !res.hidden[f])
        .reduce((r, c) => {
        if (r[c] !== false) {
            if (!/\^/.test(c)) {
                r[c] = true;
            }
            else {
                r[c.slice(1)] = false;
            }
        }
        return r;
    }, {});
    res.edit = result.edit
        .filter(f => !res.hidden[f] && !res.list[f])
        .reduce((r, c) => {
        if (r[c] !== false) {
            if (!/\^/.test(c)) {
                r[c] = true;
            }
            else {
                r[c.slice(1)] = false;
            }
        }
        return r;
    }, {});
    res.show = result.show
        .filter(f => !res.hidden[f] && !res.edit[f] && !res.list[f])
        .reduce((r, c) => {
        if (r[c] !== false) {
            if (!/\^/.test(c)) {
                r[c] = true;
            }
            else {
                r[c.slice(1)] = false;
            }
        }
        return r;
    }, {});
    const embedItems = allFields
        .filter(f => f.relation &&
        (f.relation.embedded || result.embedded.indexOf(f.name) > -1))
        .map((f) => {
        const lRes = {
            name: f.name,
            entity: f.relation.ref.entity,
        };
        return lRes;
    });
    res.embedded = embedItems.reduce((r, f) => {
        r[f.name] = f.entity;
        return r;
    }, {});
    return res;
}
function guessListLabel(entityName, aclAllow, role, pack) {
    const entity = pack.entities.get(entityName);
    let UI = entity.getMetadata('UI');
    let result;
    if (UI && UI.listName) {
        result = UI.listName;
    }
    else {
        let res = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity)
            .filter(queries_1.identityFields)
            .filter(queries_1.oneUniqueInIndex(entity))[0];
        if (res) {
            result = res.name;
        }
    }
    return result ? (Array.isArray(result) ? result : [result]) : [];
}
function guessQuickSearch(entity, aclAllow, role, pack, aor) {
    let UI = entity.getMetadata('UI');
    let result = [];
    if (UI && UI.listName) {
        const lf = entity.fields.get(UI.listName);
        if (lf && lf.persistent) {
            result.push(UI.listName);
        }
    }
    result.push(...queries_1.getFieldsForAcl(role, pack)(aclAllow, entity)
        .map(i => i.name));
    return result;
}
exports.mapper = queries_1.memoizeEntityMapper('ui/common', _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapAORTypes = typeMapper.aor;
    const mapResourceTypes = typeMapper.resource;
    const mapAORFilterTypes = typeMapper.aorFilter;
    const UI = visibility(pack, entity, aclAllow, role, mapAORTypes);
    const mapFields = f => ({
        order: f.order,
        name: f.name,
        inheritedFrom: f.inheritedFrom,
        source: f.name,
        persistent: f.persistent,
        derived: f.derived,
        cName: utils_1.capitalize(f.name),
        label: string_humanize_1.default(f.title || f.name),
        required: f.required,
        defaultValue: f.defaultValue,
        list: f.list,
        type: mapAORTypes(f.type),
        resourceType: mapResourceTypes(f.type),
        filterType: mapAORFilterTypes(f.type),
    });
    const relations = fieldsAcl
        .filter(queries_1.relationFieldsExistsIn(pack))
        .sort((a, b) => (a.order > b.order ? 1 : -1))
        .map(f => {
        let refe = pack.entities.get(f.relation.ref.entity);
        let verb = f.relation.verb;
        let ref = {
            embedded: f.relation.embedded,
            opposite: f.relation.opposite || f.relation.ref.field,
            usingField: '',
            backField: f.relation.ref.backField,
            entity: f.relation.ref.entity,
            queryName: utils_1.decapitalize(f.relation.ref.entity),
            field: f.relation.ref.field,
            type: refe.fields.has(f.relation.ref.field)
                ? refe.fields.get(f.relation.ref.field).type
                : 'string',
            cField: utils_1.capitalize(f.relation.ref.field),
            label: string_humanize_1.default(refe.fields.has(f.relation.ref.field)
                ? refe.fields.get(f.relation.ref.field).title
                : f.relation.ref.field),
            fields: [],
            listName: '',
        };
        if (verb === 'BelongsToMany' && f.relation.using) {
            ref.using = {
                UI: undefined,
                backField: '',
                entity: '',
                field: '',
            };
            let current = f.relation;
            ref.using.entity = current.using.entity;
            ref.using.field = current.using.field;
            ref.backField = current.using.backField;
            let opposite = queries_1.getRelationNames(refe)
                .filter(r => (current.opposite && current.opposite === r) ||
                (refe.fields.get(r).relation instanceof oda_model_1.BelongsToMany &&
                    refe.fields.get(r).relation.using &&
                    refe.fields.get(r).relation.using.entity ===
                        f.relation.using.entity))
                .map(r => refe.fields.get(r).relation)
                .filter(r => r instanceof oda_model_1.BelongsToMany && current !== r)[0];
            if (opposite) {
                ref.opposite = opposite.field;
                ref.usingField = opposite.using.field;
                ref.backField = opposite.ref.field;
            }
            else {
                ref.usingField = utils_1.decapitalize(ref.entity);
            }
            if (f.relation.fields && f.relation.fields.size > 0) {
                const using = pack.entities.get(ref.using.entity);
                f.relation.fields.forEach(field => {
                    ref.fields.push(mapFields(using.fields.get(field.name)));
                });
            }
        }
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
        return {
            inheritedFrom: f.inheritedFrom,
            order: f.order,
            required: f.required,
            derived: f.derived,
            persistent: f.persistent,
            field: f.name,
            source: f.name,
            name: f.name,
            shortName: f.relation.shortName,
            cField: utils_1.capitalize(f.name),
            label: string_humanize_1.default(f.title || f.name),
            verb,
            embedded: f.relation.embedded,
            single: verb === 'BelongsTo' || verb === 'HasOne',
            ref: Object.assign({}, ref, { fieldName: utils_1.decapitalize(refFieldName), cFieldName: refFieldName }),
        };
    })
        .sort((a, b) => (a.order || -1) - (b.order || -1));
    const fieldsList = [
        ...ids,
        ...fieldsAcl.filter(f => queries_1.fields(f) && !queries_1.idField(f)),
    ]
        .map(mapFields)
        .sort((a, b) => (a.order || -1) - (b.order || -1));
    const props = [...relations, ...fieldsList].sort((a, b) => (a.order || -1) - (b.order || -1));
    const actions = Array.from(entity.operations.values()).map((a) => ({
        name: a.name,
        actionType: a.actionType,
        title: a.title,
        actionName: a.actionType === 'itemAction'
            ? inflected_1.constantify(`${entity.name}_${a.title}`)
            : inflected_1.constantify(`${entity.plural}_${a.title}`),
        actionCreatorName: a.actionType === 'itemAction'
            ? inflected_1.camelize(`${entity.name}_${a.title}`, false)
            : inflected_1.camelize(`${entity.plural}_${a.title}`, false),
        fullName: a.actionType === 'itemAction'
            ? inflected_1.camelize(`${entity.name}_${a.title}`)
            : inflected_1.camelize(`${entity.plural}_${a.title}`),
    }));
    let result = {
        dictionary: entity.getMetadata('dictionary'),
        packageName: utils_1.capitalize(pack.name),
        role: pack.name,
        name: entity.name,
        abstract: entity.abstract,
        embedded: entity.embedded,
        implements: Array.from(entity.implements),
        title: entity.title,
        titlePlural: entity.titlePlural,
        UI,
        plural: entity.plural,
        listLabel: guessListLabel(entity.name, aclAllow, role, pack),
        listName: utils_1.decapitalize(entity.plural),
        ownerFieldName: utils_1.decapitalize(entity.name),
        relations,
        fields: fieldsList,
        props,
        actions,
    };
    if (entity.hasMetadata('enum')) {
        result.enum = entity.getMetadata('enum');
    }
    return result;
}
exports._mapper = _mapper;
//# sourceMappingURL=common.js.map