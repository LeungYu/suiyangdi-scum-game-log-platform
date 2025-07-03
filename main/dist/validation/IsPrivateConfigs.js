"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPrivateConfigs = void 0;
const class_validator_1 = require("class-validator");
function IsPrivateConfigs(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsPrivateConfigs',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property} is unnullable private config` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length !== 1) {
                        return false;
                    }
                    const config = args.object[relatedPropertyName[0]];
                    const GameServerType = args.object.GameServerType;
                    if (GameServerType !== 'Private' || config !== undefined) {
                        return true;
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsPrivateConfigs = IsPrivateConfigs;
//# sourceMappingURL=IsPrivateConfigs.js.map