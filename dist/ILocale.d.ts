declare type Locale = 'en-US' | 'es-MX' | 'fr-FR' | 'nl-NL' | 'de-DE' | 'it-IT' | 'pol' | 'el-GR' | 'pt-BR' | 'pt-PT' | 'ar-SA' | 'zh-CHT' | 'ko-KR' | 'ja-JP' | 'vi-VN' | 'ro-RO' | 'ru-RU' | 'bg-BG' | 'id-ID' | 'mk-MK' | 'th-TH' | 'zh-CHS' | 'tr-TR' | null;
interface ILocale {
    locale: Locale;
    tag: string;
    language: string;
}
declare var Lookup: ILocale[];
export { Locale, ILocale, Lookup };
