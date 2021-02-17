"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildType = void 0;
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const type_store_1 = require("./type-store");
function BuildType(typeFunction, options) {
    return function (target, propertyKey) {
        const ParentConstructor = target.constructor;
        const newObject = new ParentConstructor();
        const typeHelpOptions = {
            newObject,
            object: target,
            property: propertyKey === null || propertyKey === void 0 ? void 0 : propertyKey.toString(),
        };
        const ChildType = typeFunction(typeHelpOptions);
        type_store_1.defaultTypeStore.registerType(ParentConstructor, propertyKey === null || propertyKey === void 0 ? void 0 : propertyKey.toString(), ChildType);
        class_transformer_1.Type(() => ChildType, options)(target, propertyKey);
    };
}
exports.BuildType = BuildType;
//# sourceMappingURL=build-type.js.map