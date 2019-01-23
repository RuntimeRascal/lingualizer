import chalkpack = require('chalk');
export declare const chalk: chalkpack.Chalk;
export declare const terminalPrefix: string;
export declare function log(message?: any): void;
export interface IArgV {
    verbose?: boolean;
    basedOff?: string;
    v?: boolean;
    version?: boolean;
    value?: string;
    force?: boolean;
    defaultLocale?: string;
    defaultranslationFileName?: string;
    defaulLocalizationDirName?: string;
    defaultranslationFileExt?: string;
    key?: string;
    k?: string;
    fileName?: string;
    locale?: string;
    l?: string;
    $0: string;
    _: string;
}
export declare function getLocale(argv: IArgV): string;
export declare function shouldUseProjectName(): boolean;
/**
 * gets the path to the localization directory according to the default directory name
 */
export declare function getLocalizationDirectory(): string;
/**
 *
 * @param locale the given locale, if none then assume default
 */
export declare function getFileName(argv: IArgV): string;
export declare function isValidUrl(url: string): boolean;
/**
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
export declare function getJsonFile(url?: string, filePath?: string): Promise<string>;
