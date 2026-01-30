package com.brightnessmanager

import android.provider.Settings
import android.view.WindowManager
import com.facebook.react.bridge.*

class BrightnessManagerModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "BrightnessManager"

  // App-level brightness
  @ReactMethod
  fun getBrightness(promise: Promise) {
    val activity = currentActivity ?: return
    promise.resolve(activity.window.attributes.screenBrightness)
  }

  @ReactMethod
  fun setBrightness(value: Double, promise: Promise) {
    val activity = currentActivity ?: return
    val params = activity.window.attributes
    params.screenBrightness = value.coerceIn(0.0, 1.0).toFloat()
    activity.window.attributes = params
    promise.resolve(null)
  }

  // Permissions
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
    intent.data = android.net.Uri.parse("package:" + reactContext.packageName)
    intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
    reactContext.startActivity(intent)
    promise.resolve(null)
  }

  // System brightness
  @ReactMethod
  fun getSystemBrightness(promise: Promise) {
    val brightness = Settings.System.getInt(
      reactContext.contentResolver,
      Settings.System.SCREEN_BRIGHTNESS
    )
    promise.resolve(brightness / 255.0)
  }

  @ReactMethod
  fun setSystemBrightness(value: Double, promise: Promise) {
    Settings.System.putInt(
      reactContext.contentResolver,
      Settings.System.SCREEN_BRIGHTNESS,
      (value.coerceIn(0.0, 1.0) * 255).toInt()
    )
    promise.resolve(null)
  }

  @ReactMethod
  fun restoreSystemBrightness(promise: Promise) {
    val activity = currentActivity ?: return
    val params = activity.window.attributes
    params.screenBrightness =
      WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
    activity.window.attributes = params
    promise.resolve(null)
  }

  @ReactMethod
  fun isUsingSystemBrightness(promise: Promise) {
    val activity = currentActivity ?: return
    promise.resolve(
      activity.window.attributes.screenBrightness ==
        WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
    )
  }
}
