
---

# 📱 react-native-brightness-manager

A simple, reliable React Native library to control **app-level screen brightness** on **Android and iOS**, without requiring any system permissions.

This library is designed to work consistently across devices, including Android OEMs that restrict system brightness access.

---

##  Features

* ✅ App-level brightness control
* ✅ Works on Android & iOS
* ✅ No `WRITE_SETTINGS` permission required
* ✅ No system settings modification
* ✅ Safe brightness restore
* ✅ OEM-friendly and production tested

---

##  Installation

```bash
npm install react-native-brightness-manager
yarn add react-native-brightness-manager
```

For iOS:

```bash
cd ios && pod install
```

---

##  Basic Usage

### Increase brightness when a screen opens and restore on exit

```js
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Brightness } from 'react-native-brightness-manager';

const originalBrightnessRef = useRef(null);
const brightnessAppliedRef = useRef(false);

useEffect(() => {
  let timeoutId;
  let isMounted = true;

  const applyBrightness = async () => {
    try {
      const current = await Brightness.getBrightnessAsync();
      originalBrightnessRef.current = current;
      brightnessAppliedRef.current = false;

      timeoutId = setTimeout(async () => {
        if (!isMounted) return;

        try {
          await Brightness.setBrightnessAsync(0.99);
          brightnessAppliedRef.current = true;
        } catch (e) {}
      }, 250);
    } catch (e) {}
  };

  applyBrightness();

  return () => {
    isMounted = false;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const restoreBrightness = async () => {
      try {
        const original = originalBrightnessRef.current;

        if (Platform.OS === 'ios' && typeof original === 'number') {
          await Brightness.setBrightnessAsync(original);
        } else {
          // Safe to call on Android (no-op)
          await Brightness.restoreSystemBrightnessAsync();
        }

        originalBrightnessRef.current = null;
        brightnessAppliedRef.current = false;
      } catch (e) {}
    };

    restoreBrightness();
  };
}, []);
```

---

##  Android Behavior (Important)

Many Android devices **do not allow apps to change system brightness** due to OS and OEM restrictions.

Because of this, this library:

* ❌ Does **not** modify system brightness
* ❌ Does **not** request `WRITE_SETTINGS`
* ❌ Does **not** redirect users to system settings

Instead, it uses **app-level brightness**, which:

* ✅ Works reliably on all Android devices
* ✅ Behaves similar to iOS brightness handling
* ✅ Automatically restores when the app goes to background
* ✅ Fully satisfies the requirement of increasing brightness

Calling `restoreSystemBrightnessAsync()` on Android is **safe** and does **not require any permission**.

---

##  iOS Behavior

* Brightness is controlled at app level
* You should manually restore brightness when leaving a screen
* No additional permissions required

---

##  Why App-Level Brightness?

* Consistent behavior across devices
* No permission denials
* No OEM-specific crashes
* Better user experience
* Play Store safe

---

##  API Reference

### `Brightness.isAvailableAsync()`

Checks whether the native module is available.

---

### `Brightness.getBrightnessAsync()`

Returns the current app-level brightness.

---

### `Brightness.setBrightnessAsync(value)`

Sets the app-level brightness.

* `value` must be between `0` and `1`

---

### `Brightness.restoreSystemBrightnessAsync()`

Safely restores brightness.

* **iOS**: Should be used to restore previous brightness
* **Android**: Safe no-op (OS restores automatically)

---

## ⚠️ Deprecated / Compatibility APIs

The following APIs exist **only for backward compatibility** and **do not modify system settings**:

* `getSystemBrightnessAsync`
* `setSystemBrightnessAsync`
* `getPermissionsAsync`
* `requestPermissionsAsync`
* `isUsingSystemBrightnessAsync`

They are internally mapped to app-level behavior or safely ignored.

---

## 🧾 Summary

* Android & iOS handled consistently
* App-level brightness only
* No system permissions
* Safe restore support
* Designed for real-world production apps

---

## 📄 License

MIT

---

