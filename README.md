# HElkady-expense-tracker

Voice-enabled expense tracker PWA: say or type "صرفت 10 جنيه جبت عيش" and it records amount, category and type. Currency selectable in settings, monthly summary, CSV export, data stays on the device.

## بالعربي
متتبع مصروفات بالصوت أو الكتابة: قول "صرفت 10 جنيه جبت عيش" وهو يسجل المبلغ والتصنيف. العملة تتغير من الإعدادات، ملخص شهري، وتصدير CSV، والبيانات على الموبايل بس.

## Run
No build step. It is a static web app (PWA) that works on phones and desktop.

```
npm start        # serves the www folder, open the printed URL
npm test         # logic tests (Node 18+, no dependencies)
```

Deploy: upload the `www` folder to any static host (GitHub Pages, Netlify, Cloudflare Pages). On a phone, open the site and choose "Add to Home Screen" to install it like an app. The same code is already wrapped as an Android project (see below).

## التشغيل
مفيش بناء. افتح `index.html` من خلال أي سيرفر ساكن (`npm start`) أو ارفع مجلد www على GitHub Pages أو Netlify، وعلى الموبايل اختار "إضافة إلى الشاشة الرئيسية".

## Voice
Voice input uses the browser Web Speech API (Arabic, ar-EG). It works in Chrome / Edge on Android and desktop, and in Safari on recent iOS. It needs HTTPS (or localhost) and, in Chrome, an internet connection for recognition. If voice is not supported the text box works the same way. The parsed result is shown before saving so you can fix it.

Examples understood: `صرفت 10 جنيه جبت عيش`, `دفعت عشرين جنيه مواصلات`, `صرفت تلات تلاف وخمسمية ايجار`, `قبضت ألفين مرتب`, `صرفت 12.5 قهوة`.

## Android app (Capacitor)
The `android/` folder is a ready Android Studio project (app id `com.helkady.expenses`, name "متتبع المصروفات"). The web code lives in `www/` and is copied into the Android project by `cap sync`.

Requirements: Node 18+, JDK 21 (the one bundled with a recent Android Studio is fine), Android Studio with Android SDK Platform 35.

```
npm install
npx cap sync android      # copies www/ into the Android project
npx cap open android      # opens Android Studio, then Run or Build > Build APK(s)
```

Or from the command line (needs JDK 21 and ANDROID_HOME set):

```
cd android
./gradlew assembleDebug
```

The debug APK is at `android/app/build/outputs/apk/debug/app-debug.apk`. Install it with `adb install -r app-debug.apk` or copy it to the phone. After any change in `www/`, run `npx cap sync android` again.

For a Play Store build use Android Studio: Build > Generate Signed Bundle / APK, and create your own keystore (never commit it).

## تطبيق أندرويد (Capacitor)
مجلد `android/` مشروع جاهز لـ Android Studio (معرّف التطبيق `com.helkady.expenses`). كود الويب في `www/` والأمر `cap sync` بينسخه جوه مشروع أندرويد.

المطلوب: Node 18+ و JDK 21 (اللي جاي مع Android Studio الحديث مناسب) و Android SDK Platform 35.

```
npm install
npx cap sync android
npx cap open android      # يفتح Android Studio، بعدين Build > Build APK(s)
```

أو من سطر الأوامر: `cd android && ./gradlew assembleDebug` وملف الـ APK هيكون في `android/app/build/outputs/apk/debug/app-debug.apk`.

لنسخة Google Play استخدم Build > Generate Signed Bundle / APK واعمل keystore خاص بيك ومترفعوش على GitHub.

## Voice on Android
The Android app uses the native speech recognition plugin (`@capacitor-community/speech-recognition`) with the `RECORD_AUDIO` permission already added to the manifest. It asks for microphone permission on first use. Recognition language is ar-EG and needs Google speech services on the phone (internet may be required).

## License
MIT
