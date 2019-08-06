"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class ImageSizeType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'ImageSizeType';
        this._resolver = {
            ImageSize: {
                __getValues: () => [
                    {
                        name: 'small',
                        value: 'small',
                        isDeprecated: false,
                    },
                    {
                        name: 'middle',
                        value: 'middle',
                        isDeprecated: false,
                    },
                    {
                        name: 'large',
                        value: 'large',
                        isDeprecated: false,
                    },
                ],
            },
        };
        this._typeDef = {
            entry: [
                `
      enum ImageSize {
        small
        middle
        large
      }
    `,
            ],
        };
    }
}
exports.ImageSizeType = ImageSizeType;
//# sourceMappingURL=imageSize.js.map