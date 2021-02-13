import 'reflect-metadata';
import { Type } from '@angular/core';
import { plainToClass } from 'class-transformer';

import { MetadataType } from './metadata-analyzer';

export const getTypeFromMetadataType = <T extends Object>(
    parentType: Type<T>,
    property: keyof T,
    metaDataType: MetadataType.Object | MetadataType.ObjectArray,
): Type<unknown> => {
    if (metaDataType === MetadataType.ObjectArray) {
        const plainObject = {
            [property]: [{}],
        };

        const typedObject = plainToClass(parentType, plainObject);
        return typedObject[property][0].constructor;
    } else {
        const plainObject = {
            [property]: {},
        };

        const typedObject = plainToClass(parentType, plainObject);
        return typedObject[property].constructor as Type<unknown>;
    }
};
