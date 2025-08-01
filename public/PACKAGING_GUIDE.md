# Application Packaging Guide

This document explains how the PrimeZone Advanced Panorama Viewer application is packaged for distribution, covering both packaged and unpacked versions, including the internal Node.js runtime, file structure, and dependencies.

## Overview

The application uses **Electron Builder** to create distributable packages that include:
- The Electron application wrapper
- A bundled Node.js runtime (v18.19.0)
- Next.js standalone build
- All necessary dependencies and assets
- Application resources and configuration files

## Packaging Process

### 1. Build Scripts

The application provides several packaging commands in `package.json`:

```json
{
  "desktop:build": "npm run build:standalone && electron-builder --config=config/electron-builder.json",
  "desktop:build:unpacked": "npm run build:standalone && electron-builder --config=config/electron-builder.json --win --x64 --dir",
  "desktop:build:unique": "node scripts/build-with-unique-dir.js",
  "desktop:build:unique:unpacked": "node scripts/download-node.js && node scripts/build-with-unique-dir.js --dir"
}
```

### 2. Next.js Standalone Build

Before packaging, the application creates a Next.js standalone build:

```bash
npm run build:standalone
```

This process:
- Copies the production Next.js configuration (`config/next.config.production.js`)
- Builds the Next.js application with `output: 'standalone'` mode
- Creates a self-contained `.next/standalone` directory with all dependencies
- Includes only the necessary files for production

### 3. Node.js Runtime Bundling

The application includes a bundled Node.js runtime to ensure consistency across different systems:

#### Download Process (`scripts/download-node.js`):
- Downloads Node.js v18.19.0 for Windows x64
- Extracts `node.exe` from the official Node.js distribution
- Places it in `resources/node/node.exe`
- Used by the packaged application to run the Next.js server

#### Runtime Usage:
- The bundled Node.js is located at `process.resourcesPath/node/node.exe`
- Used to spawn the Next.js standalone server process
- Ensures the application works independently of system Node.js installations

## File Structure and Inclusion

### Electron Builder Configuration (`config/electron-builder.json`)

#### Included Files:
```json
{
  "files": [
    "desktop/**/*",              // Electron main process files
    "server-production.js",      // Production server script
    "next.config.production.js", // Next.js production config
    ".next/standalone/**/*",     // Next.js standalone build
    "public/**/*",               // Static assets
    "!public/assets/**/*",       // Excluded: large assets (moved to extraResources)
    "!**/node_modules/**/*",     // Excluded: node_modules (handled separately)
    "!src/**/*",                 // Excluded: source files
    "!**/*.md",                  // Excluded: documentation
    "!**/.env*",                 // Excluded: environment files
    "!**/.next/cache/**/*",      // Excluded: Next.js cache
    "!**/test/**/*",             // Excluded: test files
    "!**/config/**/*"            // Excluded: build configuration
  ]
}
```

#### Extra Resources:
```json
{
  "extraResources": [
    {
      "from": "public/assets",
      "to": "assets"
    },
    {
      "from": "resources/node",
      "to": "node",
      "filter": ["**/*"]
    }
  ]
}
```

#### ASAR Configuration:
```json
{
  "asar": {
    "smartUnpack": true
  },
  "asarUnpack": [
    "desktop/**/*",
    "server-production.js",
    "next.config.production.js",
    ".next/standalone/**/*",
    "projects/**/*",
    "data/credential-config.json",
    "scripts/node/**/*"
  ]
}
```

## Packaged vs Unpacked Versions

### Packaged Version (Installer)

**Command:** `npm run desktop:build`

**Output:** 
- Windows: NSIS installer (`.exe`)
- Creates installation package with:
  - Application files compressed in ASAR archive
  - Critical files unpacked for runtime access
  - Bundled Node.js runtime in `resources/node/`
  - Assets in `resources/assets/`

**Structure:**
```
installed-app/
├── PrimeZone Advanced Panorama Viewer.exe
├── resources/
│   ├── app.asar                    # Compressed application files
│   ├── app.asar.unpacked/          # Unpacked critical files
│   │   ├── .next/standalone/       # Next.js server
│   │   ├── desktop/                # Electron main process
│   │   └── projects/               # User projects
│   ├── node/
│   │   └── node.exe               # Bundled Node.js runtime
│   └── assets/                    # Application assets
└── locales/                       # Electron localization
```

