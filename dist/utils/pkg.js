"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const read_pkg_1 = __importDefault(require("read-pkg"));
exports.default = (context) => {
    var _a;
    if (fs_1.default.existsSync(path_1.default.join(context, '.iconsetrc.js'))) {
        return require(path_1.default.join(context, '.iconsetrc.js'));
    }
    if (fs_1.default.existsSync(path_1.default.join(context, '.iconsetrc.json'))) {
        return require(path_1.default.join(context, '.iconsetrc.json'));
    }
    if (fs_1.default.existsSync(path_1.default.join(context, 'package.json'))) {
        return ((_a = read_pkg_1.default.sync({ cwd: context })) === null || _a === void 0 ? void 0 : _a.iconsetConfig) || {};
    }
    return {};
};
//# sourceMappingURL=pkg.js.map