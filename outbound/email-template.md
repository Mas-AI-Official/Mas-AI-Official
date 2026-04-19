# Outbound Email Templates — MAS-AI AI Security Architect

Three templates. Pick one per send, never mix. Every send needs the ONE
**TODO(Masoud)** specific-observation line rewritten for that prospect. If
you can't write one honest sentence about them, don't send.

Sending from: `masoud.masoori@mas-ai.co`

---

## Template A — Architect pitch (PRIMARY — Hormozi hook-frame-offer)

**Target:** CTO / CISO / Head of Security / AI Lead at companies that have
shipped AI features in production but haven't done a real AI-era audit.

### Anatomy

- **Hook** (subject + line 1): specific observation + named enemy
- **Frame** (3 lines): their pain, their current options, why those options fail
- **Offer** (3 lines): the free audit — what + when + what it costs (nothing)
- **CTA** (1 line): binary yes/no
- **P.S. (1 line):** the one-line proof that might earn the reply

### Subject lines (A/B/C — rotate monthly)

- `I ran 2 hours of security against [domain] this morning` ← highest open rate in tests
- `3 holes in [their AI feature name] — free, no meeting`
- `Before your Aug 2 deadline — one question`

### Body

> Hey [First name],
>
> I spent the last 2 hours running Klyntar against [company-domain] — the
> AI security platform I built. Three things came up that you&apos;d probably
> want to see.
>
> **TODO(Masoud):** the one-line specific observation. Examples:
> - "Your chatbot at [URL] accepts {{system:ignore}} unsanitized — I can show you the jailbreak in 2 lines."
> - "Your API key for [vendor] is leaking in a JS bundle at [path] — dangling since [date]."
> - "Your RAG pipeline at [URL] re-emits the source document verbatim on a specific prompt — that's your training data or customer PII."
>
> Most &ldquo;AI security consultancies&rdquo; ship you a 100-page scanner dump
> for $80k. That's not what I do. I built Klyntar for my own product (two
> USPTO patents in AI governance; 25+ exploit signatures; Zero-FP gate) —
> so I know the 3 findings on your stack that would actually matter in a
> real attacker&apos;s hands.
>
> **I'll send you the redacted 1-pager today. Free. No meeting. 48-hour
> turnaround. No CC, no Calendly, no follow-up sequence.** If it&apos;s
> useful and you want the full engagement, we talk. If not, we don&apos;t.
>
> Reply &ldquo;send it&rdquo; and you&apos;ll have the findings by Friday.
> Reply &ldquo;not now&rdquo; and I disappear.
>
> — Masoud
> AI Security Architect · MAS-AI Technologies Inc.
> mas-ai.co/security
>
> **P.S.** I built both the governance side (Daena, 2,956 tests, 60 agent
> capabilities) and the attack side (Klyntar). That&apos;s the whole reason
> the free recon isn&apos;t a pitch — it&apos;s the demo.

### Why this email converts (Hormozi lever map)

| Line | Lever |
|---|---|
| Subject "I ran 2 hours of security against [domain]" | ↑ Curiosity + ↑ Specificity |
| Line 1 naming their domain + a 2-hour time reference | ↑ Authority + believability |
| The TODO specific observation | ↑ Perceived likelihood of outcome |
| "Most AI security consultancies ship a 100-page scanner dump for $80k" | ↑ Named enemy |
| "Two USPTO patents… 25+ exploit signatures… Zero-FP gate" | ↑ Unique mechanism |
| "Free. No meeting. 48-hour turnaround." | ↓ Effort, ↓ Time delay, ↓ Risk |
| "Reply 'send it' / 'not now'" | ↓ Effort (binary) |
| P.S. "I built both the governance side and the attack side" | ↑ Authority (the real one) |

---

## Template B — AI Act Readiness (DEADLINE-DRIVEN)

**Target:** Companies with any AI-adjacent feature in the EU market. If
they ship to EU customers and their website has an AI-era feature, they&apos;re
in scope.

### Subject lines

- `[First name] — 90 days to the AI Act deadline. Quick scoping?`
- `AI Act Article 9 for [Company]: are you in or out of scope?`

### Body

> Hi [First name],
>
> August 2, 2026 is the EU AI Act enforcement deadline. €35M max penalty
> or 7% of global annual turnover for non-compliance.
>
> [One specific observation — e.g., "I see [Company] ships [AI product]
> to EU customers" or "You just announced an AI feature at [launch
> date] — that puts you in scope if it&apos;s a decision-supporting system."]
>
> I run a fixed 2-week sprint that gets you from &ldquo;maybe in scope&rdquo;
> to documented, regulator-ready artifacts: Article 9 risk management,
> Article 11 technical documentation, Article 12 audit trail (pre-wired via
> Daena), Article 14 human oversight. $18,000, fixed scope.
>
> Start with a 30-min scoping call. If you&apos;re NOT in scope, I send you
> a one-pager explaining why — free, no sales follow-up.
>
> Calendar: https://calendly.com/masoud-masoori
>
> — Masoud
> mas-ai.co/ai-act-readiness

---

## Template C — Warm reactivation (NETWORK)

**Target:** People in your network who know you from Daena/pre-pivot. Do
NOT mass-send this. One per person, one-to-one.

### Subject

- `Quick update — new thing I&apos;m doing`

### Body

> Hey [First name],
>
> Short update. You knew me when I was heads-down on Daena — that&apos;s
> still the flagship (v3.7, 2,956 tests, 2 USPTO patents filed). Here&apos;s
> what&apos;s new.
>
> I&apos;m now running AI security engagements under the MAS-AI banner.
> I built Klyntar — the security layer that ships with Daena — and clients
> are asking me to bring it to their stack. So I am. Fixed-scope audits,
> founder-led, 5-day turnaround on the initial recon.
>
> Two asks, pick any:
>
> 1. If you know a CTO / CISO / Head of AI who needs a second set of eyes
>    on their AI security posture, an intro is gold.
> 2. If you want me to run a free 2-hour recon on your own stack (no
>    strings, no pitch deck), I&apos;m doing 5 of those a week until I
>    hit capacity.
>
> — Masoud
> mas-ai.co/security

---

## Follow-up (send 5 business days after first send, once per prospect)

> Hi [First name] — quick bump. The free recon offer stands. If the
> timing is off, reply &ldquo;not now&rdquo; and I&apos;ll take you off the
> list. If you want the 3 findings I&apos;d send regardless, reply
> &ldquo;send it&rdquo; and you&apos;ll have them by Friday. — M

---

## Sending rules

1. **1 email per prospect per quarter, max 2 in a sequence.** No spam.
2. **Every send needs the TODO(Masoud) line written fresh.** If you can&apos;t
   write one honest sentence, don&apos;t send.
3. **If they reply &ldquo;send it&rdquo; — do it in 48 hours. No exceptions.**
   A slow recon kills the hook.
4. **Track every send** in a simple Google Sheet: `sent_at`, `replied`,
   `booked`, `closed`. You&apos;ll need this for pipeline review.
5. **Respond to replies within 4 business hours.**

---

## Signature block (paste into Gmail)

```
Masoud Masoori
AI Security Architect · MAS-AI Technologies Inc.
masoud.masoori@mas-ai.co  ·  mas-ai.co/security

Daena (governed AI)  ·  Klyntar (security fortress)  ·  2 USPTO patents filed
Registered Bugcrowd researcher
```
