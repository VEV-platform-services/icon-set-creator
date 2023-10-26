"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = exports.log = void 0;
/* eslint-disable no-debugger, no-console */
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const format = (label, msg) => msg.split('\n').map((line, i) => (i === 0
    ? `${label} ${line}`
    : line.padStart((0, strip_ansi_1.default)(label).length + line.length + 1))).join('\n');
const chalkTag = (msg) => chalk_1.default.bgBlackBright.white.dim(` ${msg} `);
const log = (msg = '', tag = null) => (tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg));
exports.log = log;
const info = (msg, tag = null) => {
    console.log(format(chalk_1.default.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
};
exports.info = info;
const warn = (msg, tag = null) => {
    console.warn(format(chalk_1.default.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk_1.default.yellow(msg)));
};
exports.warn = warn;
const error = (msg, tag = null) => {
    console.error(format(chalk_1.default.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk_1.default.red(msg)));
};
exports.error = error;
//# sourceMappingURL=logger.js.map