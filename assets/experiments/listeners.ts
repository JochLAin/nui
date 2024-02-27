type Listeners = {
  connect: () => void;
  change: (name: string, value: string, previous: string) => void;
  disconnect: () => void;
};

type Listener<K extends keyof Listeners> = (...args: Parameters<Listeners[K]>) => ReturnType<Listeners[K]>;

function listen<K extends keyof Listeners>(listeners: Listeners, type: K, ...args: Parameters<Listener<K>>) {
  (listeners[type] as Listener<K>).call(null, ...args);
}
