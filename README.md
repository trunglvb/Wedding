# Nguyễn Nguyệt & Lường Cường

React + Vite, GSAP ScrollTrigger, shadcn Button (CVA + Radix Slot), Radix Dialog. No Next.js.

## Run

```bash
npm install
npm run dev
npm run build
```

`dist/` contains the static site.

## Couple and content

Bride: Nguyễn Nguyệt, bác sĩ. Groom: Lường Cường, bác sĩ quân y. Bride appears first.

`src/content.js` holds names, occupations, biography copy, memories, ten device-specific hero photo pairs and the requested music playlist. Biographies and the meeting story remain draft copy; names and occupations are user-provided. `public/photos/` contains all 26 supplied photographs.

## Latest visual changes

- Fullscreen `object-fit: cover` hero with separate mobile selections. `src/photo-meta.json` stores manually reviewed face bounds. `src/lib/photo-framing.js` computes object position from the actual viewport while keeping the face bounds in frame.
- New photograph every 2.5 seconds, 2-second iris transition. No numeric hero counter.
- Brighter ruby background #a12438. Reduced headings, portrait sizes and whitespace. Biography and first-meeting copy share the same Manrope font size and line height (16px desktop, 15px mobile).
- `src/components/typing-title.jsx` implements progressive typewriting with a cursor, inspired by Animate UI's Typing Text behavior. Vietnamese grapheme segmentation, in-view start, reserved layout and reduced-motion support.
- Desktop pinned 2024–Now horizontal story; native swipe and snap on mobile.
- Final panel shows 26 bordered floating images. Each frame follows its image's aspect ratio with no internal letterboxing; images fill their frames. Preview uses contain to preserve the complete original image proportions.

## Music — pending source files

Requested order is configured:

1. Người tốt nhất cho em — Bon Nghiêm & 14 Casper
2. Lý giải — Hoàng Dũng
3. Đường chân trời — Chillies
4. Một đời — 14 Casper, Bon Nghiêm & buitruonglinh

Official YouTube references are retained in `tracks.sourceUrl` for identifying the exact recordings. They are not direct audio files. Each `tracks.file` is currently null until the user supplies an MP3/M4A or direct audio source. The old synthesized demo tracks are no longer played. The icon reports that the soundtrack is being updated; the site does not claim unavailable music is playing.

When files are supplied, set the four `file` values to the local public paths or supplied direct sources. The player tries unmuted autoplay on load and on media readiness, retries following click/touchend/keyboard activation if blocked, respects manual pause, advances tracks in order, and skips failed media. Browser rules can still require a user gesture. No playlist popup or embedded video UI is added.

## Verification

Production build and asset checks. Face-bound geometry checked for all ten hero photos at ten viewport sizes (100 combinations). Font glyph coverage includes both real names. Browser visual/device QA is unavailable because control-browser is not installed in this environment. Live music cannot be validated until the source files are supplied.

## Deferred scope

Event schedule, RSVP, map and payment QR are not part of this phase.
