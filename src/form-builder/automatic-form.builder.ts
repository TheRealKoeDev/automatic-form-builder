import { Injectable, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@ng-stack/forms';
import { getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

import {
    AutomaticFormBuilderOptions,
    FormBuildMode,
    MissingArrayHandling,
    MissingObjectHandling,
    ValidationMode,
} from './automatic-form-builder.options';
import {
    validateCompleteForm,
    validateExistingProperties,
} from './form-validators';
import { getMetadataType, MetadataType } from './metadata-analyzer';
import { getTypeFromMetadataType } from './type-reader';

type FormBuilderData<T extends Object> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<FormBuilderData<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<FormBuilderData<U>>
        : FormBuilderData<T[P]>;
};

type Dictionary<T> = {
    [key: string]: T
}

@Injectable({
    providedIn: 'root',
})
export class AutomaticFormBuilder {
    public constructor(private readonly formBuilder: FormBuilder) {}

    public build<T extends Object>(
        type: Type<T>,
        data?: FormBuilderData<T>,
        options?: AutomaticFormBuilderOptions,
    ): FormGroup<T> {
        const form = this.buildForm(type, data || {}, options);

        switch (options?.validation) {
            case ValidationMode.None:
                break;
            case ValidationMode.ValidateExistingProperties:
                const existingPropertyValidator = validateExistingProperties(type);
                form.setValidators(existingPropertyValidator);
                existingPropertyValidator(form);
                break;
            default:
                const completeValidator = validateCompleteForm(type);
                form.setValidators(completeValidator);
                completeValidator(form);
        }
    
        return form;
    }

    private buildForm<T extends Object>(
        type: Type<T>,
        data?: FormBuilderData<T>,
        options?: AutomaticFormBuilderOptions,
    ): FormGroup<T> {
        const groupedConstraints = this.getContraints(type);
        const form = this.formBuilder.group({});

        const propertiesToBuild = this.getPropertiesToBuild(
            groupedConstraints,
            options?.formBuildMode,
            data,
        );

        for (const propertyName of propertiesToBuild) {
            const metadataType = getMetadataType(
                groupedConstraints[propertyName],
            );

            const control = this.getControl(
                type,
                propertyName,
                metadataType,
                data,
                options,
            );

            form.addControl(propertyName, control);
        }

        return form;
    }

    private getContraints(type: Type<unknown>) {
        const metadataStore = getMetadataStorage();
        const constraints = metadataStore.getTargetValidationMetadatas(
            type,
            null,
            true,
            false
        );
        return metadataStore.groupByPropertyName(constraints);
    }

    private getControl<T>(
        type: Type<T>,
        propertyName: string,
        metadataType: MetadataType,
        data?: FormBuilderData<T>,
        options?: AutomaticFormBuilderOptions,
    ) {
        const providedData = data?.[propertyName];
        switch (metadataType) {
            case MetadataType.Primitive:
                return this.formBuilder.control(providedData);
            case MetadataType.Array:
                if (
                    options?.missingArrayHandling ===
                        MissingArrayHandling.WriteNull &&
                    !providedData
                ) {
                    return this.formBuilder.control(null);
                }

                const controls = providedData?.map((value: unknown) => {
                    return this.formBuilder.control(value);
                });

                return this.formBuilder.array(controls || []);
            case MetadataType.Object:
                if (
                    options?.missingObjectHandling ===
                        MissingObjectHandling.WriteNull &&
                    !providedData
                ) {
                    return this.formBuilder.control(null);
                }

                const childFormType = getTypeFromMetadataType(
                    type,
                    propertyName as keyof T,
                    metadataType,
                );

                return this.buildForm(childFormType, providedData, options);
            case MetadataType.ObjectArray:
                if (
                    options?.missingArrayHandling ===
                        MissingArrayHandling.WriteNull &&
                    !providedData
                ) {
                    return this.formBuilder.control(null);
                }

                const childFormArrayType = getTypeFromMetadataType(
                    type,
                    propertyName as keyof T,
                    metadataType,
                );

                const childForms: unknown[] = providedData?.map(
                    (value: unknown) => {
                        return this.buildForm(
                            childFormArrayType,
                            value,
                            options,
                        );
                    },
                );

                return this.formBuilder.array(childForms || []);
        }
    }

    private getPropertiesToBuild(
        constraints: Dictionary<ValidationMetadata[]>,
        buildMode?: FormBuildMode,
        data?: {},
    ) {
        const allFields = Object.keys(constraints);

        switch (buildMode) {
            case FormBuildMode.ProvidedDataOnly:
                return Object.keys(data || {}).filter((field) =>
                    allFields.includes(field),
                );
            case FormBuildMode.ProvidedObjectsOnly:
                return data ? allFields : [];

            default:
                return allFields;
        }
    }
}
