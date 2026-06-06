// Minimal type stub for react-native — covers only what this library uses.
// The full react-native types come from the host app's node_modules at build time.
declare module 'react-native' {
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    select<T extends object>(specifics: T): T[keyof T];
  };

  export interface TurboModule {}

  export const TurboModuleRegistry: {
    get<T extends TurboModule>(name: string): T | null;
    getEnforcing<T extends TurboModule>(name: string): T;
  };
}
