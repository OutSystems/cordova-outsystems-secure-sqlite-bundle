// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "com.outsystems.plugins.SecureSQLiteBundle",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "com.outsystems.plugins.SecureSQLiteBundle",
            targets: ["SecureSQLiteBundlePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master")
    ],
    targets: [
        .target(
            name: "SecureSQLiteBundlePlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios")
            ],
            path: "src/ios")
    ]
)
