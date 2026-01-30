require "json"

package = JSON.parse(
  File.read(File.join(__dir__, "package.json"))
)

Pod::Spec.new do |s|
  s.name         = "BrightnessManager"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.author       = package["author"]

  s.platforms    = { :ios => "12.0" }

  s.source       = {
    :git => "https://github.com/ajayrajtiwari/react-native-brightness-manager.git",
    :tag => s.version.to_s
  }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true

  s.dependency "React-Core"
end
