import { useEffect, useState } from 'react';

export const UseDebounce = <T>(value: T, delay?: number): T => {
const [debouncedValue, setDebouncedValue] = useState<T>(value);

useEffect(() => {
  const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

  return () => clearTimeout(timer);
}, [delay, value]);
return debouncedValue;
};