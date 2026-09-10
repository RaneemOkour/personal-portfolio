// ========================================================
// 1. Interactive Cyberpunk 3D Background Canvas
// ========================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = Array.from({ length: 65 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    radius: Math.random() * 2 + 1,
    color: Math.random() > 0.45 ? '#00F5D4' : '#7B2CBF'
}));

function animateCanvas() {
    ctx.fillStyle = '#0a0b10';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(123, 44, 191, 0.05)';
    ctx.lineWidth = 1;
    const step = 50;

    for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 115) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 245, 212, ${0.18 * (1 - dist / 115)})`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateCanvas);
}

animateCanvas();

// ========================================================
// 2. 3D Circular Orbit Carousel Animation & Controls
// ========================================================
const stage = document.getElementById('carouselStage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentAngle = 0;
let isHovered = false;
let isDragging = false;
let startX = 0;

function rotateCarousel(angle) {
    currentAngle = angle;
    if (stage) {
        stage.style.transform = `rotateY(${currentAngle}deg)`;
    }
}

if (stage) {
    if (nextBtn) {
        nextBtn.addEventListener('click', () => rotateCarousel(currentAngle - 180));
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => rotateCarousel(currentAngle + 180));
    }

    // Auto-rotation in 3D space
    setInterval(() => {
        if (!isHovered && !isDragging) {
            currentAngle -= 0.25;
            rotateCarousel(currentAngle);
        }
    }, 30);

    stage.addEventListener('mouseenter', () => isHovered = true);
    stage.addEventListener('mouseleave', () => {
        isHovered = false;
        isDragging = false;
    });

    stage.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        rotateCarousel(currentAngle + deltaX * 0.45);
        startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    stage.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        rotateCarousel(currentAngle + deltaX * 0.45);
        startX = e.touches[0].clientX;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}
if (window.lucide) {
    lucide.createIcons();
}