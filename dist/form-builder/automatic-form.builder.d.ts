import { Injector, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutomaticFormBuilderOptions } from './automatic-form-builder.options';
import { DeepPartial } from './types/deep-partial';
export declare class AutomaticFormBuilder {
    private readonly injector;
    constructor(injector: Injector);
    build<T extends Object>(type: Type<T>, data?: DeepPartial<T>, options?: AutomaticFormBuilderOptions): FormGroup;
    private getContraints;
    private getControl;
    private getPropertiesToBuild;
    private shouldWriteNull;
}
//# sourceMappingURL=automatic-form.builder.d.ts.map