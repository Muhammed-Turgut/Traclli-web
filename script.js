gsap.registerPlugin(ScrollTrigger);

const pathLen = (el) => (el ? el.getTotalLength() : 0);

function prepPath(el) {
  if (!el) return 0;
  const len = pathLen(el);
  el.style.strokeDasharray = `${len}`;
  el.style.strokeDashoffset = `${len}`;
  return len;
}

function setActiveStep(index) {
  document.querySelectorAll(".story-steps li").forEach((li, i) => {
    li.classList.toggle("is-active", i === index);
  });
}

function playConquest({ scrubbed } = {}) {
  const path = document.getElementById("conquerPath");
  const fill = document.getElementById("territoryFill");
  const badge = document.getElementById("conquerBadge");
  const runner = document.getElementById("runnerDot");
  const area = document.getElementById("areaStat");
  if (!path || !fill) return null;

  const len = prepPath(path);
  gsap.set(fill, { opacity: 0 });
  gsap.set(badge, { opacity: 0, scale: 0.7, transformOrigin: "0px 0px" });
  if (area) area.textContent = "0.00 km²";

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate() {
      const p = tl.progress();
      if (p < 0.45) setActiveStep(0);
      else if (p < 0.78) setActiveStep(1);
      else setActiveStep(2);
      if (area) area.textContent = `${(1.42 * Math.min(1, Math.max(0, (p - 0.55) / 0.35))).toFixed(2)} km²`;
    },
  });

  tl.to(path, { strokeDashoffset: 0, duration: 2.2 }, 0);

  if (runner) {
    tl.to(
      runner,
      {
        duration: 2.2,
        motionPath: undefined,
        ease: "none",
        onUpdate() {
          const t = Math.min(1, this.progress());
          const pt = path.getPointAtLength(len * t);
          runner.setAttribute("cx", pt.x);
          runner.setAttribute("cy", pt.y);
        },
      },
      0
    );
  }

  tl.to(fill, { opacity: 1, duration: 0.55, ease: "power2.out" }, 1.85);
  tl.to(badge, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 2.15);

  return tl;
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = links?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(!!open));
  });

  links?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  const heroPath = document.getElementById("heroPath");
  const heroFill = document.getElementById("heroFill");
  if (heroPath) {
    prepPath(heroPath);
    const heroTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    heroTl.to(heroPath, { strokeDashoffset: 0, duration: 2.4, ease: "power1.inOut" });
    heroTl.to(heroFill, { opacity: 1, duration: 0.5 }, "-=0.3");
    heroTl.to({}, { duration: 1.4 });
    heroTl.set(heroFill, { opacity: 0 });
  }

  gsap.from("#heroPhone", {
    y: 28,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 0.15,
  });

  const mm = gsap.matchMedia();

  mm.add("(min-width: 961px)", () => {
    const tl = playConquest();
    if (!tl) return;
    ScrollTrigger.create({
      animation: tl,
      trigger: "#story",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
    });
  });

  mm.add("(max-width: 960px)", () => {
    const tl = playConquest();
    if (!tl) return;
    ScrollTrigger.create({
      animation: tl,
      trigger: "#mapStage",
      start: "top 75%",
      toggleActions: "play none none reverse",
    });
  });

  document.getElementById("replayBtn")?.addEventListener("click", () => {
    const tl = playConquest();
    tl?.play(0);
  });

  gsap.utils.toArray(".panel, .section-head").forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });
});
