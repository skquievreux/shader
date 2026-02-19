export class ChakraAnimation {
    constructor(canvasOrId) {
        if (typeof canvasOrId === 'string') {
            this.canvas = document.getElementById(canvasOrId);
        } else {
            this.canvas = canvasOrId;
        }
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Initial setup
        this.circles = [];
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };

        // Circle properties
        this.circleCount = 7;
        this.minRadius = 10;
        this.maxRadius = 100;
        this.spacing = 20;

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Create circles
        for (let i = 0; i < this.circleCount; i++) {
            this.circles.push({
                angle: (i * Math.PI) / (this.circleCount / 2),
                distanceFromCenter: this.minRadius + (i * this.spacing),
                radius: this.minRadius + (i * 2),
                pulsing: true
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw circles
        this.circles.forEach((circle, index) => {
            const x = this.center.x + Math.cos(circle.angle) * circle.distanceFromCenter;
            const y = this.center.y + Math.sin(circle.angle) * circle.distanceFromCenter;

            if (circle.pulsing) {
                circle.radius = this.minRadius + Math.sin(Date.now() * 0.001 + index) * (this.maxRadius - this.minRadius) / 2;
            }

            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.max(circle.radius, 0), 0, Math.PI * 2);
            this.ctx.strokeStyle = `hsla(${index * 30}, 70%, 60%, 0.5)`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        this.isRunning = true;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        this.handleMouseMove = (e) => {
            // Calculate distance from mouse to center
            const dx = e.clientX - this.center.x;
            const dy = e.clientY - this.center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Adjust circle spacing based on distance
            this.spacing = Math.max(20, 100 - (distance * 0.5));
            this.init();
        };
        document.addEventListener('mousemove', this.handleMouseMove);
    }


    // Cleanup logic
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;

        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }

    resume() {
        if (!this.isRunning) {
            this.animate();
        }
    }
}