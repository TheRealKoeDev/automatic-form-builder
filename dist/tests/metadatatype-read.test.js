"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const metadata_analyzer_1 = require("../form-builder/metadata-analyzer");
class TestClass {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], TestClass.prototype, "primitiveType", void 0);
__decorate([
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], TestClass.prototype, "arrayType", void 0);
__decorate([
    class_validator_1.IsString({
        each: true
    }),
    __metadata("design:type", Array)
], TestClass.prototype, "stringArrayType", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    __metadata("design:type", Object)
], TestClass.prototype, "objectType", void 0);
__decorate([
    class_validator_1.ValidateNested({
        each: true,
    }),
    __metadata("design:type", Array)
], TestClass.prototype, "objectArrayType", void 0);
describe('Should read the correct MetadataType for each property', () => {
    const metadataStore = class_validator_1.getMetadataStorage();
    const metadata = metadataStore.getTargetValidationMetadatas(TestClass, null, true, false);
    const groupedMetadata = metadataStore.groupByPropertyName(metadata);
    it('Sould identify primitive types', () => {
        const primitiveType = metadata_analyzer_1.getMetadataType(groupedMetadata.primitiveType);
        expect(primitiveType).toBe(metadata_analyzer_1.MetadataType.Primitive);
    });
    it('Sould identify array types', () => {
        const arrayType = metadata_analyzer_1.getMetadataType(groupedMetadata.arrayType);
        expect(arrayType).toBe(metadata_analyzer_1.MetadataType.Array);
        const stringArrayType = metadata_analyzer_1.getMetadataType(groupedMetadata.stringArrayType);
        expect(stringArrayType).toBe(metadata_analyzer_1.MetadataType.Array);
    });
    it('Sould identify object types', () => {
        const objectType = metadata_analyzer_1.getMetadataType(groupedMetadata.objectType);
        expect(objectType).toBe(metadata_analyzer_1.MetadataType.Object);
    });
    it('Sould identify object-array types', () => {
        const objectArrayType = metadata_analyzer_1.getMetadataType(groupedMetadata.objectArrayType);
        expect(objectArrayType).toBe(metadata_analyzer_1.MetadataType.ObjectArray);
    });
});
//# sourceMappingURL=metadatatype-read.test.js.map