#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leven_1 = __importDefault(require("leven"));
const minimist_1 = __importDefault(require("minimist"));
const commander_1 = require("commander");
const index_1 = __importDefault(require("./lib/creator/index"));
const index_2 = require("./utils/index");
const package_json_1 = require("./package.json");
const requiredVersion = package_json_1.engines.node;
const checkNodeVersion = (wanted, id) => {
    if (!index_2.semver.satisfies(process.version, wanted, { includePrerelease: true })) {
        console.log(index_2.chalk.red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
};
// Check node version before requiring/doing anything else
// The user may be on a very old node version
checkNodeVersion(requiredVersion, 'icon-set-creator');
const suggestCommands = (unknownCommand) => {
    const availableCommands = commander_1.program.commands.map((cmd) => cmd.name());
    let suggestion = '';
    availableCommands.forEach((cmd) => {
        const isBestMatch = (0, leven_1.default)(cmd, unknownCommand) < (0, leven_1.default)(suggestion || '', unknownCommand);
        if ((0, leven_1.default)(cmd, unknownCommand) < 3 && isBestMatch) {
            suggestion = cmd;
        }
    });
    if (suggestion) {
        console.log('  ' + index_2.chalk.red(`Did you mean ${index_2.chalk.yellow(suggestion)}?`));
    }
};
commander_1.program
    .version(`icon-set-creator ${require('./package').version}`)
    .usage('<command> [options]');
commander_1.program
    .command('create [image-path]')
    .description('Generate a new icon set for React Native project')
    .option('-A, --android [icon-name]', 'Generate icon set for android')
    .option('-IPA, --image-path-android', 'Image path for android')
    .option('--flavor [flavor]', 'Flavor name')
    .option('-b, --adaptive-icon-background <background>', 'The color (E.g. "#ffffff") or image asset (E.g. "assets/images/christmas-background.png") which will be used to fill out the background of the adaptive icon.')
    .option('-f, --adaptive-icon-foreground <foreground>', 'The image asset which will be used for the icon foreground of the adaptive icon')
    .option('-I, --ios', 'Generate icon set for ios')
    .option('--group <group>', 'Group for ios')
    .option('-d, --disable-launcher-icon', 'Disable changing the launcher icon for ios')
    .option('-IPI, --image-path-ios', 'Image path for ios')
    .action((imagePath, options) => {
    if ((0, minimist_1.default)(process.argv.slice(3))._.length > 1) {
        console.log(index_2.chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the source file, the rest are ignored.'));
    }
    const iconCreator = new index_1.default(Object.assign(Object.assign({}, options), { imagePath }));
    iconCreator.run();
});
commander_1.program
    .command('remove')
    .description('remove a icon set from React Native project')
    .option('-A, --android', 'remove icon set for android')
    .option('-I, --ios', 'remove icon set for ios')
    .action((options) => {
    console.log(options);
    // require('../lib/remove')(options);
});
// output help information on unknown commands
commander_1.program.on('command:*', ([cmd]) => {
    commander_1.program.outputHelp();
    console.log('  ' + index_2.chalk.red(`Unknown command ${index_2.chalk.yellow(cmd)}.`));
    console.log();
    suggestCommands(cmd);
    process.exitCode = 1;
});
// add some useful info on help
commander_1.program.on('--help', () => {
    console.log();
    console.log(`  Run ${index_2.chalk.cyan('iconset <command> --help')} for detailed usage of given command.`);
    console.log();
});
commander_1.program.commands.forEach(c => c.on('--help', () => console.log()));
// enhance common error messages
const enhanceErrorMessages_1 = __importDefault(require("./utils/enhanceErrorMessages"));
(0, enhanceErrorMessages_1.default)('missingArgument', (argName) => {
    return `Missing required argument ${index_2.chalk.yellow(`<${argName}>`)}.`;
});
(0, enhanceErrorMessages_1.default)('unknownOption', (optionName) => {
    return `Unknown option ${index_2.chalk.yellow(optionName)}.`;
});
(0, enhanceErrorMessages_1.default)('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${index_2.chalk.yellow(option.flags)}` + (flag ? `, got ${index_2.chalk.yellow(flag)}` : '');
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map