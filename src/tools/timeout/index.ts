export function waitUntil(isReady: () => boolean, delay: number) {
  return new Promise<void>((resolve) => {
    if (isReady()) return resolve();
    (function wait() {
      setTimeout(() => {
        if (isReady()) resolve();
        else wait();
      }, delay);
    })();
  });
}

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
