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
const forms_1 = require("@ng-stack/forms");
const class_validator_1 = require("class-validator");
const form_validators_1 = require("./form-validators");
const metadata_analyzer_1 = require("./metadata-analyzer");
const type_reader_1 = require("./type-reader");
let AutomaticFormBuilder = class AutomaticFormBuilder {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
    }
    build(type, data, options) {
        const form = this.buildForm(type, data || {}, options);
        switch (options === null || options === void 0 ? void 0 : options.validation) {
            case 2 /* None */:
                break;
            case 1 /* ValidateExistingProperties */:
                const existingPropertyValidator = form_validators_1.validateExistingProperties(type);
                form.setValidators(existingPropertyValidator);
                existingPropertyValidator(form);
                break;
            default:
                const completeValidator = form_validators_1.validateCompleteForm(type);
                form.setValidators(completeValidator);
                completeValidator(form);
        }
        return form;
    }
    buildForm(type, data, options) {
        const groupedConstraints = this.getContraints(type);
        const form = this.formBuilder.group({});
        const propertiesToBuild = this.getPropertiesToBuild(groupedConstraints, options === null || options === void 0 ? void 0 : options.formBuildMode, data);
        for (const propertyName of propertiesToBuild) {
            const metadataType = metadata_analyzer_1.getMetadataType(groupedConstraints[propertyName]);
            const control = this.getControl(type, propertyName, metadataType, data, options);
            form.addControl(propertyName, control);
        }
        return form;
    }
    getContraints(type) {
        const metadataStore = class_validator_1.getMetadataStorage();
        const constraints = metadataStore.getTargetValidationMetadatas(type, null, true, false);
        return metadataStore.groupByPropertyName(constraints);
    }
    getControl(type, propertyName, metadataType, data, options) {
        const providedData = data === null || data === void 0 ? void 0 : data[propertyName];
        switch (metadataType) {
            case metadata_analyzer_1.MetadataType.Primitive:
                return this.formBuilder.control(providedData);
            case metadata_analyzer_1.MetadataType.Array:
                if ((options === null || options === void 0 ? void 0 : options.missingArrayHandling) ===
                    1 /* WriteNull */ &&
                    !providedData) {
                    return this.formBuilder.control(null);
                }
                const controls = providedData === null || providedData === void 0 ? void 0 : providedData.map((value) => {
                    return this.formBuilder.control(value);
                });
                return this.formBuilder.array(controls || []);
            case metadata_analyzer_1.MetadataType.Object:
                if ((options === null || options === void 0 ? void 0 : options.missingObjectHandling) ===
                    1 /* WriteNull */ &&
                    !providedData) {
                    return this.formBuilder.control(null);
                }
                const childFormType = type_reader_1.getTypeFromMetadataType(type, propertyName, metadataType);
                return this.buildForm(childFormType, providedData, options);
            case metadata_analyzer_1.MetadataType.ObjectArray:
                if ((options === null || options === void 0 ? void 0 : options.missingArrayHandling) ===
                    1 /* WriteNull */ &&
                    !providedData) {
                    return this.formBuilder.control(null);
                }
                const childFormArrayType = type_reader_1.getTypeFromMetadataType(type, propertyName, metadataType);
                const childForms = providedData === null || providedData === void 0 ? void 0 : providedData.map((value) => {
                    return this.buildForm(childFormArrayType, value, options);
                });
                return this.formBuilder.array(childForms || []);
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
};
AutomaticFormBuilder = __decorate([
    core_1.Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], AutomaticFormBuilder);
exports.AutomaticFormBuilder = AutomaticFormBuilder;
//# sourceMappingURL=automatic-form.builder.js.map