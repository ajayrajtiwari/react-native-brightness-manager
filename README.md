````md
# react-native-brightness-manager

A lightweight, native brightness manager for React Native — **no Expo, no external dependencies**.

Supports:
-  App-level brightness on **iOS**
-  App-level + **system brightness on Android**
-  Expo-like API
-  JavaScript-first API
-  Safe & App Store friendly

---

##  Features

-  Get current screen brightness
-  Increase / decrease brightness programmatically
-  Control **system brightness on Android**
-  App-level brightness on iOS (Apple-safe)
-  Permission handling on Android
-  Clean, minimal API
-  Ready for production

---

##  Installation

```sh
yarn add react-native-brightness-manager
````

or

```sh
npm install react-native-brightness-manager
```

### iOS

```sh
cd ios && pod install
```

---

##  Android Permissions

Add this permission to your **AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.WRITE_SETTINGS" />
```

> Required only for **system brightness** on Android.

---

##  Usage

```js
import { Brightness } from 'react-native-brightness-manager';
```

---

##  Get Current Brightness

```js
const current = await Brightness.getBrightnessAsync();
console.log(current); // 0.0 → 1.0
```

---

##  Increase / Decrease Brightness (App Level)

```js
// Max brightness
await Brightness.setBrightnessAsync(1);

// Dim screen
await Brightness.setBrightnessAsync(0.3);
```

---

##  Android: System Brightness

### Request Permission

```js
const { status } = await Brightness.requestPermissionsAsync();

if (status === 'granted') {
  await Brightness.setSystemBrightnessAsync(1);
}
```

### Get System Brightness

```js
const systemLevel = await Brightness.getSystemBrightnessAsync();
```

### Restore System Brightness

```js
await Brightness.restoreSystemBrightnessAsync();
```

---

##  iOS Behavior (Important)

Apple **does not allow apps to change global system brightness**.

On iOS:

*  Brightness changes are **app-level**
*  System brightness cannot be changed
*  Brightness resets when app goes background or device locks

This library **automatically handles fallbacks** on iOS.

---

## 📱 Platform Support

| Feature               | iOS | Android |
| --------------------- | --- | ------- |
| Get brightness        | ✅   | ✅       |
| Set app brightness    | ✅   | ✅       |
| Get system brightness | ❌   | ✅       |
| Set system brightness | ❌   | ✅       |
| Permissions required  | ❌   | ✅       |

---

##  Best Practice (Recommended)

Always restore brightness when leaving a screen:

```js
import { useEffect } from 'react';
import { Brightness } from 'react-native-brightness-manager';

export function useMaxBrightness() {
  useEffect(() => {
    let original;

    (async () => {
      original = await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(1);
    })();

    return () => {
      if (original !== undefined) {
        Brightness.setBrightnessAsync(original);
      }
    };
  }, []);
}
```

---

##  Notes & Limitations

* Brightness values must be between **0 and 1**
* Android system brightness requires user permission
* iOS brightness changes are temporary and app-only
* Avoid forcing brightness without user context (UX & policy)

---

##  Example App

This repository includes an **example app** to test all features:

```sh
cd example
yarn android
# or
yarn ios
```

---

##  Tech Stack

* React Native Community CLI
* Native Modules (Swift + Kotlin)
* JavaScript public API
* No Expo
* No external brightness libraries

---

##  Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

##  License

MIT © Ajay Raj Tiwari

---

##  Support

If this library helped you, please  the repo on GitHub
It really helps the project grow 

```
