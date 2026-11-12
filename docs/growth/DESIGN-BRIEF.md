# DESIGN-BRIEF: mas-ai /growth/ (branch feat/growth-service-2026-11, 2026-11-11)
<!-- Gate: python D:/agents/skills/mas-design-director/scripts/brief_check.py brief DESIGN-BRIEF.md -->

project: mas-ai
work_type: REFINE
surface: marketing
visitor_mode: persuade
audience: the owner of a trades or local service business in Ontario, arriving on a phone from a post, an ad or a message we sent, between jobs, wanting to know what this is, what it costs and what it will do to their accounts
primary_action: send the /start/ form with a growth option chosen
emotion: plain-spoken, exact, unhurried, in the owner's control
brand_status: provisional
brand_source: D:/Ideas/mas-ai/src/styles/tokens.css (locked dark theme, pass 3, 2026-09-30)
palette: D:/agents/skills/mas-design-director/references/archetypes/mas-ai.palette.json
fonts: Archivo / Archivo
craft_owner: impeccable
motion_authority: design-motion
goal: D:/Ideas/mas-ai/docs/growth/GOAL.md
owner_why: the site already ships its own system (tokens, service-page and work-page classes); this page adds no new visual language, so the craft job is restraint and fit, not invention
motion_why: the site-wide data-reveal entrance is the only motion; the page-head illustration is static and nothing new is added

## Evidence
| input | status | source |
|---|---|---|
| logo | observed | gold mark on black, public/brand/mark-64.png, mark-128.png and mark-master.png (raster, 537 px master). The service lockup is that mark, the name MAS-AI and the word Growth in gold after a hairline: the parent logo plus one word, not a second logo. Name and line locked by the owner on 2026-11-11 |
| tokens | observed | src/styles/tokens.css; gr-* block at the end of src/styles/work.css |
| interior and materials | n/a | software and services company |
| photography | missing | no photo of real client work exists; none is used and none is generated. The examples section shows three sample pieces for an invented heating business, drawn as type and flat shapes (no photo, no generated image), each carrying a SAMPLE tag. Source: D:/MAS-AI/growth-engine/var/renders/growth-page-samples-2026-11-11 |
| typography | observed | Archivo variable (width axis for display), JetBrains Mono for labels |
| approved claims | observed | DR-004 appendix AP5 and AP6 for the audit and pilot terms; every other line is new wording awaiting the owner |

## Preserve
- every colour, type and spacing token in tokens.css; no new colour
- the rule "colour is state, not decoration": gold = the gate and the primary action, green = running today, grey = by scope
- the site-wide contact label "Bring us a bottleneck" and its /start/ target
- service-page and work-page classes (svp-*, wk-*); page-specific rules stay inside the gr-* block
- noindex and no sitemap entry while GROWTH_INDEXABLE is false; no nav or footer link

