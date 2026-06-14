/**
 * Production-safe logging utility.
 * In development, it falls back to the native console.
 * In production, it completely suppresses logs to prevent memory leaks and performance degradation.
 */

export const Logger = {
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (__DEV__) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (__DEV__) {
      console.warn(...args);
    }
  },
};
