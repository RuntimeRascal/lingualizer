import chalkpack = require('chalk');
export declare const chalk: chalkpack.Chalk;
export declare const terminalPrefix: string;
export declare type Locale = 'en-US' | 'es-MX' | 'fr-FR' | 'nl-NL' | 'de-DE' | 'it-IT' | 'pol' | 'el-GR' | 'pt-BR' | 'pt-PT' | 'ar-SA' | 'zh-CHT' | 'ko-KR' | 'ja-JP' | 'vi-VN' | 'ro-RO' | 'ru-RU' | 'bg-BG' | 'id-ID' | 'mk-MK' | 'th-TH' | 'zh-CHS' | 'tr-TR' | null;
interface ILocale {
    locale: Locale;
    tag: string;
    language: string;
}
export declare var Lookup: ILocale[];
export interface IArgV {
    verbose?: boolean;
    basedOff?: string;
    v?: boolean;
    version?: boolean;
    value?: string;
    force?: boolean;
    defaultLocale?: string;
    defaultTranslationFileName?: string;
    defaultLocalizationDirName?: string;
    defaultTranslationFileExt?: string;
    isElectron?: boolean;
    key?: string;
    cwd?: string;
    cmdCwd?: string;
    k?: string;
    fileName?: string;
    locale?: string;
    l?: string;
    $0: string;
    _: string;
    asyncResult: Promise<any>;
}
export declare function log(message?: any): any;
export declare function getLocale(argv: IArgV): string;
export declare function shouldUseProjectName(): boolean;
export declare function getLocalizationFileName(cmd: boolean): string;
export declare function getLocalizationDirectoryPath(cmd: boolean, optionalRoot?: any): string;
export declare function getFileNameWithExtention(argv: IArgV, cmd: boolean): string;
export declare function isValidUrl(url: string): boolean;
export declare function getJsonFile(url?: string, filePath?: string): Promise<string>;
export declare function writeFile(filePath: string, contents: any): boolean;
export declare function getNestedValueFromJson(obj: object, dotSeperatedKey: string): any;
export {};
