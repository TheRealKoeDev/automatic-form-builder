import 'reflect-metadata';
import { getMetadataStorage, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ValidationMetadata } from "class-validator/types/metadata/ValidationMetadata";
import { getMetadataType } from "../form-builder/metadata-analyzer";
import { MetadataType } from "../form-builder/types/metadata-type";

class TestClass {
    @IsString()
    @IsNotEmpty()
    public primitiveType: string;

    @IsArray()
    public arrayType: unknown[];

    @IsString({
        each: true
    })
    public stringArrayType: string[];

    @ValidateNested()
    public objectType: Object;

    @ValidateNested({
        each: true,
    })
    public objectArrayType: Object[];
}

type TestMetadata = {
    [P in keyof TestClass]: ValidationMetadata[];
}

describe('Should read the correct MetadataType for each property', () => {
    const metadataStore = getMetadataStorage();
    const metadata =  metadataStore.getTargetValidationMetadatas(TestClass, null, true, false);
    const groupedMetadata = metadataStore.groupByPropertyName(metadata) as TestMetadata;

    it('Sould identify primitive types', () => {       
        const primitiveType = getMetadataType(groupedMetadata.primitiveType);        
        expect(primitiveType).toBe(MetadataType.Primitive);
    });

    it('Sould identify array types', () => {        
        const arrayType = getMetadataType(groupedMetadata.arrayType);        
        expect(arrayType).toBe(MetadataType.Array);

        const stringArrayType = getMetadataType(groupedMetadata.stringArrayType);        
        expect(stringArrayType).toBe(MetadataType.Array);
    });

    it('Sould identify object types', () => {
        const objectType = getMetadataType(groupedMetadata.objectType);        
        expect(objectType).toBe(MetadataType.Object);
    });

    it('Sould identify object-array types', () => {
        const objectArrayType = getMetadataType(groupedMetadata.objectArrayType);        
        expect(objectArrayType).toBe(MetadataType.ObjectArray);
    });
})