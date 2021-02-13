"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExistingProperties = exports.validateCompleteForm = void 0;
const forms_1 = require("@ng-stack/forms");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function assignErrorsToAffectedControls(form, errors) {
    var _a;
    for (const error of errors) {
        const control = (_a = form.controls) === null || _a === void 0 ? void 0 : _a[error.property];
        if (!control) {
            continue;
        }
        control.setErrors(error.constraints);
        if (error.children) {
            assignErrorsToAffectedControls(control, error.children);
        }
    }
}
function resetErrors(form) {
    var _a;
    form.setErrors(null);
    const controlKeys = Object.keys(form.controls || {});
    for (const controlKey of controlKeys) {
        const control = (_a = form.controls) === null || _a === void 0 ? void 0 : _a[controlKey];
        if (!control) {
            continue;
        }
        if (control instanceof forms_1.FormGroup || control instanceof forms_1.FormArray) {
            resetErrors(control);
        }
        else {
            control === null || control === void 0 ? void 0 : control.setErrors(null);
        }
    }
}
function getAllErrors(type, form) {
    const typedFormValue = class_transformer_1.plainToClass(type, form.value);
    return class_validator_1.validateSync(typedFormValue);
}
const validateCompleteForm = (type) => (form) => {
    resetErrors(form);
    const allErrors = getAllErrors(type, form);
    assignErrorsToAffectedControls(form, allErrors);
    return allErrors;
};
exports.validateCompleteForm = validateCompleteForm;
function filterNonExistingPropertyErrors(errors) {
    const filteredErrors = errors === null || errors === void 0 ? void 0 : errors.filter((error) => { var _a; return (_a = error.target) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(error.property); });
    for (const error of filteredErrors) {
        error.children =
            error.children && filterNonExistingPropertyErrors(error.children);
    }
    return filteredErrors;
}
const validateExistingProperties = (type) => (form) => {
    resetErrors(form);
    const errors = getAllErrors(type, form);
    const filteredErrors = filterNonExistingPropertyErrors(errors);
    assignErrorsToAffectedControls(form, filteredErrors);
    return filteredErrors;
};
exports.validateExistingProperties = validateExistingProperties;
//# sourceMappingURL=form-validators.js.map