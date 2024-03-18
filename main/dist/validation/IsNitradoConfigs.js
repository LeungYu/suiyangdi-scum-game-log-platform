"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNitradoConfigs = void 0;
const class_validator_1 = require("class-validator");
function IsNitradoConfigs(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsNitradoConfigs',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property[0]} is unnullable nitrado config` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length !== 1) {
                        return false;
                    }
                    const config = args.object[relatedPropertyName[0]];
                    const GameServerType = args.object.GameServerType;
                    if (GameServerType !== 'NITRADO' || config !== undefined) {
                        return true;
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsNitradoConfigs = IsNitradoConfigs;
//# sourceMappingURL=IsNitradoConfigs.js.map