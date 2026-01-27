(() => {
  const CONFIG = {
    reveal: {
      y: 40,
      scaleFrom: 0.95,
      blurFrom: 10,
      duration: 0.9,
      ease: "power3.out",
      start: "top 86%",
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
    lowPower: {
      maxBlurMobile: 8,
    }
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const lowPower = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (isTouch && window.innerWidth < 700);

  function qs(sel, root = document){ return root.querySelector(sel); }
  function qsa(sel, root = document){ return Array.from(root.querySelectorAll(sel)); }

  function initMobileNav() {
    const btn = qs("[data-mobile-nav]");
    const panel = qs("[data-mobile-nav-panel]");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close on link click
    qsa("a", panel).forEach(a => a.addEventListener("click", () => {
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }));
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
    initPinnedStory();
  }

  function initReveals() {
    const els = qsa(".reveal");
    if (!els.length) return;

    els.forEach(el => {
      const delay = parseFloat(el.getAttribute("data-delay") || "0");

      if (prefersReduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
        return;
      }

      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: CONFIG.reveal.duration,
        ease: CONFIG.reveal.ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start: CONFIG.reveal.start,
        }
      });
    });

    // Set initial states more gently on low power
    if (lowPower) {
      els.forEach(el => {
        el.style.filter = `blur(${Math.min(CONFIG.reveal.blurFrom, CONFIG.lowPower.maxBlurMobile)}px)`;
      });
    }
  }

  function initStaggers() {
    const groups = qsa(".reveal-stagger");
    if (!groups.length) return;

    groups.forEach(group => {
      const children = Array.from(group.children);
      if (!children.length) return;

      const staggerEach = parseFloat(group.getAttribute("data-stagger") || CONFIG.stagger.each);

      if (prefersReduced) {
        children.forEach(c => {
          c.style.opacity = "1";
          c.style.transform = "none";
          c.style.filter = "none";
        });
        return;
      }

      gsap.to(children, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: { each: staggerEach },
        scrollTrigger: {
          trigger: group,
          start: "top 82%",
        }
      });
    });
  }

  function initCounters() {
    const els = qsa(".countup");
    if (!els.length) return;

    els.forEach(el => {
      const target = parseFloat(el.getAttribute("data-count") || "0");
      const isFloat = String(target).includes(".");

      if (prefersReduced) {
        el.textContent = isFloat ? target.toFixed(1) : String(Math.round(target));
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
          el.textContent = isFloat ? obj.val.toFixed(1) : String(Math.round(obj.val));
        }
      });
    });
  }

  function initPinnedStory() {
    const wrap = qs(".pin-story");
    const title = qs("[data-story-title]");
    const desc = qs("[data-story-desc]");
    const steps = qsa(".story-step");

    if (!wrap || !title || !desc || steps.length < 2) return;

    const content = [
      {
        title: "Sunflower governance",
        desc: "Policies, roles, and constraints that prevent drift and enforce accountable autonomy.",
        active: 0,
      },
      {
        title: "Honeycomb departments",
        desc: "A scalable org structure where agents cooperate inside departments and across the hive.",
        active: 1,
      },
      {
        title: "Agent swarms",
        desc: "Task-based routing, parallel execution, and model switching with conflict resolution.",
        active: 2,
      },
      {
        title: "Auditable memory",
        desc: "Every decision is traceable. Logs, evidence, and outcomes stay queryable and reviewable.",
        active: 3,
      }
    ];

    if (prefersReduced) {
      // No pinning, just show first state
      setStoryState(0);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: CONFIG.pinStory.start,
        end: CONFIG.pinStory.end,
        scrub: CONFIG.pinStory.scrub,
        pin: true,
        anticipatePin: 1,
      }
    });

    // We create 4 "chapters"
    content.forEach((_, i) => {
      tl.add(() => setStoryState(i), i); // callback at each label index
      tl.to({}, { duration: 1 });       // spacing for each chapter
    });

    function setStoryState(i) {
      const c = content[i];
      if (!c) return;

      title.textContent = c.title;
      desc.textContent = c.desc;

      steps.forEach(s => s.classList.remove("is-active"));
      const activeEl = Array.from(steps).find(s => parseInt(s.getAttribute("data-step"), 10) === c.active);
      if (activeEl) activeEl.classList.add("is-active");

      // Tiny pop animation for the visual step
      gsap.fromTo(activeEl, { scale: 0.98 }, { scale: 1, duration: 0.25, ease: "power2.out" });
    }
  }

  function init() {
    initMobileNav();
    initNavbarShrink();

    if (prefersReduced) return;
    initGSAP();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
