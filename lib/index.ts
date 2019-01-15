

export function localizeIt(locale: 'en-US'|'es-MX'| string, str:string)
{
    if ( locale.startsWith('en'))
    {
        return str;
    }
    if ( locale.startsWith('es'))
    {
        return 'holla';
    }

    return str;
}