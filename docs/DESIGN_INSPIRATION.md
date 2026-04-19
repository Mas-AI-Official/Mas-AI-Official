# Design Inspiration Report — mas-ai.co v3

**Compiled 2026-04-19** for the Daena + Klyntar side-by-side redesign and the
/automation + /consulting service pages. Curated to 5 sites that are closest
to our positioning (governed multi-runtime AI + security fortress). We studied
each, extracted what works, and baked the best ideas into our design system.

---

## 1. [Cognition.ai (Devin)](https://cognition.ai)

**Why it's relevant:** Engineering-first AI product sold to technical buyers.
Same credibility problem we have — technical buyer, high stakes, skeptical.

**What works:**
- **Minimal dark palette** with one accent color. No gradient-candy.
- **Serif + mono font pairing** signals engineering gravitas, not SaaS marketing.
- **Dense technical proof**: benchmarks, architecture diagrams, named components.
- **No "AI-generated art"** — the product is the art. Real product screenshots.

**What we took:** the mono-eyebrow label pattern (`SECTOR 01 — ORCHESTRATION`),
the dense stats strip (4 pillars per product), the "work speaks for itself"
bias toward metrics over adjectives.

---

## 2. [Anthropic.com](https://anthropic.com)

**Why it's relevant:** The parent brand category we want to be adjacent to.
Same compliance/safety positioning as Daena's governance-first pitch.

**What works:**
- **Near-monochrome** with one warm accent (cream/orange on dark).
- **Research-first tone**: the site reads like a paper, not a pitch.
- **Typography does the heavy lifting**: Syne-like display, tight kerning, letter-spacing.
- **Huge whitespace** — the "confident company" signal.
- **Zero "book a demo" urgency** — reads as enterprise-serious.

**What we took:** the `Syne` display font (already in our system), the
tight letter-spacing on headlines (`tracking-tight`), the generous section
padding (py-20 to py-28), and the resistance to hype language.

---

## 3. [Lovable.dev](https://lovable.dev)

**Why it's relevant:** Newer-gen AI builder with strong kinetic typography —
the 2026 design trend that every AI site is adopting.

**What works:**
- **Kinetic typography in hero**: per-word animated reveal with blur-to-sharp.
- **Bold gradient headline** with a single highlighted "power word".
- **Variable fonts** animated on scroll — movement without gimmickry.
- **Sticky / pinned hero** that blurs on scroll-out (not static).

**What we took:** the GSAP per-word blur reveal (already in `Hero.tsx`), the
single-word gradient emphasis (our `text-shimmer` on "Governed"), and the
pinned-hero pattern that blurs/scales on scroll-out.

---

## 4. [Manus.im](https://manus.im)

**Why it's relevant:** Autonomous-agent competitor with $2B acquisition
validation — same category, similar positioning language.

**What works:**
- **Dark theme + cool blue/purple accents** (similar to ours).
- **Product-first positioning** ("describe a goal at a high level") — not
  feature-first.
- **Minimal visual clutter** — 3D scene behind copy, not in front.
- **Video-heavy proof** (their differentiator is "it just works"; ours is
  "it works AND you can audit it").

**What we took:** the 3D background with copy-on-glass pattern (our
`PhiLatticeBackground` + `glass` utility), the "what it does" language
before "how it works" language.

---

## 5. [Midjourney.com](https://midjourney.com)

**Why it's relevant:** Most extreme example of "the work speaks for itself"
— no traditional marketing copy on the homepage.

**What works:**
- **Almost zero marketing copy** — just the work.
- **Infinite scroll of generations** as proof-of-concept.
- **Single heavy CTA** (Subscribe) — no menu decisions.
- **Trust through audacity** — they're so confident in the product they
  don't explain it.

**What we took:** the discipline to cut copy. The `PortfolioSection` stays
tight; we resisted adding feature lists on the homepage where screenshots
and stats do the job. The ProductsSection trusts the pillar stats (10 / 60
/ 10 / 5 for Daena, 25+ / 45+ / 20 / 4 for Klyntar) to carry the weight.

---

## Cross-cutting design trends we adopted

Based on 2026 industry research (sources below):

1. **82.7% of users use dark mode.** Our base is `#080b14` with 20% opacity
   glass panels — preserves contrast on 3D backgrounds.
2. **Kinetic typography** is the anchor pattern for hero sections. We use
   per-word GSAP reveals with blur-to-sharp.
3. **Minimalism converts better for B2B**. We stripped adjectives and let
   numbers carry the pitch (4 stats per product, not 12).
4. **Variable fonts + tight letter-spacing** for display. We use Syne +
   tight tracking on all H1/H2.
5. **Glass morphism** (not flat cards) because the 3D PhiLattice background
   earns the `backdrop-filter: blur()` cost.
6. **Single accent per sector.** Daena = cyan, Klyntar = crimson. Viewers
   instantly know "which side of the OS am I on."

## Sources

- [Veloxthemes — Top AI Automation Agency Templates 2026](https://veloxthemes.com/blog/best-ai-automation-agency-templates)
- [Titan — Best AI Website Builders 2026](https://titan.email/best-ai-website-builders/)
- [Webstacks — AI Website Design Examples](https://www.webstacks.com/blog/ai-website-design-examples-inspiration)
- [Khod — Top 33 AI Website Design Examples 2026](https://www.khod.io/resource-center/articles/ai-website-examples)
- [Digital Silk — Minimalist Web Design Trends 2026](https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/)
- [Lovable — 10 Website Design Trends 2026](https://lovable.dev/guides/website-design-trends-2026)
- [Blend B2B — Best AI Company Website Examples 2026](https://www.blendb2b.com/blog/best-ai-website-examples)
- [Figma — 29 AI Website Examples](https://www.figma.com/resource-library/ai-website-examples/)
- [Netwrix — Top AI Cybersecurity Companies 2026](https://netwrix.com/en/resources/blog/ai-cybersecurity-companies/)
- [Designveloper — 20 Leading Agentic AI Companies 2026](https://www.designveloper.com/blog/top-agentic-ai-companies/)

---

## What to do with this document

- **Keep it next to the design system.** When a section feels "off," cross-
  check against which of the five peers would reject the move.
- **Revisit quarterly.** Categories like "AI automation agency" visually
  normalize fast — every 3 months, we should re-audit and see if our
  differentiation (governance + side-by-side Daena+Klyntar) is still
  visually distinct from the crowd.
- **If we hire a designer**, hand them this doc first, then the brand
  guidelines second. The peer analysis tells them *why* the system is
  what it is — not just what it is.
