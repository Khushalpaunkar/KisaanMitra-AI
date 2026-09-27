/* =========================================================
   KISAANMITRA AI — LANGUAGE TRANSLATOR
   Google Translate based website translation
========================================================= */

(function () {
    "use strict";

    const COOKIE_NAME = "googtrans";
    const SOURCE_LANG = "en";

    function setLanguage(lang) {
        if (!lang) return;

        // Google Translate cookie
        const cookieValue = `/en/${lang}`;

        document.cookie =
            `${COOKIE_NAME}=${cookieValue};path=/`;

        // Also set for current domain
        document.cookie =
            `${COOKIE_NAME}=${cookieValue};path=/;domain=${location.hostname}`;

        // Reload so Google Translate applies the selected language
        window.location.reload();
    }

    window.changeLanguage = setLanguage;

    window.resetLanguage = function () {
        document.cookie =
            `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;

        document.cookie =
            `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${location.hostname}`;

        window.location.reload();
    };

    // Google Translate callback
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            {
                pageLanguage: SOURCE_LANG,
                includedLanguages: "en,hi,mr,te,ta,bn",
                autoDisplay: false
            },
            "google_translate_element"
        );
    };

})();