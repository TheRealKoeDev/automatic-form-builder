import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
export declare enum MetadataType {
    Array = 0,
    Object = 1,
    ObjectArray = 2,
    Primitive = 3
}
export declare const getMetadataType: (validationMetadata: ValidationMetadata[]) => MetadataType;
//# sourceMappingURL=metadata-analyzer.d.ts.map