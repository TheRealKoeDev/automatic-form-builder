import { Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { AutomaticFormBuilderOptions } from './automatic-form-builder.options';
declare type FormBuilderData<T extends Object> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<FormBuilderData<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<FormBuilderData<U>> : FormBuilderData<T[P]>;
};
export declare class AutomaticFormBuilder {
    private readonly formBuilder;
    constructor(formBuilder: FormBuilder);
    build<T extends Object>(type: Type<T>, data?: FormBuilderData<T>, options?: AutomaticFormBuilderOptions): FormGroup<T>;
    private buildForm;
    private getContraints;
    private getControl;
    private getPropertiesToBuild;
}
export {};
//# sourceMappingURL=automatic-form.builder.d.ts.map