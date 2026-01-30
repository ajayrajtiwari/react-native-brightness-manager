package com.brightnessmanager

import com.facebook.react.bridge.ReactApplicationContext

class BrightnessManagerModule(reactContext: ReactApplicationContext) :
  NativeBrightnessManagerSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeBrightnessManagerSpec.NAME
  }
}
