# Toss

A minimal, single-tap coin-flip Android app. Tap the coin, get HEADS or TAILS. That's it.

Built with Expo + React Native, published to Google Play via EAS.

- **Package**: `app.stridehub.toss`
- **Latest release**: v1.1.0 (see [CHANGELOG.md](CHANGELOG.md) — one build per day during closed testing, plan in [ROADMAP.md](ROADMAP.md))
- **By**: STRIDEHUB

## Features

- Single animated coin on the home screen — tap to flip (HEADS / TAILS)
- Flip stats under the coin — heads/tails counts, current streak, last 10 results (persisted), one-tap reset
- Light / dark theme toggle in the header, persisted with `AsyncStorage`
- Drawer sidebar (Settings, Terms & Conditions, Privacy Policy)
- Splash overlay with the logo + `BY STRIDEHUB`, fades into the app
- Inter font (Google Fonts) throughout

## Tech stack

| Layer       | Choice                                     |
| ----------- | ------------------------------------------ |
| Runtime     | Expo SDK 54, React Native 0.81, React 19   |
| Language    | TypeScript                                  |
| Navigation  | `@react-navigation/drawer` 7               |
| Animation   | `react-native-reanimated` 4 + `worklets`   |
| Persistence | `@react-native-async-storage/async-storage`|
| Fonts       | `@expo-google-fonts/inter`                 |
| Build/Ship  | EAS Build + EAS Submit                     |

## Project layout

```
.
├── App.tsx                     # Providers + Drawer navigator + splash gate
├── app.json                    # Expo config (icon, splash, package, plugins)
├── babel.config.js             # babel-preset-expo + react-native-worklets/plugin
├── eas.json                    # EAS Build + Submit profiles
├── assets/
│   └── Heads.png               # App logo (used for icon + splash + adaptive icon)
└── src/
    ├── components/
    │   ├── DocumentScreen.tsx  # Shared scaffold for T&C / Privacy
    │   └── SplashOverlay.tsx   # JS splash with logo + "BY STRIDEHUB"
    ├── navigation/
    │   └── DrawerContent.tsx   # Custom sidebar
    ├── screens/
    │   ├── HomeScreen.tsx      # Coin + theme toggle button
    │   ├── SettingsScreen.tsx
    │   ├── TermsScreen.tsx
    │   └── PrivacyScreen.tsx
    ├── store/
    │   ├── SettingsStore.tsx   # Voice assist + flip axis, persisted
    │   └── StatsStore.tsx      # Flip stats (counts, streak, recent), persisted
    └── theme/
        └── ThemeContext.tsx    # Light/dark colors + persistence
```

## Develop locally

Prereqs: Node 20+, npm, Android device or emulator with **Expo Go** matching SDK 54.

```bash
npm install
npx expo start --clear
```

Scan the QR with Expo Go on your phone, or press `a` to launch Android.

## Build for production

**Automated (default):** push a version tag and GitHub Actions does the rest — EAS builds the AAB and auto-submits it to the Play closed-testing (alpha) track:

```bash
git tag v1.2.0 && git push origin main v1.2.0
```

Requires two repo secrets (one-time setup): `EXPO_TOKEN` ([create here](https://expo.dev/settings/access-tokens)) and `GOOGLE_SERVICE_ACCOUNT_JSON` (contents of the Play service account key). See `.github/workflows/eas-release.yml`.

**Manual fallback:** requires `eas-cli` installed globally (`npm install -g eas-cli`) and an Expo account linked to this project.

```bash
# First time only — generate the Android upload keystore on EAS
eas credentials --platform android

# Build the production AAB on EAS servers (10–20 min)
eas build --platform android --profile production
```

## Ship to Google Play

Place a Google Play **service account JSON** in the project root as `google-service-account.json`. It's already in `.gitignore`.

```bash
eas submit --platform android --profile production
```

This pushes the latest production build to the **Closed testing (alpha)** track and publishes it to testers automatically (see `eas.json`). Google requires a 14-day closed test with 12+ engaged testers before granting production access — daily builds and release notes live in [ROADMAP.md](ROADMAP.md) and [CHANGELOG.md](CHANGELOG.md). Promote to production manually in [Play Console](https://play.google.com/console) once access is granted.

## Configuration touch-points

| File              | What it controls                                                                  |
| ----------------- | --------------------------------------------------------------------------------- |
| `app.json`        | App name, package, version, icon, adaptive icon, splash plugin, EAS project ID   |
| `eas.json`        | Build profiles (dev / preview / production) + Play Store submit settings         |
| `babel.config.js` | Babel preset + worklets plugin (required for Reanimated 4)                       |

## License

Private — © STRIDEHUB.
