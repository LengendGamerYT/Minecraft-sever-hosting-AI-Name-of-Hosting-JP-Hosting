#!/usr/bin/env python3
"""
JP Hosting APK Builder
Creates APK file directly using online build services
Perfect for mobile users without development setup
"""

import os
import json
import zipfile
import shutil
from pathlib import Path

def create_apk_package():
    """Create a ready-to-build APK package"""
    
    print("🚀 JP Hosting - Creating APK Package...")
    print("📱 Perfect for mobile developers!")
    
    # Create package directory
    package_dir = Path("jp-hosting-apk-package")
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir()
    
    # Copy built React app
    build_dir = Path("client/build")
    if not build_dir.exists():
        print("❌ React build not found! Please run 'cd client && npm run build' first")
        return False
    
    # Copy build files
    dist_dir = package_dir / "www"
    shutil.copytree(build_dir, dist_dir)
    
    # Create Capacitor config
    capacitor_config = {
        "appId": "com.jphosting.minecraft",
        "appName": "JP Hosting",
        "webDir": "www",
        "bundledWebRuntime": False,
        "plugins": {
            "SplashScreen": {
                "launchShowDuration": 2000,
                "backgroundColor": "#667eea",
                "showSpinner": True,
                "spinnerColor": "#ffffff"
            },
            "StatusBar": {
                "style": "DARK"
            }
        },
        "server": {
            "androidScheme": "https"
        }
    }
    
    with open(package_dir / "capacitor.config.json", "w") as f:
        json.dump(capacitor_config, f, indent=2)
    
    # Create package.json
    package_json = {
        "name": "jp-hosting",
        "version": "1.0.0",
        "description": "Minecraft Server Hosting Platform - JP Hosting",
        "main": "index.js",
        "dependencies": {
            "@capacitor/core": "^5.0.0",
            "@capacitor/android": "^5.0.0"
        }
    }
    
    with open(package_dir / "package.json", "w") as f:
        json.dump(package_json, f, indent=2)
    
    # Create README with instructions
    readme_content = """# JP Hosting APK Package

## 🚀 Build APK Online

### Option 1: PhoneGap Build (Recommended)
1. Create account at https://build.phonegap.com
2. Upload this folder as ZIP
3. Build APK online
4. Download your APK

### Option 2: Capacitor Cloud Build
1. Go to https://capacitorjs.com/
2. Use online build service
3. Upload this package
4. Get APK download link

### Option 3: Local Build (if you have Android Studio)
1. Install Capacitor CLI: `npm install -g @capacitor/cli`
2. Run: `npx cap add android`
3. Run: `npx cap sync android`
4. Open in Android Studio: `npx cap open android`
5. Build APK

## 📱 Features in Your APK:
- 🎮 Advanced Server Control Panel (Darco-style)
- 🌐 Custom Domain Management (free .hosting.jp + paid domains)
- 💰 UPI Payment Integration (jaydendpenha@fam)
- 📊 Real-time Server Monitoring
- 📁 File Manager with Editor
- 🔐 Persistent Authentication
- 🎨 Beautiful Modern UI

## 💳 Payment Info:
All transactions go to UPI ID: **jaydendpenha@fam**

## 🆓 Free Plan:
Get your first server free for 7 days + free .hosting.jp domain!
"""
    
    with open(package_dir / "README.md", "w") as f:
        f.write(readme_content)
    
    # Create ZIP package
    zip_path = "jp-hosting-apk-package.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(package_dir):
            for file in files:
                file_path = Path(root) / file
                arc_name = file_path.relative_to(package_dir)
                zipf.write(file_path, arc_name)
    
    print("✅ APK Package created successfully!")
    print(f"📦 Package file: {zip_path}")
    print("")
    print("🎯 Next Steps:")
    print("1. Download jp-hosting-apk-package.zip")
    print("2. Go to https://build.phonegap.com")
    print("3. Upload the ZIP file")
    print("4. Build APK online")
    print("5. Download your JP Hosting APK!")
    print("")
    print("📱 Alternative: Use Capacitor online build services")
    print("💰 Payment: All transactions go to jaydendpenha@fam")
    print("🎮 Advanced server control panel included!")
    
    # Cleanup
    shutil.rmtree(package_dir)
    
    return True

if __name__ == "__main__":
    create_apk_package()