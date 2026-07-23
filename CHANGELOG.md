# Changelog

All notable user-facing changes to Toss. One build per day during the closed-testing period — each build ships at least one feature and one fix.

## [1.5.2] — 2026-07-24

### Changed

- Stripped `ACTIVITY_RECOGNITION` from the Android manifest via `android.blockedPermissions`. `expo-sensors` bundles it for its Pedometer, which Toss never uses (shake-to-flip only reads the accelerometer, which needs no permission). Google Play treats `ACTIVITY_RECOGNITION` as a health-data permission and was blocking every release since v1.4.0 with a "health features" policy error. Same app content as 1.5.0/1.5.1 otherwise.

## [1.5.1] — 2026-07-23

### Changed

- Stripped `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PLAYBACK` from the Android manifest via `android.blockedPermissions`. `expo-audio` declares them for its background-playback service, which Toss never uses — they were tripping Google Play's "Foreground service permissions" declaration requirement. Same app content as 1.5.0 otherwise.

## [1.5.0] — 2026-07-22

### Fixed

- **App crashing at launch after updating.** The v1.3.0 build shipped two conflicting copies of Expo native modules: `expo-audio` declares `expo-asset` as a loose peer dependency, and npm auto-installed the latest (SDK 55-line) `expo-asset`/`expo-constants` alongside SDK 54's copies. Both are now pinned as direct dependencies at the SDK 54 versions; `expo-doctor` passes 18/18.

### Added

- **History screen** in the sidebar: every flip with its time (Today/Yesterday-style timestamps), newest first, plus a clear-all button with confirmation. Keeps the most recent 500 flips; clearing history leaves counters/stats untouched.

### Notes

- v1.4.0 (shake-to-flip) was built but never reached testers due to a Play Console policy gate, so this is the first update since 1.3.0 — it delivers shake-to-flip as well.

## [1.4.0] — 2026-07-20

### Added

- **Shake to flip**: shake your phone and the coin flips — no tap needed. Works only while the Home screen is visible.
- "Shake to flip" sensitivity setting (Off / Low / Medium / High) in Settings, default Medium. Higher sensitivity flips on a gentler shake; Off disables the sensor entirely.

## [1.3.0] — 2026-07-20

### Added

- **Coin-flip sound effects**: a soft whoosh as the coin launches and a metallic ting when it lands (generated in-repo by `scripts/generate-coin-sfx.js`).
- "Sound effects" toggle in Settings (on by default), persisted like the other settings.

### Changed

- Sounds respect the phone's silent switch and mix with (never pause) music playing in other apps.
- The Android app requests no microphone permission — `expo-audio` is configured playback-only.

## [1.2.0] — 2026-07-19

### Added

- **Haptic feedback** on every flip: a light tick as the coin launches and a firmer bump when it lands.
- "Haptic feedback" toggle in Settings (on by default), persisted like the other settings.

## [1.1.0] — 2026-07-17

### Added

- **Flip stats** under the coin: heads/tails counters, current streak (e.g. "3 × TAILS in a row"), and chips for your last 10 results. Persisted across app restarts via AsyncStorage.
- Reset button for stats, with a confirmation dialog.

### Fixed

- Voice assist now announces the result exactly when the coin lands instead of mid-spin.
- Toss results are now announced to TalkBack/screen-reader users even when voice assist is off.
- Cleared a stray timer (and any in-flight speech) when leaving the Home screen mid-flip.

### Changed

- Play submissions now target the **closed testing (alpha)** track and publish automatically, so every daily build reaches testers — internal-track releases don't count toward Google's 14-day closed-test requirement.

## [1.0.0] — initial release

- Single animated coin — tap to flip (HEADS / TAILS)
- Light / dark / system theme, persisted
- Flip direction setting (vertical / horizontal) + voice assist
- Drawer with Settings, Terms & Conditions, Privacy Policy
