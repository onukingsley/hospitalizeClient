import { useState, useCallback } from 'react';
import { storage } from '@/lib/dataStore';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState<T>(() => storage.get(key, initialValue));

  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      storage.set(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [value, setStoredValue] ;
}
