import 'reflect-metadata'

import { Type, TypeHelpOptions, TypeOptions } from "class-transformer";
import { Type as TypeConstructos } from '@angular/core';
import { defaultTypeStore } from './type-store';

export function BuildType(typeFunction?: (type?: TypeHelpOptions) => Function, options?: TypeOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol){
        const ParentConstructor = target.constructor as TypeConstructos<unknown>;

        const newObject = new ParentConstructor();
        const typeHelpOptions: TypeHelpOptions = {
            newObject,
            object: target,
            property: propertyKey?.toString(),
        }

        const ChildType = typeFunction(typeHelpOptions) as TypeConstructos<unknown>;
        defaultTypeStore.registerType(ParentConstructor, propertyKey?.toString(), ChildType);

        Type(() => ChildType, options)(target, propertyKey);
    }
}