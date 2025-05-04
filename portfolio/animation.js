// Advanced animations and effects
class ParticleAnimation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: 50,
            particleColor: 'rgba(108, 99, 255, 0.5)',
            lineColor: 'rgba(108, 99, 255, 0.2)',
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // Create particles
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            // Draw particle
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw lines between close particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const distance = Math.sqrt(
                    Math.pow(p.x - p2.x, 2) + 
                    Math.pow(p.y - p2.y, 2)
                );
                
                if (distance < 100) {
                    this.ctx.strokeStyle = this.options.lineColor;
                    this.ctx.lineWidth = 1 - (distance / 100);
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize particle animation if canvas exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particle-canvas')) {
        new ParticleAnimation('particle-canvas', {
            particleCount: 80,
            particleColor: 'rgba(255, 101, 132, 0.5)',
            lineColor: 'rgba(255, 101, 132, 0.2)'
        });
    }
});

// Typing animation for hero text
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }
    
    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.textContent = this.txt;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation if element exists
document.addEventListener('DOMContentLoaded', () => {
    const typeElement = document.querySelector('.typewriter');
    if (typeElement) {
        const words = JSON.parse(typeElement.getAttribute('data-words'));
        const wait = typeElement.getAttribute('data-wait');
        new TypeWriter(typeElement, words, wait);
    }
});

// Scroll reveal animations
class ScrollReveal {
    constructor() {
        this.itemsToReveal = document.querySelectorAll('[data-scroll-reveal]');
        this.init();
    }
    
    init() {
        this.itemsToReveal.forEach(item => {
            this.hideInitially(item);
            this.createObserver(item);
        });
    }
    
    hideInitially(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
    }
    
    createObserver(item) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(item);
    }
    
    animateIn(item) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }
}

// Initialize scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('[data-scroll-reveal]').length > 0) {
        new ScrollReveal();
    }
});