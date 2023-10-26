"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const _1 = require(".");
exports.default = (methodName, log) => {
    commander_1.program[methodName] = function enhanceErrorMessages(...args) {
        /* eslint-disable no-underscore-dangle */
        if (methodName === 'unknownOption' && this._allowUnknownOption) {
            return;
        }
        this.outputHelp();
        console.log(`  ${_1.chalk.red(log(...args))}`);
        console.log();
        process.exit(1);
    };
};
//# sourceMappingURL=enhanceErrorMessages.js.map