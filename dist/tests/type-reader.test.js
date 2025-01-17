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
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const storage_1 = require("class-transformer/cjs/storage");
class ChildClass {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ChildClass.prototype, "testPropety", void 0);
class ParentClass {
    constructor() {
        // Does not build this property, because it has no Decorator from class-validator 
        this.unbuildProperty = "TEST";
    }
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ParentClass.prototype, "primitiveProperty", void 0);
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], ParentClass.prototype, "primitiveArrayProperty", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(() => ChildClass),
    __metadata("design:type", ChildClass)
], ParentClass.prototype, "objectProperty", void 0);
__decorate([
    class_validator_1.ValidateNested({ each: true }),
    class_validator_1.IsArray(),
    class_transformer_1.Type(() => ChildClass),
    __metadata("design:type", Array)
], ParentClass.prototype, "objectArrayProperty", void 0);
describe('Should read the correct type for child elements', () => {
    it('Get the child type from object property', () => {
        const childType = storage_1.defaultMetadataStorage.findTypeMetadata(ParentClass, 'objectProperty');
        expect(childType.reflectedType).toBe(ChildClass);
    });
    it('Get the child type from object-array property', () => {
        const childType = storage_1.defaultMetadataStorage.findTypeMetadata(ParentClass, 'objectProperty');
        expect(childType.reflectedType).toBe(ChildClass);
    });
});
//# sourceMappingURL=type-reader.test.js.map