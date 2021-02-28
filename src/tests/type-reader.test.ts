import 'reflect-metadata';

import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { defaultMetadataStorage } from 'class-transformer/storage';

class ChildClass {
    @IsString()
    public testPropety: string;
}

class ParentClass {
    // Does not build this property, because it has no Decorator from class-validator 
    public unbuildProperty: unknown = "TEST";
    
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
        const childType = defaultMetadataStorage.findTypeMetadata(ParentClass, 'objectProperty');
        expect(childType.reflectedType).toBe(ChildClass);
    });
    it('Get the child type from object-array property', () => {
        const childType = defaultMetadataStorage.findTypeMetadata(ParentClass, 'objectProperty');
        expect(childType.reflectedType).toBe(ChildClass);
    });
})