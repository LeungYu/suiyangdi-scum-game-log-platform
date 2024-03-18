"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsGGHostConfigs = void 0;
const class_validator_1 = require("class-validator");
function IsGGHostConfigs(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsGGHostConfigs',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property} is unnullable gghost config` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length !== 1) {
                        return false;
                    }
                    const config = args.object[relatedPropertyName[0]];
                    const GameServerType = args.object.GameServerType;
                    if (GameServerType !== 'GGHost' || config !== undefined) {
                        return true;
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsGGHostConfigs = IsGGHostConfigs;
//# sourceMappingURL=IsGGHostConfigs.js.map