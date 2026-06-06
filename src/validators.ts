export function validateBrightness(value: number): void {
  if (typeof value !== 'number' || value < 0 || value > 1) {
    throw new Error('[Brightness] value must be a number between 0 and 1');
  }
}
