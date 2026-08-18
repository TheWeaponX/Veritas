import { useEffect, useRef, useState, useCallback } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Dispara `onSave(data)` automaticamente `delayMs` depois da última mudança.
 * Retorna o status e um contador de segundos desde o último save bem-sucedido,
 * para exibir "Salvo automaticamente há Xs".
 */
export function useAutosave<T>(data: T, onSave: (data: T) => Promise<void>, delayMs = 2000) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [secondsAgo, setSecondsAgo] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSavedAt = useRef<number | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setStatus('idle');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setStatus('saving');
      try {
        await onSave(data);
        lastSavedAt.current = Date.now();
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, delayMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSavedAt.current) {
        setSecondsAgo(Math.floor((Date.now() - lastSavedAt.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveNow = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('saving');
    try {
      await onSave(data);
      lastSavedAt.current = Date.now();
      setStatus('saved');
    } catch {
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { status, secondsAgo, saveNow };
}