## Section map
| # | section | question it answers | proof | action | media | motion reason | mobile |
|---|---|---|---|---|---|---|---|
| 1 | Page head | What is this and is it for a business like mine? | the name lockup and its line, then the audience, the place and the approval rule in the lead | Bring us a bottleneck; See how it starts | ApprovalBoard: a static illustration of one week's approval list for an example business, labelled as an illustration | none, static: it shows the approval step, the thing being sold | board stacks under the buttons |
| 2 | Does this sound like your week? | Do they understand my problem? | three situations, each tied to a count from the owner's own records | none, reading section | none | entrance only | single column, quotes first |
| 3 | One loop, every week | What would actually happen each week? | six named steps; the approval step is the only gold one | none | none | entrance only | vertical timeline |
| 4 | What a week's pieces look like | What does the output actually look like for a business like mine? | three sample pieces (short video, post, ad draft) for an invented heating business, the same three items as the approval list in the page head; the note says the business is invented, the video runs 15 seconds with a synthetic voice and plays on the page (press play, no autoplay, 0.9 MB fetched only on play, its poster is a frame of the video, every spoken word is on screen), and no client piece exists | none | one 15-second video (0.9 MB mp4 fetched on play, 720 by 1280 poster frame) and two 864 by 1080 webp stills, at one height | entrance only; the video plays on press, never by itself | one row that scrolls sideways |
| 5 | What the service covers | What do I get, and what is real today? | two tags: Running on mas-ai.co, By written scope; the note says no client results exist | none | none | entrance only | one column, tag under each part |
| 6 | What stays yours | Can I leave, and who holds my accounts and money? | accounts in the owner's name, ad spend on the owner's card, export on exit | none | key icon | entrance only | card first, list after |
| 7 | Leak Audit | What is the smallest first step and what are its terms? | DR-004 terms in full, including the no-gap case and the refund condition | anchor target of See how it starts | none | entrance only | terms list full width |
| 8 | Lead Response pilot | What if I already know the gap? | terms including start conditions that are not yet met | none | none | entrance only | terms list full width |
| 9 | What you approve | Where do I get to say no? | five approval points | none | none | entrance only | stacked rows |
| 10 | How we use AI | Is AI doing this without a person? | four statements, AI media labelled | none | none | entrance only | stacked |
| 11 | What this page does not show | Why are there no results or prices? | says so plainly | none | none | entrance only | stacked |
| 12 | Questions | The eight things asked before a form is sent | visible answers, same strings as the FAQPage data | none | none | native disclosure | full width |
| 13 | Call to action | What do I do now? | names the three form options | Bring us a bottleneck | none | entrance only | full-width button |

## Components
| component | size | label | contrast | depth | detail | motion |
|---|---|---|---|---|---|---|
| primary action (btn btn-primary) | min-height 44px (--tap) | Bring us a bottleneck | #0B0D0F on #D9A83E 8.92:1 | flat gold fill | site button radius, arrow icon | site hover only |
| secondary action (btn btn-ghost) | min-height 44px (--tap) | See how it starts | #F2EFE8 on #0B0D0F 16.95:1 | outline, no fill | same radius | site hover only |
| part status tag (gr-tag) | 8px square marker, mono label | Running on mas-ai.co / By written scope | #3DBE7A on #0B0D0F 8.20:1; #8E959E on #0B0D0F 6.44:1 | flat | filled square = live, outlined square = scope, so state does not depend on colour alone | none |
| loop step (gr-loop li) | 11px square dot, 3 columns from 900px | step name | gate step #D9A83E on #0B0D0F 8.92:1; others #F2EFE8 16.95:1 | flat, hairline connector | only the approval step is gold | entrance only |
| name lockup (gr-lockup) | mark 44px, name 24px, line 12px mono | MAS-AI Growth; AI marketing and advertising for local businesses | #F2EFE8 on #0B0D0F 16.95:1; #D9A83E on #0B0D0F 8.92:1; line #A9AFB7 on #0B0D0F 8.81:1 | flat | existing mark, hairline, service word in gold | none |
| approval item (gr-board__item) | 16px padding, title 19 to 22px | Short video, Post, Ad draft; Waiting for your yes, Approved, Sent back with your change | title #F2EFE8 on #171B20 15.06:1; meta #8E959E on #171B20 5.72:1; approved #3DBE7A on #171B20 7.29:1; waiting item on the gold wash #272622: gold 6.94:1, meta 5.01:1 | flat panel, gold border on the waiting item only | square marker filled = approved, outlined = other states, so state does not depend on colour alone; the Approve and Change marks are part of the illustration, not controls | none |
| sample piece (gr-samples img, video) | 448px high on a phone, 544px from 900px; widths follow each format | Short video, 15 seconds; Post; Ad draft | caption #8E959E on #0B0D0F 6.44:1. Inside the samples (their own palette, not page tokens): #F5EFE4 on #13233F 13.69:1, #13233F on #F5EFE4 13.69:1, #13233F on #E2572B 4.2:1 used only at 52px and larger | flat, hairline outline | alt text carries every word on the piece and says the business is invented; the scrolling row is a labelled, focusable region | entrance only |
| pricing word (gr-price) | clamp 40px to 72px | Fixed price | #D9A83E on #0B0D0F 8.92:1 | flat | no number printed (rule Y1) | none |
