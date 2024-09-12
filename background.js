const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height, particles;
const particleCount = 50; // Reduced from 100
const connectionDistance = 120; // Increased from 100
const moveSpeed = 0.01; // Reduced from 0.5 to 0.1

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
}

// Initialize canvas and particles
function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    particles = Array(particleCount).fill().map(() => new Particle());
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';

    particles.forEach(particle => {
        particle.update();

        particles.forEach(otherParticle => {
            if (particle === otherParticle) return;

            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.fill();
    });

    requestAnimationFrame(draw);
}

// Mouse interaction
let mouse = { x: width / 2, y: height / 2 };

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function drawMouseConnections() {
    particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance * 2) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(200, 200, 200, ${1 - distance / (connectionDistance * 2)})`;
            ctx.stroke();
        }
    });
}

// Main animation loop
function animate() {
    draw();
    drawMouseConnections();
    requestAnimationFrame(animate);
}

// Start the animation
init();
animate();

// Resize handling
window.addEventListener('resize', init);
