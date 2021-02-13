import { Type } from '@angular/core';
import { FormGroup } from '@ng-stack/forms';
import { ValidationError } from 'class-validator';
export declare const validateCompleteForm: (type: Type<unknown>) => (form: FormGroup) => ValidationError[];
export declare const validateExistingProperties: (type: Type<unknown>) => (form: FormGroup) => ValidationError[];
//# sourceMappingURL=form-validators.d.ts.map