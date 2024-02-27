export function debounce<T extends any[]>(callback: (...args: T) => void, delay: number = 300, callbackEachTime?: (...args: T) => void) {
  let timeout = 0;

  return (...args: T) => {
    callbackEachTime?.(...args);
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
