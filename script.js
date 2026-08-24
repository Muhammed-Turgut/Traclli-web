// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMapConquestSimulation();
});

// GSAP & ScrollTrigger Animations
function initScrollAnimations() {
  // Hero Phone Mockup Scroll Animation
  gsap.to('#phoneMockup', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    scale: 1.15,
    y: 40,
    rotateX: 5,
    ease: 'power1.out'
  });

  // Fade and slide up elements on scroll
  gsap.utils.toArray('.animate-on-scroll').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // SVG Path Conquest Drawing Animation with ScrollTrigger
  const conquerPath = document.getElementById('conquerPath');
  const territoryFill = document.getElementById('territoryFill');
  const conquerBadge = document.getElementById('conquerBadge');

  if (conquerPath && territoryFill) {
    const pathLength = conquerPath.getTotalLength();
    conquerPath.style.strokeDasharray = pathLength;
    conquerPath.style.strokeDashoffset = pathLength;

    gsap.timeline({
      scrollTrigger: {
        trigger: '#mapVisualizer',
        start: 'top 75%',
        end: 'center center',
        scrub: 1
      }
    })
    .to(conquerPath, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'none'
    })
    .to(territoryFill, {
      opacity: 0.85,
      duration: 0.8,
      ease: 'power2.out'
    })
    .to(conquerBadge, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }
}

// Interactive Map Territory Simulation
function initMapConquestSimulation() {
  const runBtn = document.getElementById('simulateRunBtn');
  const conquerPath = document.getElementById('conquerPath');
  const territoryFill = document.getElementById('territoryFill');
  const conquerBadge = document.getElementById('conquerBadge');
  const areaStat = document.getElementById('conqueredAreaStat');

  if (!runBtn) return;

  let isAnimating = false;

  runBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    // Reset initial state
    const pathLength = conquerPath.getTotalLength();
    gsap.set(conquerPath, { strokeDashoffset: pathLength });
    gsap.set(territoryFill, { opacity: 0 });
    gsap.set(conquerBadge, { scale: 0, opacity: 0 });

    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Koşuluyor...';

    // Animate runner completing loop
    gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        runBtn.innerHTML = '<i class="fa-solid fa-flag-checkered"></i> Yeniden Koş & Fethet';
        if (areaStat) areaStat.textContent = '1.42 km² (FETHEDİLDİ!)';
      }
    })
    .to(conquerPath, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power1.inOut'
    })
    .to(territoryFill, {
      opacity: 0.85,
      duration: 0.6,
      ease: 'power2.out'
    })
    .to(conquerBadge, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(2)'
    });
  });
}
