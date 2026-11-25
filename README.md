# HElkady-expense-tracker

Voice-enabled expense tracker PWA: say or type "صرفت 10 جنيه جبت عيش" and it records amount, category and type. Currency selectable in settings, monthly summary, CSV export, data stays on the device.

## بالعربي
متتبع مصروفات بالصوت أو الكتابة: قول "صرفت 10 جنيه جبت عيش" وهو يسجل المبلغ والتصنيف. العملة تتغير من الإعدادات، ملخص شهري، وتصدير CSV، والبيانات على الموبايل بس.

## Run
No build step. It is a static web app (PWA) that works on phones and desktop.

```
npm start        # serves the folder, open the printed URL
npm test         # logic tests (Node 18+, no dependencies)
```

Deploy: upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages). On a phone, open the site and choose "Add to Home Screen" to install it like an app. To get an APK later, wrap the folder with Capacitor (`npx cap add android`).

## التشغيل
مفيش بناء. افتح `index.html` من خلال أي سيرفر ساكن (`npm start`) أو ارفع المجلد على GitHub Pages أو Netlify، وعلى الموبايل اختار "إضافة إلى الشاشة الرئيسية".

## Voice
Voice input uses the browser Web Speech API (Arabic, ar-EG). It works in Chrome / Edge on Android and desktop, and in Safari on recent iOS. It needs HTTPS (or localhost) and, in Chrome, an internet connection for recognition. If voice is not supported the text box works the same way. The parsed result is shown before saving so you can fix it.

Examples understood: `صرفت 10 جنيه جبت عيش`, `دفعت عشرين جنيه مواصلات`, `صرفت تلات تلاف وخمسمية ايجار`, `قبضت ألفين مرتب`, `صرفت 12.5 قهوة`.

## License
MIT
