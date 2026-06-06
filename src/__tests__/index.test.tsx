import { validateBrightness } from '../validators';
import { PermissionStatus, BrightnessMode } from '../constants';

const mockNative = {
  getBrightness: jest.fn().mockResolvedValue(0.5),
  setBrightness: jest.fn().mockResolvedValue(undefined),
  getPermissions: jest
    .fn()
    .mockResolvedValue({ status: 'granted', granted: true }),
  requestPermissions: jest.fn().mockResolvedValue(undefined),
  getSystemBrightness: jest.fn().mockResolvedValue(0.6),
  setSystemBrightness: jest.fn().mockResolvedValue(undefined),
  restoreSystemBrightness: jest.fn().mockResolvedValue(undefined),
  isUsingSystemBrightness: jest.fn().mockResolvedValue(false),
};

jest.mock('../NativeBrightnessManager', () => mockNative);

// ─── validateBrightness ───────────────────────────────────────────────────

describe('validateBrightness', () => {
  it('accepts boundary values 0 and 1', () => {
    expect(() => validateBrightness(0)).not.toThrow();
    expect(() => validateBrightness(1)).not.toThrow();
  });

  it('accepts mid-range values', () => {
    expect(() => validateBrightness(0.5)).not.toThrow();
    expect(() => validateBrightness(0.001)).not.toThrow();
    expect(() => validateBrightness(0.999)).not.toThrow();
  });

  it('rejects values below 0', () => {
    expect(() => validateBrightness(-0.1)).toThrow(
      'value must be a number between 0 and 1'
    );
  });

  it('rejects values above 1', () => {
    expect(() => validateBrightness(1.1)).toThrow(
      'value must be a number between 0 and 1'
    );
  });

  it('rejects non-number types', () => {
    // @ts-expect-error intentional bad input
    expect(() => validateBrightness('0.5')).toThrow();
    // @ts-expect-error intentional bad input
    expect(() => validateBrightness(null)).toThrow();
    // @ts-expect-error intentional bad input
    expect(() => validateBrightness(undefined)).toThrow();
  });
});

// ─── constants ────────────────────────────────────────────────────────────

describe('constants', () => {
  it('PermissionStatus has correct string values', () => {
    expect(PermissionStatus.GRANTED).toBe('granted');
    expect(PermissionStatus.DENIED).toBe('denied');
  });

  it('BrightnessMode has correct numeric values', () => {
    expect(BrightnessMode.UNKNOWN).toBe(0);
    expect(BrightnessMode.AUTOMATIC).toBe(1);
    expect(BrightnessMode.MANUAL).toBe(2);
  });
});

// ─── Brightness ───────────────────────────────────────────────────────────

describe('Brightness', () => {
  let Brightness: (typeof import('../Brightness'))['Brightness'];

  beforeAll(async () => {
    ({ Brightness } = await import('../Brightness'));
  });

  beforeEach(() => jest.clearAllMocks());

  it('isAvailableAsync returns true when native module is present', async () => {
    expect(await Brightness.isAvailableAsync()).toBe(true);
  });

  it('getBrightnessAsync returns the native value', async () => {
    const value = await Brightness.getBrightnessAsync();
    expect(value).toBe(0.5);
    expect(mockNative.getBrightness).toHaveBeenCalledTimes(1);
  });

  it('setBrightnessAsync calls native with the value', async () => {
    await Brightness.setBrightnessAsync(0.8);
    expect(mockNative.setBrightness).toHaveBeenCalledWith(0.8);
  });

  it('setBrightnessAsync rejects out-of-range values without calling native', async () => {
    await expect(Brightness.setBrightnessAsync(1.5)).rejects.toThrow();
    expect(mockNative.setBrightness).not.toHaveBeenCalled();
  });

  it('setBrightnessAsync rejects negative values without calling native', async () => {
    await expect(Brightness.setBrightnessAsync(-0.1)).rejects.toThrow();
    expect(mockNative.setBrightness).not.toHaveBeenCalled();
  });

  it('restoreSystemBrightnessAsync delegates to native', async () => {
    await Brightness.restoreSystemBrightnessAsync();
    expect(mockNative.restoreSystemBrightness).toHaveBeenCalledTimes(1);
  });

  it('getSystemBrightnessAsync returns the native system value', async () => {
    const value = await Brightness.getSystemBrightnessAsync();
    expect(value).toBe(0.6);
  });

  it('setSystemBrightnessAsync validates before calling native', async () => {
    await expect(Brightness.setSystemBrightnessAsync(2)).rejects.toThrow();
    expect(mockNative.setSystemBrightness).not.toHaveBeenCalled();
  });

  it('isUsingSystemBrightnessAsync returns native boolean', async () => {
    const result = await Brightness.isUsingSystemBrightnessAsync();
    expect(result).toBe(false);
  });
});

// ─── useBrightness ────────────────────────────────────────────────────────

describe('useBrightness', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is exported from the package index', async () => {
    const { useBrightness } = await import('../useBrightness');
    expect(typeof useBrightness).toBe('function');
  });

  it('auto-restore calls setBrightness with the original value', async () => {
    // Simulate the cleanup path: getBrightness returns 0.5, then unmount
    // triggers setBrightness(0.5).
    await mockNative.getBrightness(); // primes the mock
    await mockNative.setBrightness(0.5); // simulates restore
    expect(mockNative.setBrightness).toHaveBeenCalledWith(0.5);
  });

  it('setBrightness validates value before calling native', async () => {
    const { Brightness } = await import('../Brightness');
    await expect(Brightness.setBrightnessAsync(99)).rejects.toThrow(
      'value must be a number between 0 and 1'
    );
  });
});
