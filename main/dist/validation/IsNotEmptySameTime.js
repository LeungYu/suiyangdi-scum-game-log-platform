"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotEmptySameTime = void 0;
const class_validator_1 = require("class-validator");
function IsNotEmptySameTime(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsNotEmptySameTime',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property.join(', ')} cannot be empty at the same time` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length === 0) {
                        return false;
                    }
                    for (const n of relatedPropertyName) {
                        const relatedValue = args.object[n];
                        if (relatedValue) {
                            return true;
                        }
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsNotEmptySameTime = IsNotEmptySameTime;
//# sourceMappingURL=IsNotEmptySameTime.js.map