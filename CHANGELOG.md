# Changelog

All notable user-facing changes to Toss. One build per day during the closed-testing period — each build ships at least one feature and one fix.

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
