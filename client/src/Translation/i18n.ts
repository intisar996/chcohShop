
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import translationEN from '../../src/locales/en/translation.json'; 
import translationAR from '../../src/locales/ar/translation.json'; 


const currentLang = localStorage.getItem('language') || 'en';



i18n.on("languageChanged", (lng) => {

    if (lng === "ar") {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar";
    } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = lng;
    }
})


const resources = {

    en: {
        translation: translationEN
    },
    ar: {
        translation: translationAR

    },
};


i18n.use(initReactI18next).init({
    resources,
    lng: currentLang,
    fallbackLng:'en' ,
    keySeparator: false,
    interpolation: {
        escapeValue: false,

    },

});

export default i18n;
