
/* specifies all possible locale's */
type Locale = 'en-US' |
    'es-MX' |
    'fr-FR' |
    'nl-NL' |
    'de-DE' |
    'it-IT' |
    'pol' |
    'el-GR' |
    'pt-BR' |
    'pt-PT' |
    'ar-SA' |
    'zh-CHT' |
    'ko-KR' |
    'ja-JP' |
    'vi-VN' |
    'ro-RO' |
    'ru-RU' |
    'bg-BG' |
    'id-ID' |
    'mk-MK' |
    'th-TH' |
    'zh-CHS' |
    'tr-TR' |
    null;

interface ILocale
{
    locale: Locale;
    tag: string;
    language: string;
}

var Lookup: ILocale[] = [
    { locale: 'en-US', tag: 'English', language: 'United States' },
    { locale: 'es-MX', tag: 'Spanish', language: 'Mexico' },
    { locale: 'fr-FR', tag: 'French', language: 'France' },
    { locale: 'nl-NL', tag: 'Dutch', language: 'Netherlands' },
    { locale: 'de-DE', tag: 'German', language: 'Germany' },
    { locale: 'it-IT', tag: 'Italian', language: 'Italian' },
    { locale: 'pol', tag: 'Polish', language: 'Poland' },
    { locale: 'el-GR', tag: 'Greek ', language: 'Greece' },
    { locale: 'pt-BR', tag: 'Portuguese', language: 'Brazil' },
    { locale: 'pt-PT', tag: 'Portuguese', language: 'Portugal' },
    { locale: 'ar-SA', tag: 'Arabic', language: 'Arabic' },
    { locale: 'zh-CHT', tag: 'Chinese', language: 'Traditional' },
    { locale: 'ko-KR', tag: 'Korean', language: 'Korea' },
    { locale: 'ja-JP', tag: 'Japanese', language: 'Japan' },
    { locale: 'vi-VN', tag: 'Vietnamese', language: 'Vietnamese' },
    { locale: 'ro-RO', tag: 'Romanian', language: 'Romanian' },
    { locale: 'ru-RU', tag: 'Russian', language: 'Russian' },
    { locale: 'bg-BG', tag: 'Bulgarian', language: 'Bulgarian' },
    { locale: 'id-ID', tag: 'Indonesian ', language: 'Indonesia' },
    { locale: 'mk-MK', tag: 'Macedonian', language: 'Macedonian' },
    { locale: 'th-TH', tag: 'Thai', language: 'Thailand' },
    { locale: 'zh-CHS', tag: 'Chinese ', language: 'Simplified' },
    { locale: 'tr-TR', tag: 'Turkish', language: 'Turkey' },
];

export { Locale, ILocale, Lookup };