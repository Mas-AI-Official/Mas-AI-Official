# AI Visibility Strategy — MAS-AI Technologies

**Goal:** When someone asks ChatGPT, Perplexity, Claude, Gemini, or Google AI Overviews about governed AI, AI security audits, AI agent installation, or AI compliance, MAS-AI appears in the answer with a citation link back to our site.

**Last updated:** 2026-04-19

---

## What matters in 2026 (research-backed)

Based on peer-reviewed research and verified practitioner reports in Q1 2026:

1. **Traditional SEO still drives AI citations.** Sites that rank well in Google are the same ones ChatGPT Search, Perplexity, and Claude cite. AI overlay engines do not have separate ranking systems. They read the top 5-20 organic results.
2. **llms.txt is nice-to-have, not a ranking signal.** Perplexity and Claude read it, Google and OpenAI have not committed. Implement as forward-compat.
3. **Entity disambiguation via structured data is the biggest single lever.** Schema.org with `sameAs` links to LinkedIn, GitHub, Wikidata improves AI's ability to resolve "MAS-AI Technologies" as a distinct entity. Entities get cited; strings get ignored.
4. **Content parity is strictly enforced.** If schema says "$18,000" but the rendered page says "$30,000," Google flags it as "Spammy Structured Data" and the site gets penalized.
5. **Fresh, specific, factual content beats generic content.** "2,956 tests passing" is more citable than "comprehensive testing."

---

## What we have implemented (done)

### Schema.org JSON-LD graph (`src/app/layout.tsx`)

Comprehensive `@graph` with stable `@id` values on:

- **Organization + ProfessionalService** — MAS-AI Technologies Inc. with `knowsAbout` (18 entities), `sameAs` (GitHub, LinkedIn, Daena, Toronto Starts), `makesOffer` linking to three services, `owns` linking to Daena, Klyntar, and both patents
- **Person (Founder)** — Masoud Masoori with credentials, education, `sameAs`, languages, nationality
- **SoftwareApplication + Product (Daena)** — version, feature list, 3-tier offers
- **SoftwareApplication + Product (Klyntar)** — `isPartOf` Daena (proves the security-layer relationship)
- **Service (×3)** — /automation, /security, /ai-act-readiness each with `AggregateOffer` price ranges
- **CreativeWork (×2)** — both USPTO patents with filing dates and identifiers
- **WebSite** — with `SearchAction` potential action

### FAQPage schema (`/book`)

Six Q&As match the visible FAQ exactly. Drives Google AI Overviews citations and Perplexity Q&A answers.

### BreadcrumbList schema (`/book`)

Supports Google breadcrumb rich result + helps AI search place the page in hierarchy.

### robots.txt (`public/robots.txt`)

Explicit `Allow: /` for every major AI crawler:

- OpenAI: `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`
- Google: `Googlebot`, `Google-Extended`
- Anthropic: `ClaudeBot`, `anthropic-ai`, `Claude-Web`
- Perplexity: `PerplexityBot`
- Common Crawl: `CCBot`
- Apple: `Applebot`, `Applebot-Extended`
- Microsoft: `Bingbot`
- Mistral: `MistralAI-User`
- Meta: `FacebookBot`, `Meta-ExternalAgent`
- Amazon: `Amazonbot`
- ByteDance: `Bytespider`
- You.com: `YouBot`
- DuckDuckGo, Yandex, Baidu

**Note**: This allows training crawlers, not just search crawlers. For a pre-revenue services firm, discovery beats defense. Revisit this when we hit real revenue.

### llms.txt + llms-full.txt (`public/`)

Short summary at `/llms.txt`. Full reference at `/llms-full.txt`. Perplexity and Claude read these; others may adopt.

Content: canonical company facts, product positioning against competitors, patent references, service descriptions with pricing, key dates. Written to be LLM-quotable (factual, short sentences, no marketing fluff).

### sitemap.xml (`public/sitemap.xml`)

All 8 URLs with `lastmod`, `changefreq`, `priority`. Includes `/security`, `/automation`, `/book`, `/ai-act-readiness`, and the Daena sub-site.

### Page-level metadata (each `page.tsx`)

Every service page has: `title`, `description`, `keywords`, OpenGraph tags, canonical URL.

---

## What drives AI citations (in priority order)

1. **Entity resolution.** Claude or Perplexity needs to know "MAS-AI Technologies" is a specific thing. Our `sameAs` links to GitHub, LinkedIn, and `knowsAbout` fields give them structured entity identity.
2. **Factual density.** Our `llms.txt` + JSON-LD list specific, verifiable facts (patent numbers, founding date, test counts, dollar amounts). LLMs prefer specific facts over vague claims.
3. **Third-party signals.** LinkedIn page, GitHub organization, Toronto Starts listing, Google for Startups membership. AI systems cross-reference these.
4. **Content freshness.** `lastmod` on sitemap, `datePublished` on patents, visible timestamps in content. AI systems down-rank stale content.
5. **Author authority.** Person schema with credentials makes Masoud Masoori a resolvable expert entity.

