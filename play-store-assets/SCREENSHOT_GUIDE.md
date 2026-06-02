# Play Store Screenshot Guide

How to take phone, 7" tablet, and 10" tablet screenshots of the Toss app for upload to Play Console.

## Play Store size requirements

| Asset                      | Size (px)              | Required?       |
| -------------------------- | ---------------------- | --------------- |
| App icon (high-res)        | 512 x 512              | Required        |
| Feature graphic            | 1024 x 500             | Required        |
| Phone screenshot           | 1080 x 1920 (portrait) | 2-8 required    |
| 7" tablet screenshot       | 1200 x 1920 (portrait) | Optional (recommended) |
| 10" tablet screenshot      | 1600 x 2560 (portrait) | Optional (recommended) |

All screenshots: 16:9 to 9:16 ratio, between 320 and 3840 px on the long side.

The feature graphic is already generated at [feature-graphic.png](feature-graphic.png). The 512x512 icon is the existing [Heads.png](../assets/Heads.png) (render it through your icon generator if you want a polished version).

---

## One-time setup: Android Studio + emulators

1. **Install Android Studio** from https://developer.android.com/studio (skip if you already have it).
2. Open it -> **More Actions** -> **Virtual Device Manager** -> **Create Virtual Device**.
3. Create three AVDs (Android Virtual Devices):

   | Profile                | Category | System image                  |
   | ---------------------- | -------- | ----------------------------- |
   | **Phone**: Pixel 7     | Phone    | Android 14 (API 34), x86_64   |
   | **7" tablet**: Nexus 7 | Tablet   | Android 14 (API 34), x86_64   |
   | **10" tablet**: Pixel Tablet | Tablet | Android 14 (API 34), x86_64 |

   On each AVD's **Show Advanced Settings** -> set **Camera (Front)** = None to speed boot.

4. Start each AVD once to confirm it boots cleanly.

---

## Running the app on an emulator

From the project root, in one terminal:

```bash
npx expo start --clear
```

In another terminal (or by pressing `a` in the Expo CLI), launch on the running emulator:

```bash
npx expo run:android
```

Expo Go must support SDK 54 on the emulator. If it doesn't, the easier path is:

```bash
# Build a development client APK (one-time per AVD)
eas build --platform android --profile development --local

# Or, fastest: just run the production Play Console build
# (use the AAB we already built and install via bundletool, or sideload the APK from EAS)
```

The simplest fast path: use `eas build --profile preview` (produces an APK) and drag the APK onto each running emulator.

---

## Taking the screenshots

For each emulator (phone, 7", 10"), capture both **dark mode** and **light mode** versions of:

1. **Home screen with HEADS** - tap the coin until it lands on HEADS
2. **Home screen with TAILS** - tap until it lands on TAILS
3. **Home screen with TAP** (initial state) - reset by closing/reopening the app
4. **Drawer open** - tap the hamburger to show the sidebar
5. **Settings screen** - drawer -> Settings
6. **Terms & Conditions** - drawer -> Terms (show the hero card)
7. **Privacy Policy** - drawer -> Privacy (show the hero card)

**How to capture in the emulator:**

- Look at the **side toolbar** of the AVD window
- Click the **camera icon** (Take screenshot) - saves to your Desktop by default
- OR press `Ctrl+S` while focus is on the emulator

The saved PNG will be at the emulator's native resolution. For Play Console:
- Phone: Pixel 7 captures 1080 x 2400 - upload as-is
- 7" Nexus 7: 1200 x 1920 - upload as-is
- 10" Pixel Tablet: 1600 x 2560 - upload as-is

If any screenshot is over 3840px on the long side, downscale in any image tool before uploading.

---

## Recommended Play Store screenshot set

Upload these 4-6 per device class. Order matters - the first screenshot is your "hero" shown in search results.

1. **Hero - HEADS in dark mode** (the moneymaker - vibrant coin on black)
2. **TAILS in light mode** (contrast - shows light theme works)
3. **Drawer open in dark mode** (shows navigation)
4. **Settings screen** (shows polish: theme picker, voice toggle)
5. **Terms & Conditions hero** (shows you have a real legal page - reassuring)
6. **Privacy Policy hero** (same reason)

Drop them all in `play-store-assets/screenshots/{phone, tablet-7, tablet-10}/` so they're organized for upload.

---

## Uploading to Play Console

1. https://play.google.com/console -> Toss app -> **Grow** -> **Store presence** -> **Main store listing**
2. **Graphics** section:
   - **App icon**: upload `assets/Heads.png` (must be 512 x 512 - resize if needed)
   - **Feature graphic**: upload `play-store-assets/feature-graphic.png`
3. **Screenshots** section (one per device type):
   - **Phone screenshots**: upload 2-8 from `screenshots/phone/`
   - **7-inch tablet screenshots**: upload 2-8 from `screenshots/tablet-7/`
   - **10-inch tablet screenshots**: upload 2-8 from `screenshots/tablet-10/`
4. Click **Save** at the bottom of the page.

That fills out the Graphics requirements of the listing. The text fields (short description, full description, app category) are separate and need to be filled out before you can promote to production - but for internal testing, you can skip them.

---

## Regenerating the feature graphic

If the logo or styling changes, regenerate via:

```bash
node scripts/generate-feature-graphic.js
```

Edit the constants at the top of [scripts/generate-feature-graphic.js](../scripts/generate-feature-graphic.js) to adjust logo size, position, or text.
