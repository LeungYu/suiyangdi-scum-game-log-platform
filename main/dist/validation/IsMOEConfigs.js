"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsMOEConfigs = void 0;
const class_validator_1 = require("class-validator");
function IsMOEConfigs(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsMOEConfigs',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property} 是帝国神话属性且不能为空` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length !== 1) {
                        return false;
                    }
                    const config = args.object[relatedPropertyName[0]];
                    const GameType = args.object.GameType;
                    if (GameType !== 'moe' || config !== undefined) {
                        return true;
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsMOEConfigs = IsMOEConfigs;
//# sourceMappingURL=IsMOEConfigs.js.map