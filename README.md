# react-native-brightness-manager

A simple, reliable React Native library to control **screen brightness** on **Android and iOS** — no system permissions required.

Works consistently across devices, including Android OEMs that restrict system brightness access. Written in **TypeScript** with full type exports.

---

## Features

- App-level brightness control (Android & iOS)
- No `WRITE_SETTINGS` permission required
- `useBrightness()` React hook with auto-restore on unmount
- System brightness APIs for advanced Android use cases
- Full TypeScript support
- OEM-friendly and production tested

---

## Installation

```bash
npm install react-native-brightness-manager
# or
yarn add react-native-brightness-manager
```

**iOS** — link the native module:

```bash
cd ios && pod install
```

---

## Quick Start

### Hook (recommended)

The `useBrightness` hook is the simplest way to use this library. It reads the current brightness on mount and **automatically restores it when the component unmounts**.

```tsx
import { useBrightness } from 'react-native-brightness-manager';

function ScanScreen() {
  const { brightness, setBrightness, isLoading } = useBrightness();

  if (isLoading) return null;

  return (
    <Slider
      value={brightness ?? 0.5}
      onValueChange={setBrightness}
      minimumValue={0}
      maximumValue={1}
    />
  );
}
```

To opt out of auto-restore:

```tsx
const { brightness, setBrightness } = useBrightness({ restoreOnUnmount: false });
```

---

### Imperative API

```ts
import { Brightness } from 'react-native-brightness-manager';

// Read current brightness
const value = await Brightness.getBrightnessAsync(); // 0–1

// Set brightness
await Brightness.setBrightnessAsync(0.9);

// Restore to system default
await Brightness.restoreSystemBrightnessAsync();
```

---

## API Reference

### `useBrightness(options?)`

A React hook for managing app brightness.

```ts
const { brightness, setBrightness, isLoading, error } = useBrightness(options);
```

| Option | Type | Default | Description |
|---|---|---|---|
| `restoreOnUnmount` | `boolean` | `true` | Restore original brightness when the component unmounts |

| Return value | Type | Description |
|---|---|---|
| `brightness` | `number \| null` | Current app brightness (0–1), `null` while loading |
| `setBrightness` | `(value: number) => Promise<void>` | Set brightness and update state |
| `isLoading` | `boolean` | `true` until the initial brightness is read |
| `error` | `Error \| null` | Set if the native read fails |

---

### `Brightness.isAvailableAsync()`

Returns `true` if the native module is linked and available.

```ts
const available = await Brightness.isAvailableAsync(); // boolean
```

---

### `Brightness.getBrightnessAsync()`

Returns the current app-level brightness as a number between `0` and `1`.

```ts
const value = await Brightness.getBrightnessAsync(); // number
```

---

### `Brightness.setBrightnessAsync(value)`

Sets the app-level brightness. Throws if `value` is not between `0` and `1`.

```ts
await Brightness.setBrightnessAsync(0.8);
```

---

### `Brightness.restoreSystemBrightnessAsync()`

Restores brightness to the system default.

- **Android** — resets the window brightness override so the OS takes over again
- **iOS** — no-op; iOS restores brightness automatically when the app backgrounds

```ts
await Brightness.restoreSystemBrightnessAsync();
```

---

### `Brightness.getSystemBrightnessAsync()`

Returns the system-level brightness.

- **Android** — reads `Settings.System.SCREEN_BRIGHTNESS` (0–1)
- **iOS** — returns the current screen brightness (same as `getBrightnessAsync`)

```ts
const value = await Brightness.getSystemBrightnessAsync(); // number
```

---

### `Brightness.setSystemBrightnessAsync(value)`

Sets system-level brightness. Requires `WRITE_SETTINGS` permission on Android (see [Permissions](#permissions-android-only)).

- **iOS** — same as `setBrightnessAsync`

```ts
await Brightness.setSystemBrightnessAsync(0.5);
```

---

### `Brightness.isUsingSystemBrightnessAsync()`

Returns `true` if the app is currently using the system brightness (i.e. no override is active).

- **Android** — checks the window brightness attribute
- **iOS** — always returns `false`

```ts
const usingSystem = await Brightness.isUsingSystemBrightnessAsync(); // boolean
```

---

### `Brightness.getPermissionsAsync()`

Returns the current `WRITE_SETTINGS` permission status.

```ts
const { granted, status } = await Brightness.getPermissionsAsync();
// { granted: boolean, status: 'granted' | 'denied', canAskAgain: boolean, expires: 'never' }
```

- **iOS** — always returns `granted: true`

---

### `Brightness.requestPermissionsAsync()`

Opens the Android system settings screen so the user can grant `WRITE_SETTINGS`. Returns permission status after the intent is sent.

- **iOS** — always returns `granted: true`

```ts
const { granted } = await Brightness.requestPermissionsAsync();
```

---

## Permissions (Android only)

**App-level brightness** (`getBrightnessAsync` / `setBrightnessAsync` / `restoreSystemBrightnessAsync`) requires **no permissions**.

**System brightness** (`getSystemBrightnessAsync` / `setSystemBrightnessAsync`) requires the `WRITE_SETTINGS` permission. Use the permissions API to check and request it:

```ts
import { Brightness } from 'react-native-brightness-manager';

const { granted } = await Brightness.getPermissionsAsync();
if (!granted) {
  await Brightness.requestPermissionsAsync();
  // User is taken to system settings — re-check on app resume
}
```

---

## Platform Behavior

### Android

- App-level brightness is set via `WindowManager.LayoutParams.screenBrightness`
- The OS automatically restores brightness when the app goes to background
- System brightness changes require `WRITE_SETTINGS` and are not applied on OEM-restricted devices
- Calling `restoreSystemBrightnessAsync()` is always safe (no permission needed)

### iOS

- Brightness is controlled via `[UIScreen mainScreen].brightness`
- iOS restores brightness automatically when the app backgrounds
- No permissions required for any operation
- There is no separate "system brightness" concept — all brightness APIs map to the screen brightness

---

## TypeScript

All methods and the hook are fully typed. Exported types:

```ts
import type {
  PermissionResponse,
  PermissionStatusValue,
  BrightnessModeValue,
} from 'react-native-brightness-manager';
```

| Type | Values |
|---|---|
| `PermissionStatusValue` | `'granted'` \| `'denied'` |
| `BrightnessModeValue` | `0` (UNKNOWN) \| `1` (AUTOMATIC) \| `2` (MANUAL) |

---

## License

MIT — [Ajay Raj Tiwari](https://github.com/ajayrajtiwari)
