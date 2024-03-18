"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsGPortalConfigs = void 0;
const class_validator_1 = require("class-validator");
function IsGPortalConfigs(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsGPortalConfigs',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property} is unnullable gportal config` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length !== 1) {
                        return false;
                    }
                    const config = args.object[relatedPropertyName[0]];
                    const GameServerType = args.object.GameServerType;
                    if (GameServerType !== 'GPORTAL' || config !== undefined) {
                        return true;
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsGPortalConfigs = IsGPortalConfigs;
//# sourceMappingURL=IsGPortalConfigs.js.map