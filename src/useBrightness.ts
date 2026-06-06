import { useState, useEffect, useCallback, useRef } from 'react';
import { Brightness } from './Brightness';

interface UseBrightnessOptions {
  /** Restore the original brightness when the component unmounts. Default: true */
  restoreOnUnmount?: boolean;
}

interface UseBrightnessResult {
  /** Current app brightness (0–1), null while loading */
  brightness: number | null;
  /** Set app brightness (0–1) */
  setBrightness: (value: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useBrightness(
  { restoreOnUnmount = true }: UseBrightnessOptions = {}
): UseBrightnessResult {
  const [brightness, setBrightnessState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const originalRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    Brightness.getBrightnessAsync()
      .then((value) => {
        if (cancelled) return;
        originalRef.current = value;
        setBrightnessState(value);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (restoreOnUnmount && originalRef.current !== null) {
        Brightness.setBrightnessAsync(originalRef.current).catch(() => {});
      }
    };
  }, [restoreOnUnmount]);

  const setBrightness = useCallback(async (value: number): Promise<void> => {
    await Brightness.setBrightnessAsync(value);
    setBrightnessState(value);
  }, []);

  return { brightness, setBrightness, isLoading, error };
}
