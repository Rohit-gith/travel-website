// Poori website ko English <-> Odia (ଓଡ଼ିଆ) me badalne ka system.
// Google Translate ka use hota hai (free). Click karte hi page ka saara text, tours, cars,
// services, buttons sab Odia me badal jata hai. Dobara click karne par English wapas.
//
// Kaise kaam karta hai:
//   1. "ଓଡ଼ିଆ" dabane par browser me 'googtrans' cookie set hoti hai aur page reload hota hai
//   2. Reload ke baad ye file Google ki translate script load karti hai, jo cookie dekhke page translate kar deti hai
//   3. "English" dabane par cookie hat jati hai aur page wapas English me aa jata hai

const COOKIE = 'googtrans';
const TARGET = 'or'; // Odia ka language code
const SCRIPT_ID = 'google-translate-script';
const ELEMENT_ID = 'google_translate_element';

const readCookie = () =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.split('=')[1] || '';

export const isOdia = () => readCookie().endsWith(`/${TARGET}`);

function clearCookie() {
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const host = window.location.hostname;
  document.cookie = `${COOKIE}=; ${expire}; path=/`;
  document.cookie = `${COOKIE}=; ${expire}; path=/; domain=${host}`;
  document.cookie = `${COOKIE}=; ${expire}; path=/; domain=.${host}`;
}

// 'or' (Odia) ya 'en' (English) chuno. Page reload hota hai
export function setLanguage(lang) {
  clearCookie();
  if (lang === TARGET) document.cookie = `${COOKIE}=/en/${TARGET}; path=/`;
  window.location.reload();
}

export const toggleLanguage = () => setLanguage(isOdia() ? 'en' : TARGET);

// Google Translate page ke text ko <font> tags me lapet deta hai. React ko jab wo node hatane/jodne hote hain
// to "removeChild" error aa sakta hai. Ye patch us error se bachata hai.
function protectReactFromTranslate() {
  if (window.__translatePatched) return;
  window.__translatePatched = true;

  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function patchedRemoveChild(child) {
    if (child.parentNode !== this) return child;
    return removeChild.apply(this, arguments);
  };

  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function patchedInsertBefore(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return insertBefore.apply(this, arguments);
  };
}

function loadGoogleScript() {
  if (document.getElementById(SCRIPT_ID)) return;

  // Google ko ek (chhupa hua) element chahiye jahan wo apna engine lagata hai
  if (!document.getElementById(ELEMENT_ID)) {
    const holder = document.createElement('div');
    holder.id = ELEMENT_ID;
    holder.style.display = 'none';
    document.body.appendChild(holder);
  }

  window.googleTranslateElementInit = () => {
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: TARGET, autoDisplay: false },
      ELEMENT_ID
    );
  };

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

// App shuru hote hi (main.jsx se) ek baar chalao
export function initTranslate() {
  protectReactFromTranslate();
  if (isOdia()) loadGoogleScript(); // Odia chuna ho tabhi Google ki script load hoti hai (English me site halki rehti hai)
}