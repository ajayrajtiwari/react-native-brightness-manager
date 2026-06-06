import { Platform } from 'react-native';
import { validateBrightness } from './validators';
import { PermissionStatus, type PermissionStatusValue } from './constants';
import NativeBrightnessManager from './NativeBrightnessManager';

export interface PermissionResponse {
  status: PermissionStatusValue;
  granted: boolean;
  canAskAgain: boolean;
  expires: 'never';
}

function getNative() {
  if (NativeBrightnessManager == null) {
    throw new Error(
      '[react-native-brightness-manager] Native module is not linked. ' +
        'Did you run pod install / rebuild the app?'
    );
  }
  return NativeBrightnessManager;
}

function grantedPermission(): PermissionResponse {
  return {
    status: PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
  };
}

export const Brightness = {
  async isAvailableAsync(): Promise<boolean> {
    return NativeBrightnessManager != null;
  },

  async getBrightnessAsync(): Promise<number> {
    return getNative().getBrightness();
  },

  async setBrightnessAsync(value: number): Promise<void> {
    validateBrightness(value);
    return getNative().setBrightness(value);
  },

  async getPermissionsAsync(): Promise<PermissionResponse> {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    const result = await getNative().getPermissions();
    return { ...result, canAskAgain: true, expires: 'never' };
  },

  async requestPermissionsAsync(): Promise<PermissionResponse> {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    await getNative().requestPermissions();
    const result = await getNative().getPermissions();
    return { ...result, canAskAgain: true, expires: 'never' };
  },

  async getSystemBrightnessAsync(): Promise<number> {
    if (Platform.OS === 'android') {
      return getNative().getSystemBrightness();
    }
    return getNative().getBrightness();
  },

  async setSystemBrightnessAsync(value: number): Promise<void> {
    validateBrightness(value);
    return getNative().setSystemBrightness(value);
  },

  async restoreSystemBrightnessAsync(): Promise<void> {
    return getNative().restoreSystemBrightness();
  },

  async isUsingSystemBrightnessAsync(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return getNative().isUsingSystemBrightness();
    }
    return false;
  },
};
