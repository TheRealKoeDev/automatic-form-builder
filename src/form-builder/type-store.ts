import { Type } from "@angular/core";
import { Dictionary } from "./types/dictionary";

export class TypeStore {
    private typeMap: Dictionary<Dictionary<Type<unknown>>> = { };

    public registerType(parentClass: Type<unknown>, property: string,  childClass: Type<unknown>){
        const propertyMap = this.typeMap[parentClass.name] || {};
        propertyMap[property] = childClass;

        this.typeMap[parentClass.name] = propertyMap;
    }

    public getType(parentClass: Type<unknown>, property: string){
        return this.typeMap[parentClass.name]?.[property];

    }
}

export const defaultTypeStore = new TypeStore();