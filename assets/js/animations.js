(() => {
  const CONFIG = {
    reveal: {
      y: 26,
      blurFrom: 8,
      duration: 0.8,
      ease: "power3.out",
      start: "top 85%",
    },
    stagger: {
      each: 0.08,
    },
    navbar: {
      scrollY: 24,
    },
    pinStory: {
      start: "top top",
      end: "+=2200",
      scrub: 0.9,
    },
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (isTouch && window.innerWidth < 700);

  function qs(sel, root = document){ return root.querySelector(sel); }
  function qsa(sel, root = document){ return Array.from(root.querySelectorAll(sel)); }

  function initMobileNav() {
    const btn = qs("[data-mobile-nav]");
    const panel = qs("[data-mobile-nav-panel]");
    const hero = qs(".hero");
    if (!btn || !panel) return;

    const updateSpacing = (isOpen) => {
      if (hero) {
        if (isOpen) {
          // Wait for menu to expand, then calculate height
          setTimeout(() => {
            const menuHeight = panel.scrollHeight || panel.offsetHeight;
            hero.style.marginTop = `${60 + menuHeight}px`;
            hero.style.transition = "margin-top 0.3s ease";
          }, 50);
        } else {
          hero.style.marginTop = "60px";
        }
      }
    };

    btn.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      updateSpacing(open);
    });

    // close on link click
    qsa("a", panel).forEach(a => a.addEventListener("click", () => {
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      updateSpacing(false);
    }));

    // Handle window resize
    window.addEventListener("resize", () => {
      if (panel.classList.contains("is-open")) {
        updateSpacing(true);
      }
    });
  }

  function initNavbarShrink() {
    const header = qs("#siteHeader");
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > CONFIG.navbar.scrollY) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Small global perf wins
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.ticker.lagSmoothing(1000, 16);

    initReveals();
    initStaggers();
    initCounters();
    initDaenaOSStory();
    initPortfolioAnimation();
    initNavbarScrollSpy();
    initProblemSection();
  }

  function initNavbarScrollSpy() {
    const navLinks = qsa(".nav-links a");
    if (!navLinks.length) return;

    const updateActiveLink = () => {
      const scrollY = window.scrollY + 150;
      
      // Map nav links to sections
      const linkSectionMap = {
        "#daena-os": "#daena-os",
        "#portfolio": "#portfolio",
        "#usecases": "#usecases",
        "/investors.html": null, // External link
        "#contact": "#contact"
      };
      
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        const sectionId = linkSectionMap[href];
        
        if (!sectionId) {
          link.classList.remove("is-active");
          return;
        }
        
        const section = qs(sectionId);
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          navLinks.forEach(l => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    };

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
  }

  function initReveals() {
    const els = qsa("[data-reveal]");
    if (!els.length) return;

    els.forEach(el => {
      if (prefersReduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
        return;
      }

      // Ensure element is visible for ScrollTrigger
      gsap.set(el, {
        opacity: 0,
        y: CONFIG.reveal.y,
        filter: `blur(${CONFIG.reveal.blurFrom}px)`
      });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: CONFIG.reveal.duration,
        ease: CONFIG.reveal.ease,
        scrollTrigger: {
          trigger: el,
          start: CONFIG.reveal.start,
          toggleActions: "play none none none",
          once: false
        }
      });
    });
  }

  function initProblemSection() {
    const problemSection = qs("#problem");
    if (!problemSection) return;

    const title = problemSection.querySelector(".section-title");
    if (!title) return;

    if (prefersReduced) {
      return;
    }

    // Animate title with word stagger
    const words = title.textContent.split(" ");
    title.innerHTML = words.map((word, i) => 
      `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${word}</span>`
    ).join(" ");

    const wordSpans = title.querySelectorAll("span");
    gsap.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        once: true
      }
    });
  }

    function initStaggers() {
    const groups = qsa("[data-stagger]");
    if (!groups.length) return;

    groups.forEach(wrap => {
      const kids = Array.from(wrap.querySelectorAll("[data-reveal]"));
      if (!kids.length) return;

      if (prefersReduced) {
        kids.forEach(c => {
          c.style.opacity = "1";
          c.style.transform = "none";
          c.style.filter = "none";
        });
        return;
      }

      // Set initial state for all children
      gsap.set(kids, {
        opacity: 0,
        y: 18,
        filter: `blur(${CONFIG.reveal.blurFrom}px)`
      });

      gsap.to(kids, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: CONFIG.stagger.each,
        scrollTrigger: {
          trigger: wrap,
          start: "top 80%",
          toggleActions: "play none none none",
          once: false
        }
      });
    });
  }

  function initPortfolioAnimation() {
    const portfolioGrid = qs(".grid-portfolio");
    if (!portfolioGrid) return;

    const cards = Array.from(portfolioGrid.querySelectorAll(".card"));
    if (!cards.length) return;

    // Ensure Daena is first
    const daenaCard = cards.find(card => card.textContent.includes("Daena"));
    if (daenaCard && cards.indexOf(daenaCard) !== 0) {
      portfolioGrid.insertBefore(daenaCard, cards[0]);
      cards.splice(cards.indexOf(daenaCard), 1);
      cards.unshift(daenaCard);
    }

    if (prefersReduced) {
      cards.forEach(card => {
        card.classList.add("is-visible");
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      });
      return;
    }

    // Set initial state - cards start from behind (small, far back)
    gsap.set(cards, {
      opacity: 0,
      scale: 0.75,
      z: -300,
      transformPerspective: 1200
    });

    // Animate cards coming from behind to front sequentially (Daena first)
    cards.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        z: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.15,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
          onEnter: () => {
            card.classList.add("is-visible");
          }
        }
      });
    });
  }

  function initCounters() {
    const els = qsa(".countup");
    if (!els.length) return;

    els.forEach(el => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const isFloat = String(target).includes(".");

      if (prefersReduced) {
        el.textContent = (isFloat ? target.toFixed(1) : String(Math.round(target))) + suffix;
        return;
      }

      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        },
        onUpdate: () => {
          el.textContent = (isFloat ? obj.val.toFixed(1) : String(Math.round(obj.val))) + suffix;
        }
      });
    });
  }

  function initDaenaOSStory() {
    const wrap = qs("#daenaOSStory");
    const steps = qsa(".daena-step");
    const nodes = qsa(".daena-orbit-node");
    if (!wrap || !steps.length) return;

    // Step mapping: node index -> step index
    // Node 0 (Sunflower) -> Step 1 (Sunflower)
    // Node 1 (Honeycomb) -> Step 2 (Honeycomb)
    // Node 2 (Agent Swarms) -> Step 3 (Agent Swarms)
    // Node 3 (Audit Trail) -> Step 4 (Audit Trail)
    // Step 0 is "Sunflower + Honeycomb" (default, no node)
    const nodeToStepMap = {
      0: 1, // Sunflower node -> Step 1
      1: 2, // Honeycomb node -> Step 2
      2: 3, // Agent Swarms node -> Step 3
      3: 4  // Audit Trail node -> Step 4
    };

    // Layout orbit nodes in circle - proper positioning
    function layoutOrbitNodes() {
      if (!nodes.length) return;
      const orbit = qs("#daenaOrbit");
      if (!orbit) return;
      
      const centerX = 50;
      const centerY = 50;
      const radius = 38; // percentage from center
      
      nodes.forEach((node, i) => {
        // Start from top, go clockwise
        const angle = (Math.PI * 2 * i) / nodes.length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        node.style.left = x + "%";
        node.style.top = y + "%";
        node.style.transform = "translate(-50%, -50%)";
      });
    }
    
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", layoutOrbitNodes);
    } else {
      layoutOrbitNodes();
    }
    window.addEventListener("resize", layoutOrbitNodes);

    // Set active step
    function setStep(stepIndex) {
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === stepIndex);
      });
      // Update nodes based on step
      nodes.forEach((node, nodeIndex) => {
        const mappedStep = nodeToStepMap[nodeIndex];
        node.classList.toggle("is-active", mappedStep === stepIndex);
      });
    }

    // Click handlers - fix mapping
    nodes.forEach((node, nodeIndex) => {
      node.addEventListener("click", () => {
        const stepIndex = nodeToStepMap[nodeIndex];
        if (stepIndex === undefined) return;
        
        if (prefersReduced) {
          setStep(stepIndex);
          return;
        }
        setStep(stepIndex);
        // Scroll to show the step
        const step = steps[stepIndex];
        if (step) {
          step.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });

    if (prefersReduced) {
      setStep(0);
      return;
    }

    // Calculate total height needed for all steps
    const stepHeight = window.innerHeight * 0.8; // 80vh per step
    const totalHeight = stepHeight * steps.length;

    // Pin the section and animate steps
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: `+=${totalHeight}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        // Map progress to step index (0 = Sunflower+Honeycomb, 1-4 = individual)
        let stepIndex = 0;
        if (progress < 0.2) stepIndex = 0; // Sunflower+Honeycomb
        else if (progress < 0.4) stepIndex = 1; // Sunflower
        else if (progress < 0.6) stepIndex = 2; // Honeycomb
        else if (progress < 0.8) stepIndex = 3; // Agent Swarms
        else stepIndex = 4; // Audit Trail
        
        setStep(stepIndex);
      }
    });

    // Initial state - show Sunflower + Honeycomb
    setStep(0);
  }

  function initPinnedStory() {
    const wrap = qs("#daenaStory");
    const title = qs("#storyTitle");
    const desc = qs("#storyDesc");
    const video = qs("#storyVideo");
    const buttons = qsa(".blueprint-btn");

    if (!wrap || !title || !desc) return;

    const steps = [
      { 
        title: "Sunflower governance", 
        desc: "Policies, roles, and constraints that prevent drift and enforce accountable autonomy.",
        at: 0.00 
      },
      { 
        title: "Honeycomb departments", 
        desc: "Agents organized as departments for scalable execution and cross-hive collaboration.",
        at: 0.33 
      },
      { 
        title: "Agent swarms", 
        desc: "Parallel routing, model switching, and conflict resolution for real work.",
        at: 0.66 
      },
      { 
        title: "Audit trail", 
        desc: "Every decision is traceable. Logs, evidence, and outcomes remain reviewable.",
        at: 0.90 
      }
    ];

    // Set active step
    function setStep(stepIndex) {
      const step = steps[stepIndex];
      if (!step) return;
      
      title.textContent = step.title;
      desc.textContent = step.desc;
      
      buttons.forEach((btn, i) => {
        btn.classList.toggle("is-active", i === stepIndex);
      });
    }

    // Click handlers for blueprint buttons
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (prefersReduced) {
          setStep(i);
          return;
        }
        // Smooth scroll to trigger the scroll-video at the right position
        const wrapRect = wrap.getBoundingClientRect();
        const scrollY = window.scrollY + wrapRect.top;
        const sectionHeight = 2200; // Match the ScrollTrigger end
        const targetScroll = scrollY + (sectionHeight * steps[i].at);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      });
    });

    if (prefersReduced) {
      setStep(0);
      if (video) {
        video.currentTime = 0;
      }
      return;
    }

    // Scroll-controlled video
    if (video) {
      video.addEventListener("loadedmetadata", () => {
        const dur = video.duration || 1;

        ScrollTrigger.create({
          trigger: wrap,
          start: CONFIG.pinStory.start,
          end: CONFIG.pinStory.end,
          pin: true,
          scrub: CONFIG.pinStory.scrub,
          onUpdate: (self) => {
            const p = self.progress;
            
            // Update text based on progress
            const stepIndex = 
              p < 0.25 ? 0 :
              p < 0.50 ? 1 :
              p < 0.75 ? 2 : 3;
            setStep(stepIndex);

            // Map scroll progress to video time
            const time = p * (dur - 0.05);
            // Smoother updates - only update if difference is significant
            if (Math.abs(video.currentTime - time) > 0.02) {
              video.currentTime = time;
            }
          }
        });
      });
    } else {
      // Fallback if no video - just use scroll trigger for text updates
      ScrollTrigger.create({
        trigger: wrap,
        start: CONFIG.pinStory.start,
        end: CONFIG.pinStory.end,
        pin: true,
        scrub: CONFIG.pinStory.scrub,
        onUpdate: (self) => {
          const p = self.progress;
          const stepIndex = 
            p < 0.25 ? 0 :
            p < 0.50 ? 1 :
            p < 0.75 ? 2 : 3;
          setStep(stepIndex);
        }
      });
    }

    // Initial state
    setStep(0);
  }

  function init() {
    initMobileNav();
    initNavbarShrink();

    if (prefersReduced) return;
    initGSAP();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
