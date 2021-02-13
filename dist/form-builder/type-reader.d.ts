import 'reflect-metadata';
import { Type } from '@angular/core';
import { MetadataType } from './metadata-analyzer';
export declare const getTypeFromMetadataType: <T extends Object>(parentType: Type<T>, property: keyof T, metaDataType: MetadataType.Object | MetadataType.ObjectArray) => Type<unknown>;
//# sourceMappingURL=type-reader.d.ts.map