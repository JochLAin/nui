const translations: Record<string, Record<string, string>> = {
  yes: { fr: 'Oui', en: 'Yes' },
  no: { fr: 'Non', en: 'No' },
};

export default function translate(key: string, args: Record<string, string|number> = {}, locale: string = document.documentElement.lang): string {
  return Object.entries(args).reduce((translation, [key, value]) => {
    return translation.replace(`{${key}}`, String(value));
  }, translations[key]?.[locale] || key);
}
