export const PermissionStatus = {
  GRANTED: 'granted',
  DENIED: 'denied',
} as const;

export type PermissionStatusValue =
  (typeof PermissionStatus)[keyof typeof PermissionStatus];

export const BrightnessMode = {
  UNKNOWN: 0,
  AUTOMATIC: 1,
  MANUAL: 2,
} as const;

export type BrightnessModeValue =
  (typeof BrightnessMode)[keyof typeof BrightnessMode];
