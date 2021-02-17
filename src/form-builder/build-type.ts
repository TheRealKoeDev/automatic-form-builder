import 'reflect-metadata'

import { Type, TypeHelpOptions, TypeOptions } from "class-transformer";
import { Type as TypeConstructor } from '@angular/core';
import { defaultTypeStore } from './type-store';

export function BuildType(typeFunction?: (type?: TypeHelpOptions) => Function, options?: TypeOptions): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol){
        const ParentConstructor = target.constructor as TypeConstructor<unknown>;

        const newObject = new ParentConstructor();
        const typeHelpOptions: TypeHelpOptions = {
            newObject,
            object: target,
            property: propertyKey?.toString(),
        }

        const ChildType = typeFunction(typeHelpOptions) as TypeConstructor<unknown>;
        defaultTypeStore.registerType(ParentConstructor, propertyKey?.toString(), ChildType);

        Type(() => ChildType, options)(target, propertyKey);
    }
}