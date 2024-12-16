import debug from 'debug';

export const createDebug = (namespace: string): debug.Debugger => {
  const logger = debug(`app:${namespace}`);
  
  if (typeof window !== 'undefined') {
    // Enable debug in browser if needed
    debug.enable('app:*');
  }
  
  return logger;
};

export const authDebug = createDebug('auth');
export const routeDebug = createDebug('route');
export const navDebug = createDebug('nav');
