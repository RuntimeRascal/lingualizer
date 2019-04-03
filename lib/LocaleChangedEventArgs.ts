import { Locale } from './ILocale';

/* specifies data args to pass to subscribers on locale changed event raised */
export type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
}