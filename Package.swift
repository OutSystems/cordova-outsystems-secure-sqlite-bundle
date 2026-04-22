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
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master"),
        .package(url: "https://github.com/OutSystems/cordova-plugin-secure-storage.git", branch: "feat/RMET-5136/spm"),
        .package(url: "https://github.com/OutSystems/Cordova-sqlcipher-adapter.git", branch: "feat/RMET-5136/spm")
    ],
    targets: [
        .target(
            name: "SecureSQLiteBundlePlugin",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "cordova-plugin-secure-storage", package: "cordova-plugin-secure-storage"),
                .product(name: "cordova-sqlcipher-adapter", package: "cordova-sqlcipher-adapter")
            ],
            path: "src/ios")
    ]
)
