import { ARRAY_CONTAINS, ARRAY_MAX_SIZE, ARRAY_MIN_SIZE, ARRAY_NOT_CONTAINS, ARRAY_NOT_EMPTY, ARRAY_UNIQUE, getMetadataStorage, IS_ARRAY, IS_INSTANCE, MetadataStorage, ValidationTypes } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { MetadataType } from './types/metadata-type';

const arrayValidtionTypes = new Set<string>([
    IS_ARRAY,
    ARRAY_CONTAINS,
    ARRAY_MAX_SIZE,
    ARRAY_MIN_SIZE,
    ARRAY_NOT_CONTAINS,
    ARRAY_NOT_EMPTY,
    ARRAY_UNIQUE,
]);

const objectValidationTypes = new Set<string>([
    IS_INSTANCE,
    ValidationTypes.NESTED_VALIDATION,
]);

export const getMetadataType = (validationMetadata: ValidationMetadata[]) => {
    let isArrayMetadata = false;
    let isObjectMetadata = false;

    const metadataStore = getMetadataStorage();

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
    } else if (isObjectMetadata) {
        return MetadataType.Object;
    } else if (isArrayMetadata) {
        return MetadataType.Array;
    }

    return MetadataType.Primitive;
};

function getValidationTypeName(metadata: ValidationMetadata, store: MetadataStorage){
    if(metadata.type === ValidationTypes.NESTED_VALIDATION){
        return ValidationTypes.NESTED_VALIDATION;
    }

    const [constraint] = metadata.constraintCls && store.getTargetValidatorConstraints(metadata.constraintCls);
    return constraint?.name;

}
