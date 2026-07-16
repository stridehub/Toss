# Changelog

All notable user-facing changes to Toss. One build per day during the closed-testing period — each build ships at least one feature and one fix.

## [1.1.0] — 2026-07-16

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