---

## What's missing (next sprint)

### High-priority (do this month)

1. **Wikidata entry** for MAS-AI Technologies. Apply at wikidata.org. Link our `sameAs` once approved. This is the single highest-impact free entity anchor.
2. **Crunchbase profile**. Free tier. Add to `sameAs`.
3. **Google Business Profile**. Local entity signal for Ontario searches.
4. **GitHub README** for each public repo with clear product descriptions (Daena README is already strong; audit others).
5. **LinkedIn company page** (separate from founder's personal). Required for Crunchbase cross-reference and LinkedIn Sales Navigator.

### Medium-priority

6. **Guest posts / third-party mentions**. Hacker News Show HN for Daena OSS (when it ships). dev.to / Medium posts about governed AI. Podcast appearances. Every external mention with `mas-ai.co` backlinks reinforces entity resolution.
7. **Case studies** with named clients (post-revenue). Add `Review` schema once we have them.
8. **Blog / changelog** at `/blog`. Factual, dated, technical posts about product milestones. Fresh content is an AI citation signal.
9. **Open Graph images** per page. Currently homepage has `og-image.png`; service pages inherit. Ideally each service has its own OG image.
10. **Accessibility audit** (WCAG 2.1 AA). AI systems down-rank inaccessible sites as a trust signal.

### Low-priority (do later)

11. **Video transcripts** on YouTube for demo videos. YouTube is an LLM training source. Transcripts get indexed.
12. **AMA / Reddit threads** where Masoud answers questions. LLMs quote Reddit heavily.
13. **arxiv.org paper** on PhiLattice or NBMF (once patents are granted). Academic citation is the gold standard for LLM reference.

---

## Monitoring

Weekly checks:

1. **Google Search Console** — monitor Impressions, Clicks, Position for key queries: "governed AI", "AI security audit", "MAS-AI", "Daena AI", "Klyntar". Add the site to Search Console if not already.
2. **Bing Webmaster Tools** — separate index, covers Copilot and ChatGPT Search.
3. **Test AI citations manually**:
   - Ask ChatGPT Search: "What is MAS-AI Technologies?"
   - Ask Perplexity: "Best AI governance platforms 2026"
   - Ask Claude: "Who is Masoud Masoori?"
   - Ask Gemini: "AI security audit services Ontario"

Record whether MAS-AI appears in answers. Track weekly. If we do not appear after 30 days of indexing, escalate priority on entity disambiguation and third-party signals.

4. **Rich Results Test** — https://search.google.com/test/rich-results — validates our schema renders correctly.
5. **Schema Validator** — https://validator.schema.org — catches JSON-LD errors.

---

## Implementation checklist (current state)

- [x] robots.txt allows all AI crawlers (including training)
- [x] llms.txt summary
- [x] llms-full.txt full reference
- [x] sitemap.xml with all 8 URLs
- [x] JSON-LD graph with Organization, Person, Product (×2), Service (×3), Patents (×2), WebSite
- [x] Stable `@id` values for entity linking
- [x] `sameAs` links to GitHub + LinkedIn
- [x] `knowsAbout` on Organization (18 entities)
- [x] FAQPage schema on /book
- [x] BreadcrumbList on /book
- [x] Page-level metadata (title, description, OG, canonical)
- [x] Multi-language `availableLanguage` on contactPoint
- [ ] Wikidata entry (pending user action)
- [ ] Crunchbase profile (pending user action)
- [ ] Google Business Profile (pending user action)
- [ ] LinkedIn company page (pending user action)
- [ ] OG images per service page (nice-to-have)
- [ ] /blog with changelog posts (sprint 2)
- [ ] Case study markup with Review schema (post-first-customer)

---

## Sources

- [Derivatex — LLMs.txt Complete Guide for SEO and AI Search 2026](https://derivatex.agency/blog/llms-txt-guide/)
- [SearchSignal — llms.txt in 2026: What It Does and Doesn't Do](https://searchsignal.online/blog/llms-txt-2026)
- [Incremys — Schema.org for SEO: Ready-to-Use JSON-LD Examples 2026](https://www.incremys.com/en/resources/blog/schema-seo)
- [Digital Applied — Schema Markup After March 2026 Update](https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies)
- [BigCloudy — llms.txt for Websites Complete 2026 Guide](https://www.bigcloudy.com/blog/what-is-llms-txt/)
- [Beamtrace — LLM Ranking Factors 2026](https://beamtrace.com/blog/llm-ranking-factors-how-llms-rank-content-2026)
- [Schema.org vocabulary](https://schema.org/)
- [llmstxt.org specification](https://llmstxt.org)
