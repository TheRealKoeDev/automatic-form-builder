import 'reflect-metadata';

import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

import {
    AutomaticFormBuilderOptions,
    FormBuildMode,
    MissingArrayHandling,
    MissingObjectHandling,
} from './automatic-form-builder.options';
import { getMetadataType } from './metadata-analyzer';

import { defaultMetadataStorage as esm2015DefaultMetadataStorage } from 'class-transformer/esm2015/storage';
import { defaultMetadataStorage as esm5DefaultMetadataStorage } from 'class-transformer/esm5/storage';
import { defaultMetadataStorage as cjsDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { MetadataStorage } from 'class-transformer/types/MetadataStorage';

import { DeepPartial } from './types/deep-partial';
import { Dictionary } from './types/dictionary';
import { MetadataType } from './types/metadata-type';

export const FORM_BUILDER_TOKEN = new InjectionToken<FormBuilder>(null);

const defaultMetadataStorage: MetadataStorage = esm2015DefaultMetadataStorage || esm5DefaultMetadataStorage || cjsDefaultMetadataStorage;

@Injectable({
    providedIn: 'root',
})
export class AutomaticFormBuilder {
    public constructor(private readonly injector: Injector) {}

    public build<T extends Object>(
        type: Type<T>,
        data?: DeepPartial<T>,
        options?: AutomaticFormBuilderOptions,
    ): FormGroup {
        const formBuilder = this.injector.get(FORM_BUILDER_TOKEN) || this.injector.get(FormBuilder);
        const groupedConstraints = this.getContraints(type);
        const form = formBuilder.group({});

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
                formBuilder,
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
        formBuilder: FormBuilder,
        type: Type<T>,
        propertyName: string,
        metadataType: MetadataType,
        data?: DeepPartial<T>,
        options?: AutomaticFormBuilderOptions,
    ) {
        const providedData = data?.[propertyName];
        switch (metadataType) {
            case MetadataType.Primitive:
                return formBuilder.control(providedData);
            case MetadataType.Array:
                const arrayAsNull = this.shouldWriteNull(providedData, options?.missingArrayHandling);
                if (arrayAsNull) {
                    return formBuilder.control(null);
                }

                const controls = providedData?.map((value: unknown) => {
                    return formBuilder.control(value);
                });

                return formBuilder.array(controls || []);
            case MetadataType.Object:
                const objectAsNull = this.shouldWriteNull(providedData, options?.missingObjectHandling);
                if (objectAsNull) {
                    return formBuilder.control(null);
                }

                const objectTypeMetadata = defaultMetadataStorage.findTypeMetadata(type, propertyName);
                return this.build(objectTypeMetadata?.reflectedType || Object, providedData, options);
            case MetadataType.ObjectArray:
                const arrayObjectAsNull = this.shouldWriteNull(providedData, options?.missingObjectHandling);
                if (arrayObjectAsNull) {
                    return formBuilder.control(null);
                }

                const objectArrayTypeMetadata = defaultMetadataStorage.findTypeMetadata(type, propertyName);
                const childForms: unknown[] = providedData?.map(
                    (value: unknown) => {
                        return this.build(
                            objectArrayTypeMetadata?.reflectedType || Object,
                            value,
                            options,
                        );
                    },
                );

                return formBuilder.array(childForms || []);
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

    private shouldWriteNull(value: unknown, handling?: MissingObjectHandling | MissingArrayHandling){
        const isWriteNullHandling = handling === MissingObjectHandling.WriteNull || handling === MissingArrayHandling.WriteNull;
        return !value && isWriteNullHandling;
    }
}
