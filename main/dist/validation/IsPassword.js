"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = void 0;
const class_validator_1 = require("class-validator");
function IsPassword(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'IsPassword',
            target: object.constructor,
            propertyName,
            constraints: property,
            options: Object.assign({ message: `${property[0]} 只能由大小写字母，数字和标点字符组成，至少包含数字和字母` }, validationOptions),
            validator: {
                validate(value, args) {
                    const relatedPropertyName = args.constraints;
                    if (!Array.isArray(relatedPropertyName) ||
                        relatedPropertyName.length === 0) {
                        return false;
                    }
                    for (const n of relatedPropertyName) {
                        const relatedValue = args.object[n];
                        if (/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/.test(relatedValue)) {
                            return true;
                        }
                    }
                    return false;
                },
            },
        });
    };
}
exports.IsPassword = IsPassword;
//# sourceMappingURL=IsPassword.js.map