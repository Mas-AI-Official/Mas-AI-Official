# Changelog - Mas-AI Website Redesign

## January 26, 2025

### 🚨 CRITICAL SECURITY FIX
- **Removed sensitive files**: Deleted `id_rsa`, `id_rsa.ppk`, and `SSH Pass.txt` from repository
- **Created `.gitignore`**: Added comprehensive ignore rules for sensitive files, certificates, and secrets
- **Created `SECURITY.md`**: Added security policy with rotation instructions for compromised credentials
- **⚠️ IMPORTANT**: These files were previously committed to git history. Consider using `git filter-branch` or BFG Repo-Cleaner to remove them from history.

### 🎨 Design & UX Improvements

#### Premium Glass UI
- Implemented dark glassmorphism design with subtle borders and soft blur effects
- Updated color scheme with refined glass card backgrounds (`rgba(10, 12, 16, 0.85)`)
- Enhanced spacing and typography for premium SaaS feel
- Improved mobile-first responsive design

#### Navigation
- **Sticky navbar** with premium scroll state (like aikido.dev):
  - Shrinks from 80px to 64px on scroll
  - Increases blur and opacity on scroll
  - Adds border and shadow on scroll
  - Smooth transitions with cubic-bezier easing
- **Layout**: Logo left, nav center, CTA right (desktop)
- **Mobile**: Burger menu with improved styling

#### Metatron Background Optimization
- Created `metatron-hex-network-optimized.js`:
  - Lower intensity on mobile (30% vs 100%)
  - Pauses animation when tab is hidden (visibility API)
  - Fewer layers on mobile for better performance
  - Reduced glow intensity on mobile devices

### 📐 Information Architecture

#### New Section Order
1. **Hero**: "Mas-AI Technologies Inc." + positioning statement + CTAs (Launch Daena Demo, See Architecture)
2. **Platform Pillars**: Governance, Orchestration, Security/Observability
3. **Portfolio**: Character-like tiles with staggered scroll reveals (Daena as blueprint)
4. **Use Cases**: 5 cards (Enterprise Operations, Business Intelligence, Compliance, Customer Service, Content Operations)
5. **Proof Strip**: Metrics + credibility (48+ Agents, 60%+ Cost Savings, 99.4% Accuracy, Google Startup Program, 2 Patents Pending)
6. **Founder**: Short version (2-3 lines) with links to full resume
7. **Contact**: Email + Book a Call + floating chat bubble

#### Removed/Simplified
- Removed long "resume-style" founder content from homepage
- Moved full founder details to downloadable PDF resume
- Simplified hero messaging

### ⚡ Performance & Accessibility

#### Scroll Reveal System
- Implemented IntersectionObserver-based scroll animations
- Added `.reveal` and `.is-visible` classes
- Staggered timing with `.reveal-delay-1` through `.reveal-delay-5`
- **Respects `prefers-reduced-motion`**: Animations disabled for users who prefer reduced motion

#### Performance Optimizations
- Throttled scroll events with `requestAnimationFrame`
- Optimized Metatron background for mobile
- Reduced motion on mobile devices
- Lazy reveal animations only trigger when elements enter viewport

### 🔧 Technical Changes

#### Files Modified
- `index.html`: Complete redesign with new section structure
- `metatron-hex-network-optimized.js`: New optimized version (original kept as backup)

#### Files Created
- `.gitignore`: Comprehensive ignore rules
- `SECURITY.md`: Security policy and rotation instructions
- `metatron-hex-network-optimized.js`: Performance-optimized background animation
- `CHANGELOG.md`: This file

#### Files Deleted
- `id_rsa`: SSH private key (security risk)
- `id_rsa.ppk`: SSH private key (security risk)
- `SSH Pass.txt`: Password file (security risk)

### 📱 Mobile Optimizations
- Reduced Metatron animation intensity (30% on mobile)
- Fewer animation layers on mobile
- Improved touch targets and spacing
- Chat bubble hides text on mobile, shows icon only
- Responsive grid layouts for all sections

### 🎯 SEO Updates
- Updated page title: "Mas-AI Technologies Inc. | Premium AI Platform"
- Updated meta description to reflect new positioning
- Maintained all existing structured data (JSON-LD)
- Preserved OpenGraph and Twitter Card tags

### 📝 Next Steps (Pending)
- [ ] Update `investors.html` with new navbar/footer
- [ ] Update `naturenlp.html` with new navbar/footer
- [ ] Update `contentops.html` with new navbar/footer
- [ ] Validate `sitemap.xml` remains correct
- [ ] Test all pages for consistency

### 🐛 Known Issues
- Daena Spotlight section still exists but may be redundant with Platform Pillars (consider removing)
- Some old CSS classes may still exist but are unused

### 💡 Design Philosophy
- **Premium SaaS feel**: Dark glass panels, subtle borders, elegant spacing
- **Performance-first**: Optimized animations, reduced motion support, mobile-friendly
- **Content hierarchy**: Clear section flow from hero to contact
- **Accessibility**: Respects user preferences, semantic HTML, proper contrast

---

**Note**: This redesign maintains static HTML/CSS/JS architecture as requested. No framework migration was performed.
