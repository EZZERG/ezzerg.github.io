const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let width, height, particles;
const particleCount = 100; // Increased for better effect
const connectionDistance = 120;
const moveSpeed = 0.5; // Increased for more noticeable movement

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.originalX = this.x;
        this.originalY = this.y;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        const force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
            this.x -= dx * force * moveSpeed;
            this.y -= dy * force * moveSpeed;
        } else {
            this.x += (this.originalX - this.x) * 0.05;
            this.y += (this.originalY - this.y) * 0.05;
        }
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
}

// Mouse interaction
let mouse = { x: width / 2, y: height / 2 };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    console.log('Mouse moved:', mouse.x, mouse.y); // Debugging line
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
    particles.forEach(particle => particle.update(mouse.x, mouse.y));
    draw();
    drawMouseConnections();
    requestAnimationFrame(animate);
}

// Start the animation
init();
animate();

// Resize handling
window.addEventListener('resize', init);

// Debugging: Log mouse position every second
setInterval(() => {
    console.log('Current mouse position:', mouse.x, mouse.y);
}, 1000);
