#!/bin/bash

echo "🏓 Construction de l'APK Pong Frag..."

# 1. Builder le jeu web
echo "📦 Build du jeu web..."
npm run build

# 2. Synchroniser avec Capacitor
echo "🔄 Synchronisation Capacitor..."
npx cap sync android

# 3. Générer l'APK
echo "🚀 Génération de l'APK..."
cd android && ./gradlew assembleDebug

# 4. Copier l'APK dans le dossier principal
echo "📁 Copie de l'APK..."
cp app/build/outputs/apk/debug/app-debug.apk ../pong-frag.apk

echo "✅ APK généré avec succès : pong-frag.apk"
echo "📱 Tu peux maintenant l'installer sur ton Android !"