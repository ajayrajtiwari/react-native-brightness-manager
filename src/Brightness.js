import { NativeModules, Platform } from 'react-native';
import { validateBrightness } from './validators';
import { PermissionStatus } from './constants';

const NativeBrightness = NativeModules.BrightnessManager;

/**
 * Internal helper
 */
function ensureNative() {
  if (!NativeBrightness) {
    throw new Error(
      '[react-native-brightness-manager] Native module is not linked. ' +
      'Did you run pod install / rebuild the app?'
    );
  }
}

function grantedPermission() {
  return {
    status: PermissionStatus.GRANTED,
    granted: true,
    canAskAgain: true,
    expires: 'never',
  };
}

export const Brightness = {
  /* ---------- availability ---------- */

  async isAvailableAsync() {
    return !!NativeBrightness;
  },

  /* ---------- app brightness ---------- */

  async getBrightnessAsync() {
    ensureNative();
    return NativeBrightness.getBrightness();
  },

  async setBrightnessAsync(value) {
    validateBrightness(value);
    ensureNative();
    return NativeBrightness.setBrightness(value);
  },

  /* ---------- permissions ---------- */

  async getPermissionsAsync() {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    ensureNative();
    return NativeBrightness.getPermissions();
  },

  async requestPermissionsAsync() {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    ensureNative();
    return NativeBrightness.requestPermissions();
  },

  /* ---------- system brightness (Android only) ---------- */

  async getSystemBrightnessAsync() {
    ensureNative();
    if (Platform.OS === 'android') {
      return NativeBrightness.getSystemBrightness();
    }
    return this.getBrightnessAsync();
  },

  async setSystemBrightnessAsync(value) {
    validateBrightness(value);
    ensureNative();
    if (Platform.OS === 'android') {
      return NativeBrightness.setSystemBrightness(value);
    }
  },

  async restoreSystemBrightnessAsync() {
    ensureNative();
    if (Platform.OS === 'android') {
      return NativeBrightness.restoreSystemBrightness();
    }
  },

  async isUsingSystemBrightnessAsync() {
    ensureNative();
    if (Platform.OS === 'android') {
      return NativeBrightness.isUsingSystemBrightness();
    }
    return false;
  },
};
