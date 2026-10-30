import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import translations from "./translations";

const LanguageContext = createContext(null);

// Default language
const DEFAULT_LANGUAGE = "hi";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return (
      localStorage.getItem("tuljai_language") ||
      DEFAULT_LANGUAGE
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "tuljai_language",
      language
    );

    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage) => {
    if (!translations[newLanguage]) {
      return;
    }

    setLanguageState(newLanguage);
  };

  const t = (key) => {
    return (
      translations[language]?.[key] ||
      translations[DEFAULT_LANGUAGE]?.[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};


// ==========================================
// useLanguage
// ==========================================

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};