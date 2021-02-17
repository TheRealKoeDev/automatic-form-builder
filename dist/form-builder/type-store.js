"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTypeStore = exports.TypeStore = void 0;
class TypeStore {
    constructor() {
        this.typeMap = {};
    }
    registerType(parentClass, property, childClass) {
        const propertyMap = this.typeMap[parentClass.name] || {};
        propertyMap[property] = childClass;
        this.typeMap[parentClass.name] = propertyMap;
    }
    getType(parentClass, property) {
        var _a;
        return (_a = this.typeMap[parentClass.name]) === null || _a === void 0 ? void 0 : _a[property];
    }
}
exports.TypeStore = TypeStore;
exports.defaultTypeStore = new TypeStore();
//# sourceMappingURL=type-store.js.map