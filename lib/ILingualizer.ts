import { IEvent } from 'ste-events';
import { Locale } from './ILocale';
import { LocaleChangedEventArgs } from './LocaleChangedEventArgs';
import { ILogger } from './ILogger';

interface ILingualizer
{
    DefaultLocale: Locale;
    DefaultranslationFileName: string;
    DefaulLocalizationDirName: string;
    DefaultTranslationFileExt: string;
    IsElectron: boolean;
    Cwd: string;
    CmdCwd: string;
    ProjectRoot: string;
    root: string;
    onLocaleChanged: IEvent<any, LocaleChangedEventArgs>;
    locale: Locale;
    get: ( key: string ) => string;
    initTranslations: ( oldLocale?: Locale ) => void;
    setLogger: ( logger: ILogger ) => void;
    setProjectDir: ( projectDir: string ) => void;
    updateDefaults: ( configu?: any ) => any;
    printDefaults: () => void;
}

export { ILingualizer };