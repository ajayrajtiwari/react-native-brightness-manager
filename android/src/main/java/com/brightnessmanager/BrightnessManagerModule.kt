package com.brightnessmanager

import android.provider.Settings
import android.view.WindowManager
import com.facebook.react.bridge.*

class BrightnessManagerModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "BrightnessManager"

  /* ---------------- APP LEVEL BRIGHTNESS ---------------- */

  @ReactMethod
  fun getBrightness(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    activity.runOnUiThread {
      try {
        promise.resolve(activity.window.attributes.screenBrightness)
      } catch (e: Exception) {
        promise.reject("GET_BRIGHTNESS_ERROR", e)
      }
    }
  }

  @ReactMethod
  fun setBrightness(value: Double, promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    activity.runOnUiThread {
      try {
        val params = activity.window.attributes
        params.screenBrightness = value.coerceIn(0.0, 1.0).toFloat()
        activity.window.attributes = params
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("SET_BRIGHTNESS_ERROR", e)
      }
    }
  }

  /* ---------------- PERMISSIONS ---------------- */

  @ReactMethod
  fun getPermissions(promise: Promise) {
    val granted = Settings.System.canWrite(reactContext)
    val result = Arguments.createMap()
    result.putString("status", if (granted) "granted" else "denied")
    result.putBoolean("granted", granted)
    promise.resolve(result)
  }

  @ReactMethod
  fun requestPermissions(promise: Promise) {
    val intent = android.content.Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS)
    intent.data = android.net.Uri.parse("package:${reactContext.packageName}")
    intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
    reactContext.startActivity(intent)
    promise.resolve(null)
  }

  /* ---------------- SYSTEM BRIGHTNESS ---------------- */

  @ReactMethod
  fun getSystemBrightness(promise: Promise) {
    try {
      val brightness = Settings.System.getInt(
        reactContext.contentResolver,
        Settings.System.SCREEN_BRIGHTNESS
      )
      promise.resolve(brightness / 255.0)
    } catch (e: Exception) {
      promise.reject("GET_SYSTEM_BRIGHTNESS_ERROR", e)
    }
  }

  @ReactMethod
  fun setSystemBrightness(value: Double, promise: Promise) {
    try {
      Settings.System.putInt(
        reactContext.contentResolver,
        Settings.System.SCREEN_BRIGHTNESS,
        (value.coerceIn(0.0, 1.0) * 255).toInt()
      )
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("SET_SYSTEM_BRIGHTNESS_ERROR", e)
    }
  }

  @ReactMethod
  fun restoreSystemBrightness(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    activity.runOnUiThread {
      try {
        val params = activity.window.attributes
        params.screenBrightness =
          WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
        activity.window.attributes = params
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("RESTORE_SYSTEM_BRIGHTNESS_ERROR", e)
      }
    }
  }

  @ReactMethod
  fun isUsingSystemBrightness(promise: Promise) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    activity.runOnUiThread {
      try {
        promise.resolve(
          activity.window.attributes.screenBrightness ==
            WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
        )
      } catch (e: Exception) {
        promise.reject("CHECK_SYSTEM_BRIGHTNESS_ERROR", e)
      }
    }
  }
}
