#import "BrightnessManager.h"
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@implementation BrightnessManager

RCT_EXPORT_MODULE(BrightnessManager);

RCT_EXPORT_METHOD(getBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    resolve(@([UIScreen mainScreen].brightness));
  });
}

RCT_EXPORT_METHOD(setBrightness:(nonnull NSNumber *)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    CGFloat brightness = [value floatValue];
    brightness = MAX(0.0, MIN(brightness, 1.0));
    [UIScreen mainScreen].brightness = brightness;
    resolve(nil);
  });
}

// On iOS there is no separate "system" brightness concept — the screen
// brightness IS the system brightness. These methods mirror the app-level
// ones so the JS layer can call them without platform guards.

RCT_EXPORT_METHOD(getSystemBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    resolve(@([UIScreen mainScreen].brightness));
  });
}

RCT_EXPORT_METHOD(setSystemBrightness:(nonnull NSNumber *)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    CGFloat brightness = [value floatValue];
    brightness = MAX(0.0, MIN(brightness, 1.0));
    [UIScreen mainScreen].brightness = brightness;
    resolve(nil);
  });
}

RCT_EXPORT_METHOD(restoreSystemBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  // iOS manages brightness automatically when the app backgrounds.
  // Nothing to restore manually; resolve as a no-op.
  resolve(nil);
}

RCT_EXPORT_METHOD(isUsingSystemBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  // iOS always uses its own managed brightness — no "override" concept.
  resolve(@(NO));
}

RCT_EXPORT_METHOD(getPermissions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  resolve(@{ @"status": @"granted", @"granted": @(YES) });
}

RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  resolve(@{ @"status": @"granted", @"granted": @(YES) });
}

@end
