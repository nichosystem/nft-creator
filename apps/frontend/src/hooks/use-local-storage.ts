import { useState, useEffect, SetStateAction, Dispatch } from "react";

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  const getStorageValue = <T>(key: string, defaultValue: T): T => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      return JSON.parse(saved!) || defaultValue;
    } else return defaultValue;
  };

  useEffect(() => {
    if (isInitialized) localStorage.setItem(key, JSON.stringify(value));
    else {
      setValue(getStorageValue(key, defaultValue));
      setIsInitialized(true);
    }
  }, [key, value, defaultValue, isInitialized]);

  return [value, setValue];
};
