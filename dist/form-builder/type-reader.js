"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeFromMetadataType = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const metadata_analyzer_1 = require("./metadata-analyzer");
const getTypeFromMetadataType = (parentType, property, metaDataType) => {
    if (metaDataType === metadata_analyzer_1.MetadataType.ObjectArray) {
        const plainObject = {
            [property]: [{}],
        };
        const typedObject = class_transformer_1.plainToClass(parentType, plainObject);
        return typedObject[property][0].constructor;
    }
    else {
        const plainObject = {
            [property]: {},
        };
        const typedObject = class_transformer_1.plainToClass(parentType, plainObject);
        return typedObject[property].constructor;
    }
};
exports.getTypeFromMetadataType = getTypeFromMetadataType;
//# sourceMappingURL=type-reader.js.map