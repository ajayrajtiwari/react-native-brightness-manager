import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface PermissionResult {
  status: 'granted' | 'denied';
  granted: boolean;
}

export interface Spec extends TurboModule {
  getBrightness(): Promise<number>;
  setBrightness(value: number): Promise<void>;
  getPermissions(): Promise<PermissionResult>;
  requestPermissions(): Promise<void>;
  getSystemBrightness(): Promise<number>;
  setSystemBrightness(value: number): Promise<void>;
  restoreSystemBrightness(): Promise<void>;
  isUsingSystemBrightness(): Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('BrightnessManager');
