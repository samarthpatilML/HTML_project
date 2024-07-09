const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {
        this.x = canvas.width / 4;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.color = 'red';
        this.speed = 5;
        this.angle = 0;
        this.hooked = false;
        this.hookLength = 100;
        this.hookTargetX = null;
        this.hookTargetY = null;
        this.ropeSegments = [];
    }

    draw() {
        // Draw rope
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.ropeSegments.forEach(segment => {
            ctx.lineTo(segment.x, segment.y);
        });
        if (this.hooked) {
            ctx.lineTo(this.hookTargetX, this.hookTargetY);
        }
        ctx.stroke();

        // Draw player circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Update rope segments
        this.ropeSegments.unshift({ x: this.x, y: this.y });
        if (this.ropeSegments.length > this.hookLength) {
            this.ropeSegments.pop();
        }

        // Move player
        if (keys['ArrowUp']) this.y -= this.speed;
        if (keys['ArrowDown']) this.y += this.speed;
        if (keys['ArrowLeft']) this.x -= this.speed;
        if (keys['ArrowRight']) this.x += this.speed;

        // Update hook mechanics
        if (this.hooked) {
            const dx = this.hookTargetX - this.x;
            const dy = this.hookTargetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 5) {
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            } else {
                this.hooked = false;
                this.ropeSegments = [];
            }
        }
    }

    shootHook(targetX, targetY) {
        this.hooked = true;
        this.hookTargetX = targetX;
        this.hookTargetY = targetY;
    }
}

const player = new Player();
const clouds = [
    { x: 100, y: 100 },
    { x: 500, y: 200 },
    { x: 800, y: 50 }
];
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        let closestCloud = null;
        let closestDistance = Infinity;

        clouds.forEach(cloud => {
            const dx = cloud.x - player.x;
            const dy = cloud.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance && distance < 200) {
                closestCloud = cloud;
                closestDistance = distance;
            }
        });

        if (closestCloud) {
            player.shootHook(closestCloud.x, closestCloud.y);
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    clouds.forEach(cloud => {
        drawCloud(cloud.x, cloud.y);
    });

    requestAnimationFrame(gameLoop);
}

function drawCloud(x, y) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

gameLoop();