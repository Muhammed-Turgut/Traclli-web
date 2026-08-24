// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Pace & Calorie Calculator Logic
  const distInput = document.getElementById('calcDistance');
  const paceInput = document.getElementById('calcPace');
  const weightInput = document.getElementById('calcWeight');

  const distVal = document.getElementById('distVal');
  const paceVal = document.getElementById('paceVal');
  const weightVal = document.getElementById('weightVal');

  const resultTime = document.getElementById('resultTime');
  const resultCalories = document.getElementById('resultCalories');
  const resultHydration = document.getElementById('resultHydration');

  function formatPace(decimalPace) {
    const mins = Math.floor(decimalPace);
    const secs = Math.round((decimalPace - mins) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function calculateRunStats() {
    if (!distInput || !paceInput || !weightInput) return;

    const distance = parseFloat(distInput.value); // in km
    const paceDecimal = parseFloat(paceInput.value); // in min/km
    const weight = parseFloat(weightInput.value); // in kg

    // Update displays
    distVal.textContent = `${distance.toFixed(1)} km`;
    paceVal.textContent = `${formatPace(paceDecimal)} dk/km`;
    weightVal.textContent = `${weight} kg`;

    // Calculate total time in seconds
    const totalMinutes = distance * paceDecimal;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes - Math.floor(totalMinutes)) * 60);

    let timeString = '';
    if (hours > 0) {
      timeString += `${hours} sa `;
    }
    timeString += `${minutes} dk ${seconds < 10 ? '0' : ''}${seconds} sn`;
    resultTime.textContent = timeString;

    // Calories: approx 1.036 * weight * distance
    const calories = Math.round(distance * weight * 1.036);
    resultCalories.textContent = `${calories} kcal`;

    // Hydration estimate: ~0.12 liters per 15 min of running
    const hydrationLiters = ((totalMinutes / 15) * 0.12).toFixed(2);
    resultHydration.textContent = `${hydrationLiters} L`;
  }

  if (distInput && paceInput && weightInput) {
    distInput.addEventListener('input', calculateRunStats);
    paceInput.addEventListener('input', calculateRunStats);
    weightInput.addEventListener('input', calculateRunStats);
    calculateRunStats();
  }

  // Modal Open/Close Logic
  const downloadBtns = document.querySelectorAll('.trigger-download');
  const modal = document.getElementById('downloadModal');
  const closeModal = document.getElementById('closeModal');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Interactive Route Canvas Simulation
  initRouteSimulator();
});

// Interactive HTML5 Canvas Route Simulation
function initRouteSimulator() {
  const canvas = document.getElementById('routeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Define route points
  const points = [
    { x: 50, y: 220 },
    { x: 120, y: 150 },
    { x: 220, y: 180 },
    { x: 300, y: 90 },
    { x: 420, y: 140 },
    { x: 520, y: 80 },
    { x: 640, y: 190 },
    { x: 740, y: 130 },
    { x: 820, y: 220 }
  ];

  let progress = 0;
  let speed = 0.003;
  let isPlaying = true;

  const playBtn = document.getElementById('simPlayBtn');
  const speedBtn = document.getElementById('simSpeedBtn');
  const simDistance = document.getElementById('simDistance');
  const simElevation = document.getElementById('simElevation');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i> Duraklat' : '<i class="fa-solid fa-play"></i> Başlat';
    });
  }

  if (speedBtn) {
    let speedIndex = 0;
    const speeds = [0.003, 0.006, 0.012];
    const speedLabels = ['1x', '2x', '4x'];
    speedBtn.addEventListener('click', () => {
      speedIndex = (speedIndex + 1) % speeds.length;
      speed = speeds[speedIndex];
      speedBtn.textContent = `Hız: ${speedLabels[speedIndex]}`;
    });
  }

  // Bezier curve interpolation
  function getPointAtProgress(t) {
    const totalSegments = points.length - 1;
    const scaledT = t * totalSegments;
    const index = Math.floor(scaledT);
    const segmentT = scaledT - index;

    if (index >= totalSegments) return points[points.length - 1];

    const p0 = points[index];
    const p1 = points[index + 1];

    return {
      x: p0.x + (p1.x - p0.x) * segmentT,
      y: p0.y + (p1.y - p0.y) * segmentT
    };
  }

  function draw() {
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;

    // Clear background
    ctx.fillStyle = '#040a06';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid overlay
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scale route points to canvas width/height
    const scaleX = width / 900;
    const scaleY = height / 300;

    const scaledPoints = points.map(p => ({
      x: p.x * scaleX,
      y: p.y * scaleY
    }));

    // Draw Full Track Path (inactive glow)
    ctx.beginPath();
    ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
    for (let i = 1; i < scaledPoints.length; i++) {
      ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
    }
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw Active Traveled Track (glowing mint)
    const currentPointIndex = progress * (scaledPoints.length - 1);
    const maxSegment = Math.floor(currentPointIndex);
    const subProgress = currentPointIndex - maxSegment;

    ctx.beginPath();
    ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
    for (let i = 1; i <= maxSegment && i < scaledPoints.length; i++) {
      ctx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
    }

    if (maxSegment < scaledPoints.length - 1) {
      const pCurrent = scaledPoints[maxSegment];
      const pNext = scaledPoints[maxSegment + 1];
      const currX = pCurrent.x + (pNext.x - pCurrent.x) * subProgress;
      const currY = pCurrent.y + (pNext.y - pCurrent.y) * subProgress;
      ctx.lineTo(currX, currY);
    }

    ctx.strokeStyle = '#00ff87';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00ff87';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Get current runner location
    let runnerPos = { x: scaledPoints[0].x, y: scaledPoints[0].y };
    if (maxSegment < scaledPoints.length - 1) {
      const pCurrent = scaledPoints[maxSegment];
      const pNext = scaledPoints[maxSegment + 1];
      runnerPos = {
        x: pCurrent.x + (pNext.x - pCurrent.x) * subProgress,
        y: pCurrent.y + (pNext.y - pCurrent.y) * subProgress
      };
    } else {
      runnerPos = scaledPoints[scaledPoints.length - 1];
    }

    // Draw Runner Marker Point
    ctx.beginPath();
    ctx.arc(runnerPos.x, runnerPos.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00ff87';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(runnerPos.x, runnerPos.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();

    // Update Distance & Elevation UI
    if (simDistance) {
      const distanceCovered = (progress * 8.4).toFixed(2); // 8.4 km total
      simDistance.textContent = `${distanceCovered} km`;
    }

    if (simElevation) {
      // Simulate elevation relative to inverted Y
      const currentHeight = Math.round((height - runnerPos.y) * 0.8);
      simElevation.textContent = `+${currentHeight} m`;
    }

    // Advance Animation
    if (isPlaying) {
      progress += speed;
      if (progress > 1) {
        progress = 0;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
