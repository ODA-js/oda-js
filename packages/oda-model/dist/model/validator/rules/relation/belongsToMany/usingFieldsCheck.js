"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-using-fields-check';
        this.description = 'relation using fields check failed';
    }
    validate(context) {
        const result = [];
        if (context.relation.using) {
            const entity = context.package.entities.get(context.relation.using.entity);
            if (entity) {
                if (context.relation.fields) {
                    context.relation.fields.forEach(field => {
                        const found = entity.fields.get(field.name);
                        if (found) {
                            if (found.type !== field.type) {
                                const update = found.toJSON();
                                update.type = field.type;
                                update.entity = context.entity.name;
                                found.updateWith(update);
                                result.push({
                                    message: `type of relation field '${field.name}' and in using entity differs`,
                                    result: 'fixable',
                                });
                            }
                        }
                        else {
                            const update = entity.toJSON();
                            update.fields.push(Object.assign({}, field.toJSON(), { entity: context.entity.name }));
                            entity.updateWith(update);
                            result.push({
                                message: `${field.name} is not met in using entity`,
                                result: 'fixable',
                            });
                        }
                    });
                }
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=usingFieldsCheck.js.map