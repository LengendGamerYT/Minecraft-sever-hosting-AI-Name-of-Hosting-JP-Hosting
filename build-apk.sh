#!/bin/bash

# JP Hosting - APK Build Script
# This script builds your Minecraft server hosting app into an APK file
# Perfect for mobile users who can't install Android Studio

echo "🚀 JP Hosting - Building APK..."
echo "📱 Perfect for mobile developers!"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "💡 Alternative: Use GitHub Actions (automatic build on push)"
    exit 1
fi

# Create app directory structure
echo "📁 Setting up build environment..."
mkdir -p app
cp -r client/build app/dist
cp client/package.json app/

# Create Capacitor config for Docker build
cat > app/capacitor.config.json << EOF
{
  "appId": "com.jphosting.minecraft",
  "appName": "JP Hosting",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#667eea",
      "showSpinner": true,
      "spinnerColor": "#ffffff"
    }
  }
}
EOF

echo "🔨 Building APK with Docker..."
echo "⏱️  This may take 5-10 minutes..."

# Build APK using Docker
docker run --rm -it -v ./app:/app nguoianphu/capacitor

# Check if APK was created
if [ -f "app/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    # Copy APK to root directory
    cp app/android/app/build/outputs/apk/debug/app-debug.apk jp-hosting.apk
    
    echo "✅ APK built successfully!"
    echo "📱 Your APK file: jp-hosting.apk"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Transfer jp-hosting.apk to your Android device"
    echo "2. Enable 'Install from Unknown Sources' in Android settings"
    echo "3. Install and launch JP Hosting!"
    echo ""
    echo "💰 Payment: All transactions go to jaydendpenha@fam"
    echo "🆓 Free Plan: 7-day free server + free .hosting.jp domain"
    echo ""
    echo "🎮 Features in your APK:"
    echo "• Advanced Server Control Panel (Darco-style)"
    echo "• Custom Domain Management"
    echo "• UPI Payment Integration"
    echo "• Real-time Server Monitoring"
    echo "• File Manager with Editor"
    echo "• Beautiful Modern UI"
else
    echo "❌ APK build failed!"
    echo "💡 Try using GitHub Actions instead (automatic build)"
    exit 1
fi

# Cleanup
rm -rf app

echo "🎉 JP Hosting APK is ready for your mobile business!"