# 14-Day Closed-Testing Roadmap

Google Play denied production access on 2026-07-16: tester engagement during the closed test was too low. The fix is a **14-day closed test with 12+ engaged testers**. This roadmap ships one feature + bug fixes every day so testers have a reason to open the app daily.

## Rules for every daily build

1. Fix any tester-reported bugs from the group **first** — Google explicitly looks for "gathering and acting on user feedback through updates".
2. Ship at least one visible feature or improvement.
3. Bump `version` in `app.json` (versionCode auto-increments on EAS).
4. Add a `CHANGELOG.md` entry + a `release-notes/vX.Y.Z.txt` (≤500 chars) thanking testers.
5. Build + submit: `eas build --platform android --profile production` then `eas submit --platform android --profile production` (goes live on the closed **alpha** track automatically).
6. Post the day's changes in the tester group and ask for specific feedback.

## Engagement requirements (do not lose the clock)

- Keep **12+ testers opted in continuously** — if the count drops below 12, the 14-day clock can reset.
- Testers must actually **install and open** the app, not just opt in. Nudge the group daily.
- Reply to feedback in the group and name-check fixes in release notes ("thanks for the report!").

## Day-by-day plan

| Day | Date (target) | Version | Feature | Fix focus |
| --- | --- | --- | --- | --- |
| 1 | 2026-07-16 | 1.1.0 | Flip stats: counters, streak, last-10 history, reset | Voice-assist timing, TalkBack announce, timer leak |
| 2 | 2026-07-17 | 1.2.0 | Haptic feedback on flip + settings toggle (expo-haptics) | Tester-reported bugs |
| 3 | 2026-07-18 | 1.3.0 | Coin-flip sound effect + mute toggle (expo-audio) | Tester-reported bugs |
| 4 | 2026-07-19 | 1.4.0 | Shake-to-flip (expo-sensors) with sensitivity setting | Tester-reported bugs |
| 5 | 2026-07-20 | 1.5.0 | Full history screen in drawer (timestamps, clear-all) | Tester-reported bugs |
| 6 | 2026-07-21 | 1.6.0 | Multi-flip mode: flip 3/5/10 coins at once with tally | Tester-reported bugs |
| 7 | 2026-07-22 | 1.7.0 | Custom faces: Yes/No or user text instead of Heads/Tails | Tester-reported bugs |
| 8 | 2026-07-23 | 1.8.0 | Coin skins (color/style picker) | Tester-reported bugs |
| 9 | 2026-07-24 | 1.9.0 | Share a result / share your stats (system share sheet) | Tester-reported bugs |
| 10 | 2026-07-25 | 1.10.0 | Heads/tails distribution bar + all-time best streak | Tester-reported bugs |
| 11 | 2026-07-26 | 1.11.0 | First-run onboarding hint + animation polish | Tester-reported bugs |
| 12 | 2026-07-27 | 1.12.0 | Localization pass (2–3 languages incl. voice assist) | Tester-reported bugs |
| 13 | 2026-07-28 | 1.13.0 | Performance + accessibility audit pass | Tester-reported bugs |
| 14 | 2026-07-29 | 2.0.0 | Final polish, refreshed store listing/screenshots | Zero-known-bugs build |

After Day 14: verify the Play Console dashboard shows the closed-test requirement met, then **apply for production access again** — the application form asks how you recruited testers, how you collected feedback, and what you changed because of it; the changelog + group history are the evidence.
