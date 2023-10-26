"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_1 = require("../../utils/index");
const ios_1 = __importDefault(require("./ios"));
const android_1 = __importDefault(require("./android"));
;
class Creator {
    constructor(opts) {
        const context = process.cwd();
        const config = (0, index_1.resolveConfig)(context);
        if (!opts.imagePath) {
            opts.imagePath = config.imagePath;
        }
        const options = Object.assign(Object.assign({}, config), opts);
        // both android and ios are included by default
        if (!options.android && !options.ios) {
            options.android = true;
            options.ios = true;
        }
        this.context = context;
        this.options = options;
        this.resovleOptionPaths();
    }
    resovleOptionPaths() {
        const context = process.cwd();
        const options = this.options;
        const paths = [
            'imagePath',
            'imagePathIos',
            'imagePathAndroid',
            'adaptiveIconBackground',
            'adaptiveIconForeground',
        ];
        for (const prop of paths) {
            if (typeof options[prop] !== 'undefined') {
                if (!options[prop].match(/^#[0-9A-Za-z]{6}$/)) {
                    options[prop] = path_1.default.resolve(context, options[prop]);
                }
            }
        }
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.options;
            const context = this.context;
            if (options.android) {
                (0, index_1.info)('Creating icons for Android...');
                const imagePathAndroid = options.imagePathAndroid || options.imagePath;
                if (!imagePathAndroid) {
                    return (0, index_1.error)('No image path was specified for android');
                }
                const androidIconCreator = new android_1.default(context, {
                    flavor: options.flavor,
                    android: options.android,
                });
                yield androidIconCreator.createAndroidIcons(imagePathAndroid);
                const { adaptiveIconBackground, adaptiveIconForeground } = options;
                if (adaptiveIconBackground && adaptiveIconForeground) {
                    yield androidIconCreator.createAdaptiveIcons(adaptiveIconBackground, adaptiveIconForeground);
                }
            }
            if (options.ios) {
                (0, index_1.info)('Creating icons for IOS...');
                const iOSIconCreator = new ios_1.default(context, {
                    ios: options.ios,
                    flavor: options.flavor,
                    group: options.group,
                    disableLauncherIcon: options.disableLauncherIcon,
                });
                const imagePathIos = options.imagePathIos || options.imagePath;
                if (!imagePathIos) {
                    return (0, index_1.error)('No image path was specified for iOS');
                }
                yield iOSIconCreator.createIosIcons(imagePathIos);
            }
            (0, index_1.log)();
            (0, index_1.log)('🎉  Successfully generated icons.');
        });
    }
}
exports.default = Creator;
//# sourceMappingURL=index.js.map