import polyglotI18nProvider from 'ra-i18n-polyglot';
import type { I18nProvider } from 'shadmin';
import englishMessages from './i18n/en';

const messages = {
    fr: () => import('./i18n/fr').then(messages => messages.default),
};

const i18nProvider: I18nProvider = polyglotI18nProvider(
    locale => {
        if (locale === 'fr') {
            return messages[locale]();
        }

        // Always fallback on english
        return englishMessages;
    },
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);
