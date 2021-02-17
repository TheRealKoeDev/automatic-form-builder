import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BuildType } from '../form-builder/build-type';
import { defaultTypeStore } from '../form-builder/type-store';

class ChildClass {
    @IsString()
    public testPropety: string;
}


class ParentClass {
    // Does not build this property, because it has no Decorator from @ng-stack/forms 
    public unbuildProperty: unknown = "TEST";
    
    @IsString()
    public primitiveProperty: string;
    
    @IsArray()
    @IsString({ each: true })
    public primitiveArrayProperty: string[];
    
    @IsNotEmpty()
    @ValidateNested()
    @BuildType(() => ChildClass)
    
    public objectProperty: ChildClass;    
   
    @ValidateNested({ each: true })
    @IsArray()
    @BuildType(() => ChildClass)
    public objectArrayProperty: ChildClass[];

}

describe('Should read the correct type for child elements', () => {
    it('Get the child type from object property', () => {
        const childType = defaultTypeStore.getType(ParentClass, 'objectProperty');
        expect(childType).toBe(ChildClass);
    });
    it('Get the child type from object-array property', () => {
        const childType = defaultTypeStore.getType(ParentClass, 'objectProperty');
        expect(childType).toBe(ChildClass);
    });
})