### Unpacked Version (Portable)

**Command:** `npm run desktop:build:unpacked`

**Output:**
- Directory with all files uncompressed
- No installer required
- Portable application

**Structure:**
```
win-unpacked/
├── PrimeZone Advanced Panorama Viewer.exe
├── resources/
│   ├── app.asar.unpacked/          # All application files
│   │   ├── .next/standalone/       # Next.js server
│   │   ├── desktop/                # Electron main process
│   │   ├── public/                 # Static files
│   │   └── projects/               # User projects
│   ├── node/
│   │   └── node.exe               # Bundled Node.js runtime
│   └── assets/                    # Application assets
└── locales/                       # Electron localization
```

## Dependencies and Node Modules

### Next.js Standalone Dependencies

The Next.js standalone build includes:
- Minimal required dependencies for production
- Automatically traced dependencies based on usage
- No development dependencies

### Dependency Fixing (`scripts/fix-standalone-dependencies.js`)

After packaging, the script ensures critical dependencies are available:

```javascript
const requiredDeps = [
  'next@14.2.30',
  'react@18.3.1',
  'react-dom@18.3.1'
];
```

**Process:**
1. Locates the standalone directory in the packaged app
2. Installs only production dependencies
3. Ensures the Next.js server can start properly

### Runtime Dependency Resolution

The application handles dependencies through:
- **ASAR Unpacking:** Critical files are unpacked for runtime access
- **Bundled Node.js:** Consistent runtime environment
- **Standalone Build:** Self-contained Next.js application
- **Resource Paths:** Dynamic path resolution for packaged vs development

## Server Startup in Packaged App

### Path Resolution (`desktop/server.js`)

The application dynamically resolves paths based on packaging:

```javascript
const isAsar = __dirname.includes('.asar');
let serverPath, cwd;

if (isAsar) {
  const executableDir = path.dirname(process.execPath);
  const resourcesPath = path.join(executableDir, 'resources');
  const standalonePath = path.join(resourcesPath, 'app.asar.unpacked', '.next', 'standalone', 'server.js');
  serverPath = standalonePath;
  cwd = path.join(resourcesPath, 'app.asar.unpacked', '.next', 'standalone');
} else {
  serverPath = path.join(__dirname, '../.next/standalone/server.js');
  cwd = path.join(__dirname, '../.next/standalone');
}
```

### Node.js Runtime Usage

```javascript
const bundledNodePath = path.join(process.resourcesPath, 'node', 'node.exe');
this.serverProcess = spawn(bundledNodePath, [serverPath], {
  cwd,
  env,
  stdio: ['pipe', 'pipe', 'pipe']
});
```

## Build Optimization

### Compression and Size
- **ASAR Compression:** Reduces file size and improves loading
- **Smart Unpacking:** Only unpacks files that need runtime access
- **Asset Optimization:** Large assets moved to extraResources
- **Dependency Pruning:** Only production dependencies included

### Performance Considerations
- **Standalone Build:** Faster startup with pre-built Next.js
- **Bundled Runtime:** No dependency on system Node.js
- **Resource Caching:** Static assets served efficiently
- **Process Isolation:** Separate Node.js process for web server

## Platform-Specific Builds

The configuration supports multiple platforms:

```json
{
  "win": {
    "target": [
      { "target": "nsis", "arch": ["x64"] },
      { "target": "dir", "arch": ["x64"] }
    ]
  },
  "mac": {
    "category": "public.app-category.productivity"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "category": "Graphics"
  }
}
```

## Summary

The packaging process creates a self-contained application that:
- Includes a bundled Node.js runtime for consistency
- Uses Next.js standalone build for optimal performance
- Handles both packaged (installer) and unpacked (portable) distributions
- Dynamically resolves paths for different packaging scenarios
- Optimizes file size through ASAR compression and smart unpacking
- Ensures all dependencies are available at runtime

This approach provides a robust, portable application that works independently of the target system's Node.js installation while maintaining optimal performance and minimal file size.