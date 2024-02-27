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
