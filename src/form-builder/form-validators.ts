import { Type } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@ng-stack/forms';
import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

type FormElement = FormGroup | FormArray | FormControl;
function assignErrorsToAffectedControls(
    form: FormGroup | FormArray,
    errors: ValidationError[],
) {
    for (const error of errors) {
        const control = form.controls?.[error.property];
        if (!control) {
            continue;
        }

        control.setErrors(error.constraints);

        if (error.children) {
            assignErrorsToAffectedControls(control, error.children);
        }
    }
}

function resetErrors(form: FormGroup | FormArray) {
    form.setErrors(null);
    const controlKeys = Object.keys(form.controls || {});
    for (const controlKey of controlKeys) {
        const control: FormElement = form.controls?.[controlKey];
        if(!control){
            continue;
        }    

        if (control instanceof FormGroup || control instanceof FormArray) {
            resetErrors(control);
        } else {
            control?.setErrors(null);
        }
    }
}

function getAllErrors(type: Type<unknown>, form: FormGroup) {
    const typedFormValue = plainToClass(type, form.value);
    return validateSync(typedFormValue as Object);
}

export const validateCompleteForm = (type: Type<unknown>) => (
    form: FormGroup,
) => {
    resetErrors(form);
    const allErrors = getAllErrors(type, form);
    assignErrorsToAffectedControls(form, allErrors);

    return allErrors;
};

function filterNonExistingPropertyErrors(errors: ValidationError[]) {
    const filteredErrors = errors?.filter((error) =>
        error.target?.hasOwnProperty(error.property),
    );
    for (const error of filteredErrors) {
        error.children =
            error.children && filterNonExistingPropertyErrors(error.children);
    }

    return filteredErrors;
}

export const validateExistingProperties = (type: Type<unknown>) => (
    form: FormGroup,
) => {
    resetErrors(form);
    const errors = getAllErrors(type, form);
    const filteredErrors = filterNonExistingPropertyErrors(errors);
    assignErrorsToAffectedControls(form, filteredErrors);

    return filteredErrors;
};
