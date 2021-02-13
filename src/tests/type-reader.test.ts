import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { MetadataType } from "../form-builder/metadata-analyzer";
import { getTypeFromMetadataType } from "../form-builder/type-reader";

class ChildClass {
    @IsString()
    public testPropety: string;
}

class ParentClass {
    // Does not build this property, because it has no Decorator from @ng-stack/forms 
    public unbuildProperty: unknown;
    
    @IsString()
    public primitiveProperty: string;
    
    @IsArray()
    @IsString({ each: true })
    public primitiveArrayProperty: string[];
    
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ChildClass)
    public objectProperty: ChildClass;    
   
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ChildClass)
    public objectArrayProperty: ChildClass[];
}

describe('Should read the correct type for child elements', () => {
    it('Get the child type from object property', () => {
        const childType = getTypeFromMetadataType(ParentClass, 'objectProperty', MetadataType.Object);
        expect(childType).toBe(ChildClass);
    });
    it('Get the child type from object-array property', () => {
        const childType = getTypeFromMetadataType(ParentClass, 'objectArrayProperty', MetadataType.ObjectArray);
        expect(childType).toBe(ChildClass);
    });
})