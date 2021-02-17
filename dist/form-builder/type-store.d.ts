import { Type } from "@angular/core";
export declare class TypeStore {
    private typeMap;
    registerType(parentClass: Type<unknown>, property: string, childClass: Type<unknown>): void;
    getType(parentClass: Type<unknown>, property: string): Type<unknown>;
}
export declare const defaultTypeStore: TypeStore;
//# sourceMappingURL=type-store.d.ts.map