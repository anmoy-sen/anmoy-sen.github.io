// Flip Card Logic
const card = document.getElementById('flip-card');

card.addEventListener('click', function(e) {
    // Only flip if we're not clicking an action button, 'more' link, or footer social link
    if (!e.target.closest('.action-btn') && !e.target.closest('.more-link') && !e.target.closest('.footer-col')) {
        card.classList.toggle('is-flipped');
    }
});

// Network Background Animation (Neural Network Web)
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const connectionDistance = 160;
let mouse = { x: null, y: null };

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    
    // Increased particle count for higher density
    const particleCount = Math.floor((width * height) / 4500); 
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow movement for "floating nodes" vibe
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges to maintain density rather than bouncing
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle mouse repel effect
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                // Move away from mouse gently
                this.x -= dx * 0.015;
                this.y -= dy * 0.015;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Check connections between nodes
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                // Subtle blue hue for network feel
                ctx.strokeStyle = `rgba(0, 150, 255, ${0.15 * (1 - distance/connectionDistance)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
        
        // Connect to mouse to draw lines towards cursor
        if (mouse.x != null && mouse.y != null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                ctx.beginPath();
                // White/blue lines drawing towards the cursor
                ctx.strokeStyle = `rgba(150, 200, 255, ${0.2 * (1 - distance/connectionDistance)})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', init);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Remove mouse connection when mouse leaves the window
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Initialize and start animation
init();
animate();
