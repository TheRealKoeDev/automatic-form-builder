"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildType = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const type_store_1 = require("./type-store");
function BuildType(typeFunction, options) {
    return function (target, propertyKey) {
        const ParentConstructor = target.constructor;
        const property = propertyKey === null || propertyKey === void 0 ? void 0 : propertyKey.toString();
        const newObject = new ParentConstructor();
        const typeHelpOptions = {
            newObject,
            object: target,
            property,
        };
        const ChildType = typeFunction(typeHelpOptions);
        type_store_1.defaultTypeStore.registerType(ParentConstructor, property, ChildType);
        class_transformer_1.Type(() => ChildType, options)(target, property);
    };
}
exports.BuildType = BuildType;
//# sourceMappingURL=build-type.js.map