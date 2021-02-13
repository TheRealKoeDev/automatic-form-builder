"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataType = exports.MetadataType = void 0;
const class_validator_1 = require("class-validator");
const arrayValidtionTypes = new Set([
    class_validator_1.IS_ARRAY,
    class_validator_1.ARRAY_CONTAINS,
    class_validator_1.ARRAY_MAX_SIZE,
    class_validator_1.ARRAY_MIN_SIZE,
    class_validator_1.ARRAY_NOT_CONTAINS,
    class_validator_1.ARRAY_NOT_EMPTY,
    class_validator_1.ARRAY_UNIQUE,
]);
const objectValidationTypes = new Set([
    class_validator_1.IS_INSTANCE,
    class_validator_1.ValidationTypes.NESTED_VALIDATION,
]);
var MetadataType;
(function (MetadataType) {
    MetadataType[MetadataType["Array"] = 0] = "Array";
    MetadataType[MetadataType["Object"] = 1] = "Object";
    MetadataType[MetadataType["ObjectArray"] = 2] = "ObjectArray";
    MetadataType[MetadataType["Primitive"] = 3] = "Primitive";
})(MetadataType = exports.MetadataType || (exports.MetadataType = {}));
const getMetadataType = (validationMetadata) => {
    let isArrayMetadata = false;
    let isObjectMetadata = false;
    const metadataStore = class_validator_1.getMetadataStorage();
    for (const metadata of validationMetadata) {
        const validationName = getValidationTypeName(metadata, metadataStore);
        isArrayMetadata =
            isArrayMetadata ||
                metadata.each ||
                arrayValidtionTypes.has(validationName);
        isObjectMetadata =
            isObjectMetadata || objectValidationTypes.has(validationName);
        if (isArrayMetadata && isObjectMetadata) {
            break;
        }
    }
    if (isArrayMetadata && isObjectMetadata) {
        return MetadataType.ObjectArray;
    }
    else if (isObjectMetadata) {
        return MetadataType.Object;
    }
    else if (isArrayMetadata) {
        return MetadataType.Array;
    }
    return MetadataType.Primitive;
};
exports.getMetadataType = getMetadataType;
function getValidationTypeName(metadata, store) {
    if (metadata.type === class_validator_1.ValidationTypes.NESTED_VALIDATION) {
        return class_validator_1.ValidationTypes.NESTED_VALIDATION;
    }
    const [constraint] = metadata.constraintCls && store.getTargetValidatorConstraints(metadata.constraintCls);
    return constraint === null || constraint === void 0 ? void 0 : constraint.name;
}
//# sourceMappingURL=metadata-analyzer.js.map