import debug from 'debug';

export const createDebug = (namespace: string) => {
  const logger = debug(`app:${namespace}`);
  debug.enable('app:*');
  return logger;
};

export const authDebug = createDebug('auth');
export const routeDebug = createDebug('route');
export const navDebug = createDebug('nav');
