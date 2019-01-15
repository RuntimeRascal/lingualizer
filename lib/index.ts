
export type Locale = 'en-US' | 'es-MX' | null;

export var _locale: Locale | null = null;

export function setLocale( locale: Locale )
{
    _locale = locale;
    console.log(  `set locale to ${_locale}` );
}

export function getLocale( ) : Locale
{
    return _locale;
}