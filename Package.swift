// swift-tools-version:5.9
import PackageDescription

// NOTE: Once SPM support is validated and sub-plugins are tagged, replace .branch(...)
// with .exact("new-version-tag") for each dependency.
let package = Package(
    name: "cordova-outsystems-secure-sqlite-bundle",
    products: [
        .library(
            name: "cordova-outsystems-secure-sqlite-bundle",
            targets: ["cordova-outsystems-secure-sqlite-bundle"]
        )
    ],
    dependencies: [
        .package(
            url: "https://github.com/OutSystems/cordova-sqlcipher-adapter.git",
            branch: "feat/RMET-5136/spm"
        ),
        .package(
            url: "https://github.com/OutSystems/cordova-plugin-secure-storage.git",
            branch: "feat/RMET-5136/spm"
        )
    ],
    targets: [
        .target(
            name: "cordova-outsystems-secure-sqlite-bundle",
            dependencies: [
                .product(name: "cordova-sqlcipher-adapter",
                         package: "cordova-sqlcipher-adapter"),
                .product(name: "cordova-plugin-secure-storage",
                         package: "cordova-plugin-secure-storage")
            ],
            path: "src/ios"
        )
    ]
)
