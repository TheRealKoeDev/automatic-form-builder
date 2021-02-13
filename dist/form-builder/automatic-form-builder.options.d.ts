export declare const enum ValidationMode {
    /**
     * Does Validate the whole Object
     */
    FullValidation = 0,
    /**
     * Only validates Properties that exist on the Object
     */
    ValidateExistingProperties = 1,
    /**
     * No validator is applied
     */
    None = 2
}
export declare const enum FormBuildMode {
    /**
     * Builds all controls. Is Default value
     */
    All = 0,
    /**
     * Only builds controls that exist in the provided data
     */
    ProvidedDataOnly = 1,
    /**
     * Builds all controls of objects that are Provided in data
     */
    ProvidedObjectsOnly = 2
}
export declare const enum MissingObjectHandling {
    /**
     * Generate the Object if an Object-Property is null or undefined.
     * Is default behavior.
     */
    WriteObject = 0,
    /**
     * Writes a control with value null if an Object-Property is null or undefined.
     */
    WriteNull = 1
}
export declare const enum MissingArrayHandling {
    /**
     * Generate a empty Array if an Array-Property is null or undefined.
     * Is default behavior.
     */
    WriteArray = 0,
    /**
     * Writes a control with value null if an Array-Property is null or undefined.
     */
    WriteNull = 1
}
export declare type AutomaticFormBuilderOptions = {
    validation?: ValidationMode;
    formBuildMode?: FormBuildMode;
    missingObjectHandling?: MissingObjectHandling;
    missingArrayHandling?: MissingArrayHandling;
};
//# sourceMappingURL=automatic-form-builder.options.d.ts.map