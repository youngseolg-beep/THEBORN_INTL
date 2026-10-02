import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  homeV2ContentByLocale,
  type HomeV2Content,
  type HomeV2Locale,
} from "../../data/homeV2Content";

const localeStorageKey = "home-v2-locale";

type HomeV2LocaleContextValue = {
  locale: HomeV2Locale;
  content: HomeV2Content;
  setLocale: (locale: HomeV2Locale) => void;
  toggleLocale: () => void;
};

const HomeV2LocaleContext = createContext<HomeV2LocaleContextValue | null>(null);

function getInitialLocale(): HomeV2Locale {
  if (typeof window === "undefined") return "en";

  try {
    return window.localStorage.getItem(localeStorageKey) === "ko" ? "ko" : "en";
  } catch {
    return "en";
  }
}

export function HomeV2LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<HomeV2Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;

    try {
      window.localStorage.setItem(localeStorageKey, locale);
    } catch {
      // The active locale still works when storage is unavailable.
    }
  }, [locale]);

  const value = useMemo<HomeV2LocaleContextValue>(() => ({
    locale,
    content: homeV2ContentByLocale[locale],
    setLocale,
    toggleLocale: () => setLocale((current) => (current === "en" ? "ko" : "en")),
  }), [locale]);

  return (
    <HomeV2LocaleContext.Provider value={value}>
      {children}
    </HomeV2LocaleContext.Provider>
  );
}

export function useHomeV2Locale() {
  const context = useContext(HomeV2LocaleContext);
  if (!context) {
    throw new Error("useHomeV2Locale must be used within HomeV2LocaleProvider");
  }
  return context;
}
