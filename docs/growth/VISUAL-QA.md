# VISUAL-QA: mas-ai /growth/ feat/growth-service-2026-11 (working tree, 2026-11-11)
<!-- Gate: python D:/agents/skills/mas-design-director/scripts/brief_check.py qa VISUAL-QA.md
     Every status is PASS, FAIL, INCONCLUSIVE or NOT RUN. Evidence = command + exit code, or a file path. -->

Served from the static export (`out/`, python http.server on 3344). Evidence folder: D:/MAS-AI/growth/research/2026-11-11-chatgpt-plan-gap/visual-qa/ (qa.json, gates.log, sections/, site-gate/). There is no "before": the page does not exist on origin/main (deleted by PR 8 on 2026-10-24).

## Screenshots
| width | before | after |
|---|---|---|
| 390 | | D:/MAS-AI/growth/research/2026-11-11-chatgpt-plan-gap/visual-qa/growth-390.png |
| 768 | | D:/MAS-AI/growth/research/2026-11-11-chatgpt-plan-gap/visual-qa/growth-768.png |
| 1440 | | D:/MAS-AI/growth/research/2026-11-11-chatgpt-plan-gap/visual-qa/growth-1440.png |

Rework of 2026-11-11 (name lockup, approval list, three sample pieces), first screen and samples section: visual-qa/growth3-1440-head.png, growth3-390-head.png, growth3-1440-examples.png, growth3-390-examples.png. Lockup masters: D:/MAS-AI/growth/resources/brand/mas-ai-growth-lockup/ (2400 by 800 banner, 1080 square). Sample masters and source: D:/MAS-AI/growth-engine/var/renders/growth-page-samples-2026-11-11/.

## Checks
| check | status | evidence |
|---|---|---|
| keyboard | PASS | growth_page_qa.py exit 0: first 12 tab stops, 0 without a visible focus indicator; first stop is "Skip to content" (qa.json keyboard) |
| reduced-motion | PASS | growth_page_qa.py with reduced_motion=reduce: 0 data-reveal elements left hidden (qa.json reduced_motion_hidden) |
| console | PASS | 0 console errors and 0 page errors at 390, 768 and 1440 (qa.json); scripts/qa/capture.py "errors: 0" |
| overflow | PASS | scrollWidth equals clientWidth at all three widths: 390/390, 768/768, 1440/1440 (qa.json widths) |
| contrast | PASS | palette_gate.py check mas-ai.palette.json: 19 of 19 text, focus and status pairs ok (lowest 5.91:1). No text sits on a photo or gradient. The same run ends VERDICT BREACHED for a different reason: brand distinctness from mencore, see director review 4 |
| real-actions | PASS | primary button clicked: lands on /start/, and /start/ shows both growth options; "See how it starts" target #start exists. The form itself was NOT submitted (it would send a real inquiry) |
| palette-drift | PASS | palette_gate.py audit-css src/styles/tokens.css --against mas-ai.palette.json: VERDICT HELD, 19 colour custom properties, no drift (one near-duplicate note, --panel-hi and --line, predates this branch). The new gr-* block in work.css holds 0 colour literals (grep count 0), every colour is a token |

Other gates on the same build: typecheck, node tests and next build passed (gates.log); link gate HELD (40 pages, 2072 internal links, 0 breaches); site_gate.py local HELD (28 sitemap pages, P0 0, P1 0, P2 12); check_app_legal.py OVERALL WARN (BREACHED 0, one WARN: the site has no terms page); content gate BREACHED with 6 breaches after the rework (4 in src/lib/guide/legacy.ts, 2 for the agent count in investors.html and its built copy), none in the growth page; it was 8 before the patent card was removed from investors.html on this branch. The page carries `noindex, follow`, one h1, and three JSON-LD blocks that parse (BreadcrumbList, FAQPage, Service).

## Director review
1. No photo or proof of real client work. After the 2026-11-11 rework the page head shows the name lockup and an illustrated approval list, and one section shows three sample pieces for an invented heating business (a short video, a post, an ad draft) in their own navy, cream and orange, which is the only colour on the page outside the tokens. They show the format for a trade; they are not proof, and the page says so. The 15-second video behind the cover is rendered (D:/MAS-AI/growth-engine/var/renders/growth-page-samples-2026-11-11/video/out/sample-video.mp4, synthetic brand voice, frame sheet read by eye) and plays on the page from public/growth/sample-video.mp4 (owner-approved exception of 2026-11-11 to the no-video-in-a-source-repo rule; press play, no autoplay). A first real client piece replaces them.
2. Length: about 1,960 words after the rework (growth_page_qa.py words=1959); it was 14,349 px at 390 wide and about 1,800 words before. The two terms lists carry most of it. Kept, because the written terms are the trust mechanism and the DR-004 wording is the owner's; the cut to make after approval is moving the pilot to its own page.
3. Two templates on one page. Narrative sections use the service-page classes and the terms sections use the work-page classes, so the heading scale has two levels. It is deliberate (the audit is promoted to the larger scale) but it is a maintenance smell; fold into one growth stylesheet once the page is approved.
4. Palette gate BREACHED at brand level, not page level: mas-ai gold on near-black sits within dE 3.3 (primary) and 2.9 (canvas) of the mencore client brand. mas-ai.co is live; mencore is registered as approved and its ship state was not checked here. Owner decision: record shared_family_with and a reason in brand-registry.json, or move one brand. The Design Director session reported on 2026-11-11 that the owner delegated the call and it chose to move mencore; no palette or registry file reflects that yet, and palette_gate.py check still ends VERDICT BREACHED.
