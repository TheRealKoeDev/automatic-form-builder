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
exports.AutomaticFormBuilder = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const class_validator_1 = require("class-validator");
const metadata_analyzer_1 = require("./metadata-analyzer");
const type_store_1 = require("./type-store");
const metadata_type_1 = require("./types/metadata-type");
const FORM_BUILDER_TOKEN = new core_1.InjectionToken(null);
let AutomaticFormBuilder = class AutomaticFormBuilder {
    constructor(injector) {
        this.injector = injector;
    }
    build(type, data, options) {
        const formBuilder = this.injector.get(FORM_BUILDER_TOKEN) || this.injector.get(forms_1.FormBuilder);
        const groupedConstraints = this.getContraints(type);
        const form = formBuilder.group({});
        const propertiesToBuild = this.getPropertiesToBuild(groupedConstraints, options === null || options === void 0 ? void 0 : options.formBuildMode, data);
        for (const propertyName of propertiesToBuild) {
            const metadataType = metadata_analyzer_1.getMetadataType(groupedConstraints[propertyName]);
            const control = this.getControl(formBuilder, type, propertyName, metadataType, data, options);
            form.addControl(propertyName, control);
        }
        return form;
    }
    getContraints(type) {
        const metadataStore = class_validator_1.getMetadataStorage();
        const constraints = metadataStore.getTargetValidationMetadatas(type, null, true, false);
        return metadataStore.groupByPropertyName(constraints);
    }
    getControl(formBuilder, type, propertyName, metadataType, data, options) {
        const providedData = data === null || data === void 0 ? void 0 : data[propertyName];
        switch (metadataType) {
            case metadata_type_1.MetadataType.Primitive:
                return formBuilder.control(providedData);
            case metadata_type_1.MetadataType.Array:
                const arrayAsNull = this.shouldWriteNull(providedData, options === null || options === void 0 ? void 0 : options.missingArrayHandling);
                if (arrayAsNull) {
                    return formBuilder.control(null);
                }
                const controls = providedData === null || providedData === void 0 ? void 0 : providedData.map((value) => {
                    return formBuilder.control(value);
                });
                return formBuilder.array(controls || []);
            case metadata_type_1.MetadataType.Object:
                const objectAsNull = this.shouldWriteNull(providedData, options === null || options === void 0 ? void 0 : options.missingObjectHandling);
                if (objectAsNull) {
                    return formBuilder.control(null);
                }
                const childFormType = type_store_1.defaultTypeStore.getType(type, propertyName);
                return this.build(childFormType, providedData, options);
            case metadata_type_1.MetadataType.ObjectArray:
                const arrayObjectAsNull = this.shouldWriteNull(providedData, options === null || options === void 0 ? void 0 : options.missingObjectHandling);
                if (arrayObjectAsNull) {
                    return formBuilder.control(null);
                }
                const childFormArrayType = type_store_1.defaultTypeStore.getType(type, propertyName);
                const childForms = providedData === null || providedData === void 0 ? void 0 : providedData.map((value) => {
                    return this.build(childFormArrayType, value, options);
                });
                return formBuilder.array(childForms || []);
        }
    }
    getPropertiesToBuild(constraints, buildMode, data) {
        const allFields = Object.keys(constraints);
        switch (buildMode) {
            case 1 /* ProvidedDataOnly */:
                return Object.keys(data || {}).filter((field) => allFields.includes(field));
            case 2 /* ProvidedObjectsOnly */:
                return data ? allFields : [];
            default:
                return allFields;
        }
    }
    shouldWriteNull(value, handling) {
        const isWriteNullHandling = handling === 1 /* WriteNull */ || handling === 1 /* WriteNull */;
        return !value && isWriteNullHandling;
    }
};
AutomaticFormBuilder = __decorate([
    core_1.Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [core_1.Injector])
], AutomaticFormBuilder);
exports.AutomaticFormBuilder = AutomaticFormBuilder;
//# sourceMappingURL=automatic-form.builder.js.map