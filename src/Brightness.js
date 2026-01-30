import { NativeModules, Platform } from 'react-native';
import { validateBrightness } from './validators';
import { PermissionStatus } from './constants';

const Native = NativeModules.BrightnessManager;

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
    return Platform.OS === 'ios' || Platform.OS === 'android';
  },

  /* ---------- app brightness ---------- */

  async getBrightnessAsync() {
    return Native.getBrightness();
  },

  async setBrightnessAsync(value) {
    validateBrightness(value);
    return Native.setBrightness(value);
  },

  /* ---------- permissions ---------- */

  async getPermissionsAsync() {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    return Native.getPermissions();
  },

  async requestPermissionsAsync() {
    if (Platform.OS === 'ios') {
      return grantedPermission();
    }
    return Native.requestPermissions();
  },

  /* ---------- system brightness (Android only) ---------- */

  async getSystemBrightnessAsync() {
    if (Platform.OS === 'android') {
      return Native.getSystemBrightness();
    }
    return this.getBrightnessAsync();
  },

  async setSystemBrightnessAsync(value) {
    validateBrightness(value);
    if (Platform.OS === 'android') {
      return Native.setSystemBrightness(value);
    }
  },

  async restoreSystemBrightnessAsync() {
    if (Platform.OS === 'android') {
      return Native.restoreSystemBrightness();
    }
  },

  async isUsingSystemBrightnessAsync() {
    if (Platform.OS === 'android') {
      return Native.isUsingSystemBrightness();
    }
    return false;
  },
};
