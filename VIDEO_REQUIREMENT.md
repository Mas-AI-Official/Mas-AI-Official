# Scroll-Video Component Requirement

## Video File Needed

The scroll-storytelling "How it works" section requires a video file at:

**Path:** `assets/video/daena-scroll.mp4`

## Video Specifications

- **Duration:** 6-8 seconds recommended
- **Format:** MP4 (H.264 codec for best browser compatibility)
- **Aspect Ratio:** 16:9 or similar
- **Resolution:** 1920x1080 or higher

## Video Content

The video should visually represent the 4 steps of Daena:

1. **Sunflower governance** (0-25% of video)
   - Visual: Sunflower icon/pattern, governance structure

2. **Honeycomb departments** (25-50% of video)
   - Visual: Honeycomb grid, organizational structure

3. **Agent swarms** (50-75% of video)
   - Visual: Nodes lighting up, parallel execution, agent coordination

4. **Audit trail** (75-100% of video)
   - Visual: Ledger/log lines, traceability, evidence trails

## How It Works

The scroll-video component uses GSAP ScrollTrigger to:
- Pin the section during scroll
- Map scroll progress (0-100%) to video time (0-duration)
- Update text content based on scroll position
- Animate orbit selector nodes

## Fallback

If the video file is not available, the section will still work with:
- Text updates based on scroll
- Orbit selector animation
- No video playback (graceful degradation)

## Creating the Video

You can create this video using:
- **Figma → After Effects** export
- **Motion graphics tools** (Blender, Cinema 4D)
- **Simple animation** showing the 4 concepts sequentially

The video should be clean, professional, and match the premium AI platform aesthetic.
