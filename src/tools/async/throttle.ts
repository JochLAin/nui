export function throttle<T extends any[]>(callback: (...args: T) => void, delay: number = 300, callbackEachTime?: (...args: T) => void) {
  let timeout = 0;

  return (...args: T) => {
    callbackEachTime?.(...args);
    if (timeout) return;
    callback(...args);
    timeout = window.setTimeout(() => {
      timeout = 0;
    }, delay);
  };
}
