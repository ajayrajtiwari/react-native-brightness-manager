#import "BrightnessManager.h"
#import <UIKit/UIKit.h>

@implementation BrightnessManager

RCT_EXPORT_MODULE();

#pragma mark - Get Brightness

RCT_EXPORT_METHOD(getBrightness:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    resolve(@([UIScreen mainScreen].brightness));
  });
}

#pragma mark - Set Brightness (App-level)

RCT_EXPORT_METHOD(setBrightness:(nonnull NSNumber *)value
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    CGFloat brightness = [value floatValue];

    // Clamp value between 0 and 1
    brightness = MAX(0.0, MIN(brightness, 1.0));

    [UIScreen mainScreen].brightness = brightness;
    resolve(nil);
  });
}

@end
