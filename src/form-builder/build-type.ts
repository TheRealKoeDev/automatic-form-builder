import 'reflect-metadata'

import { Type, TypeHelpOptions, TypeOptions } from "class-transformer";
import { Type as TypeConstructor } from '@angular/core';
import { defaultTypeStore } from './type-store';

export function BuildType(typeFunction?: (type?: TypeHelpOptions) => Function, options?: TypeOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol){
        const ParentConstructor = target.constructor as TypeConstructor<unknown>;

        const property = propertyKey?.toString();
        const newObject = new ParentConstructor();
        const typeHelpOptions: TypeHelpOptions = {
            newObject,
            object: target,
            property,
        }

        const ChildType = typeFunction(typeHelpOptions) as TypeConstructor<unknown>;
        defaultTypeStore.registerType(ParentConstructor, property, ChildType);

        Type(() => ChildType, options)(target, property);
    }
}