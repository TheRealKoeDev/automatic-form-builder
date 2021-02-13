export const enum ValidationMode {
    /**
     * Does Validate the whole Object
     */
    FullValidation,

    /**
     * Only validates Properties that exist on the Object
     */
    ValidateExistingProperties,

    /**
     * No validator is applied
     */
    None,
}

export const enum FormBuildMode {
    /**
     * Builds all controls. Is Default value
     */
    All,

    /**
     * Only builds controls that exist in the provided data
     */
    ProvidedDataOnly,

    /**
     * Builds all controls of objects that are Provided in data
     */
    ProvidedObjectsOnly,
}

export const enum MissingObjectHandling {
    /**
     * Generate the Object if an Object-Property is null or undefined.
     * Is default behavior.
     */
    WriteObject,

    /**
     * Writes a control with value null if an Object-Property is null or undefined.
     */
    WriteNull,
}

export const enum MissingArrayHandling {
    /**
     * Generate a empty Array if an Array-Property is null or undefined.
     * Is default behavior.
     */
    WriteArray,

    /**
     * Writes a control with value null if an Array-Property is null or undefined.
     */
    WriteNull,
}

export type AutomaticFormBuilderOptions = {
    validation?: ValidationMode;
    formBuildMode?: FormBuildMode;
    missingObjectHandling?: MissingObjectHandling;
    missingArrayHandling?: MissingArrayHandling;
};
