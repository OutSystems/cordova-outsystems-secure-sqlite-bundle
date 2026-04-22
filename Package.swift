// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "com.outsystems.plugins.SecureSQLiteBundle",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "com.outsystems.plugins.SecureSQLiteBundle",
            targets: ["com.outsystems.plugins.SecureSQLiteBundle"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master")
    ],
    targets: [
        .target(
            name: "com.outsystems.plugins.SecureSQLiteBundle",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios")
            ],
            path: "src/ios")
    ]
)
