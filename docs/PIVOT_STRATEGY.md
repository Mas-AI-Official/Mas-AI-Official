# The Pivot Strategy — MAS-AI Services + Products

**Author:** Claude (engineering partner) · **For:** Masoud · **Date:** 2026-04-19
**Lens:** Hormozi's Grand Slam Offer + $100M Leads frameworks, applied to your actual stack.

---

## TL;DR

**The pivot is correct. Execute with three adjustments:**

1. Lead with ONE offer on the homepage. The other offers are *mechanisms*, not siblings.
2. Double every price. Your current anchors signal "broke solo founder," not "built $10M of tech."
3. Add a guarantee that scares you. No risk reversal = no conversion.

---

## Why this pivot wins (the math)

| Constraint | Product-only | Services + Product (this pivot) |
|---|---|---|
| Time to first dollar | 6–12 months | 2–4 weeks |
| Evidence for investors | "Tests passing" | "$X revenue from Y customers" |
| Distribution path | 53k-star fight against Paperclip | Referrals + case studies |
| PMF signal | 50 GitHub stars | "Customer paid $22k" |
| Solo-founder viability | Low (need 20+ customers to survive) | High (3 customers = $66k) |

You're not pivoting *away* from Daena. You're pivoting the **go-to-market**, not the product.

---

## Why Hormozi's framework applies

You're a technical founder selling to non-technical buyers (CISOs, COOs, CEOs).
Technical-founder copy is usually "here's what it does." Hormozi's copy is
"here's what you get, how fast, and what happens if it doesn't work." The
second one sells.

### The Value Equation (memorize this)

```
           Dream Outcome  ×  Perceived Likelihood of Achievement
VALUE  =   ─────────────────────────────────────────────────────
                 Time Delay  ×  Effort & Sacrifice
```

Your current copy talks about **tech specs** (which live nowhere in this
equation). Every sentence on a sales page should move ONE of these four
levers, or it should be deleted.

### Applied to your three service categories

| Lever | Automation copy should say… | Consulting copy should say… |
|---|---|---|
| ↑ Dream outcome | "Your team ships AI without your CISO blocking it" | "You find every exploit before Black Hat attendees do" |
| ↑ Perceived likelihood | "3,086 tests. 2 patents. 60 capabilities." | "25+ exploit signatures. Zero-FP gate. Proof-of-exploit on every finding." |
| ↓ Time delay | "Deployed in 2 weeks" | "Results in 5 business days" |
| ↓ Effort & sacrifice | "We install on your hardware. You approve. Done." | "Give us a URL. We do the rest." |

---

## The three adjustments

### Adjustment 1 — ONE offer on the homepage

Right now the homepage says "MAS-AI has two products AND two services." That's
four things the visitor has to parse. Confused buyers don't buy.

**Pick one as THE offer.** My recommendation: **Automation** as primary,
Consulting as secondary free-value hook. Why:

- Automation is the higher-ticket engagement (bigger deals).
- Consulting free-value ("free recon") is the perfect *lead magnet* for the
  automation pipeline — it gets them on a call where you sell the bigger package.
- Daena + Klyntar become the *mechanism* that makes the automation credible,
  not siblings competing for attention.

### Adjustment 2 — Double every price

Current:
- Automation Quick Install: $1,500 – $4,000
- Automation Build: $6,000 – $18,000
- Security Single Scan: $2,500 – $7,500

New (what you should actually charge):
- Automation Quick Install: **$5,000 – $12,000**
- Automation Build: **$18,000 – $45,000**
- Security Single Scan: **$7,500 – $22,000**
- Managed Operator retainer: **$9,000 / mo** (from $3,500)

**Why it works:** Price *is* positioning. A $1,500 install is a freelancer
job. A $12,000 install is a boutique agency. Your buyers aren't price-
sensitive — they're *risk*-sensitive. Higher price + stronger guarantee =
more trust, not less. Hormozi's rule: *if nobody complains about your price,
it's too low.*

### Adjustment 3 — A guarantee that scares you

Pick ONE. Here are three candidates (strongest → safest):

1. **"100% money-back if we don't ship in 3 weeks."** Scariest. Highest conversion.
2. **"Free 2-hour security recon. If we don't find 3 fixable issues, you pay nothing — ever."** Medium scare. Lead-magnet friendly.
3. **"First week free. If you don't see a working demo by Friday, we stop work and refund."** Low scare. Still converts better than no guarantee.

TODO (Masoud): pick which one you're willing to stand behind. This is NOT a
copy decision — it's a cash-flow and risk decision only you can make.

---

## The anti-sell (who this is NOT for)

Hormozi's leads framework: *tell people who this isn't for, and the right
people lean in.*

Draft (TODO Masoud to validate):

> This is NOT for:
> - Teams who need to ship AI in 48 hours (we do it right, not fast).
> - Companies who want to "see the contract first" (we work on trust; you'll see our code first).
> - Anyone who thinks $3k is a lot for software that runs their business (you're not our buyer).

The point isn't to exclude — it's to *filter*. The rest of your page converts
better because the tire-kickers have self-selected out.

---

## The primary avatar (pick ONE)

Every piece of copy gets sharper when it's written to one person. Candidates
based on your network + context:

1. **"Dev-led SaaS founder, Series A–C, 10–50 eng team."** They want Claude Code,
   their CISO hasn't approved it, they ship fast, they'll pay.
2. **"Operations VP at a 50–200 person mid-market company."** They see AI
   hype but have no deployment plan. They need a safe first win.
3. **"CTO/security lead at a regulated fintech/healthtech."** High governance
   bar, willing to pay for compliance, sticky customer.

TODO (Masoud): pick ONE. Your copy, your emails, your LinkedIn — all get
10x sharper when there's ONE face in mind when you write.

---

## What I'm changing in the code

1. **Hero** — adds a risk reversal ribbon + named enemy (12-week consultancies) + specific timeframe.
2. **New `GrandSlamOffer` component** — the Hormozi anchor + bonus stack + guarantee + urgency block, reusable on both /automation and /consulting.
3. **Service catalog cards** — one example on each page rewritten in the full Hormozi pattern (dream outcome → mechanism → timeframe → risk reversal) so you can clone the pattern.
4. **Email Template A** — full hook-frame-offer rewrite as the template for the other two.

Three spots get marked `TODO(Masoud)` where only you can write the line.
