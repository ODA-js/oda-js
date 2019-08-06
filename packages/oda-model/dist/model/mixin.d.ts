import { MetaModelType, IMixin, MixinStorage, MixinInput } from './interfaces';
import { EntityBase } from './entitybase';
export declare class Mixin extends EntityBase implements IMixin {
    modelType: MetaModelType;
    protected $obj: MixinStorage;
    constructor(obj: MixinInput);
}
//# sourceMappingURL=mixin.d.ts.map