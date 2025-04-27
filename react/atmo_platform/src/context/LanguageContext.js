import { createContext, useState, useContext, useLayoutEffect } from "react";
import sidebar_strings from "../localizations/Sidebar";
import navbar_strings from "../localizations/Navbar";
import data_manager_strings from "../localizations/DataManager";
import optimization_strings from "../localizations/Optimization";
import analytics_strings from "../localizations/Analytics";
import prediction_strings from "../localizations/Prediction";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState();

  const changeLanguage = (lang) => {
    sidebar_strings.setLanguage(lang);
    navbar_strings.setLanguage(lang);
    data_manager_strings.setLanguage(lang);
    optimization_strings.setLanguage(lang);
    analytics_strings.setLanguage(lang);
    prediction_strings.setLanguage(lang);
    setLanguage(lang);
  };

  useLayoutEffect(() => {
    changeLanguage("gr");
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
