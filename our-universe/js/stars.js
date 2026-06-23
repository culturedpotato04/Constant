/* ============================================================
   STARS.JS — Canvas-based Starry Night Sky Animation
   Persistent starfield background with twinkling stars,
   shooting stars, and nebula-like color clouds
   ============================================================ */

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.nebulae = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.animationId = null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.config = {
      starCount: 300,
      starMinSize: 0.3,
      starMaxSize: 2.5,
      twinkleSpeed: 0.008,
      parallaxFactor: 0.02,
      shootingStarInterval: 4000,
      nebulaCount: 4
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createStars();
    this.createNebulae();
    this.bindEvents();
    this.animate();
    this.scheduleShootingStar();
  }
  
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(this.dpr, this.dpr);
  }
  
  createStars() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: this.config.starMinSize + Math.random() * (this.config.starMaxSize - this.config.starMinSize),
        opacity: Math.random(),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: this.config.twinkleSpeed * (0.5 + Math.random()),
        // Each star has a subtle color tint
        color: this.getStarColor(),
        parallaxDepth: 0.2 + Math.random() * 0.8
      });
    }
  }
  
  getStarColor() {
    const colors = [
      { r: 255, g: 255, b: 255 },      // Pure white
      { r: 255, g: 240, b: 220 },      // Warm white
      { r: 220, g: 230, b: 255 },      // Cool white/blue
      { r: 255, g: 220, b: 200 },      // Warm golden
      { r: 230, g: 200, b: 255 },      // Soft purple
      { r: 255, g: 200, b: 220 },      // Soft pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  createNebulae() {
    this.nebulae = [];
    const nebulaColors = [
      { r: 100, g: 50, b: 180, a: 0.015 },    // Purple
      { r: 50, g: 60, b: 150, a: 0.012 },      // Blue
      { r: 180, g: 80, b: 130, a: 0.01 },      // Rose
      { r: 150, g: 120, b: 60, a: 0.008 },     // Gold
    ];
    
    for (let i = 0; i < this.config.nebulaCount; i++) {
      const color = nebulaColors[i % nebulaColors.length];
      this.nebulae.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 200 + Math.random() * 300,
        color: color,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002
      });
    }
  }
  
  createShootingStar() {
    const startX = Math.random() * this.width;
    const startY = Math.random() * this.height * 0.4;
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
    const speed = 8 + Math.random() * 12;
    const length = 80 + Math.random() * 120;
    
    this.shootingStars.push({
      x: startX,
      y: startY,
      angle: angle,
      speed: speed,
      length: length,
      opacity: 1,
      trail: [],
      life: 0,
      maxLife: 60 + Math.random() * 40
    });
  }
  
  scheduleShootingStar() {
    const delay = this.config.shootingStarInterval + Math.random() * 6000;
    setTimeout(() => {
      this.createShootingStar();
      this.scheduleShootingStar();
    }, delay);
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
      this.createNebulae();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / this.width - 0.5) * 2;
      this.mouseY = (e.clientY / this.height - 0.5) * 2;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.pageYOffset;
    });
  }
  
  drawNebulae() {
    const ctx = this.ctx;
    
    for (const nebula of this.nebulae) {
      nebula.phase += nebula.speed;
      const pulseFactor = 1 + Math.sin(nebula.phase) * 0.15;
      const currentRadius = nebula.radius * pulseFactor;
      
      const offsetX = nebula.x + this.mouseX * 8;
      const offsetY = nebula.y + this.mouseY * 8 - this.scrollY * 0.03;
      
      const gradient = ctx.createRadialGradient(
        offsetX, offsetY, 0,
        offsetX, offsetY, currentRadius
      );
      
      const { r, g, b, a } = nebula.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 2})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }
  
  drawStars() {
    const ctx = this.ctx;
    
    for (const star of this.stars) {
      star.twinklePhase += star.twinkleSpeed;
      const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
      const opacity = 0.2 + twinkle * 0.8;
      
      // Parallax offset
      const parallaxX = star.x + this.mouseX * star.parallaxDepth * 15;
      const parallaxY = star.y + this.mouseY * star.parallaxDepth * 15 - 
                        this.scrollY * star.parallaxDepth * this.config.parallaxFactor;
      
      // Wrap around
      let drawX = ((parallaxX % this.width) + this.width) % this.width;
      let drawY = ((parallaxY % this.height) + this.height) % this.height;
      
      const { r, g, b } = star.color;
      
      // Glow
      if (star.size > 1.2) {
        const glowSize = star.size * 4;
        const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.15})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Star core
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Cross sparkle for bigger stars
      if (star.size > 1.8 && twinkle > 0.6) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        const sLen = star.size * 3;
        ctx.beginPath();
        ctx.moveTo(drawX - sLen, drawY);
        ctx.lineTo(drawX + sLen, drawY);
        ctx.moveTo(drawX, drawY - sLen);
        ctx.lineTo(drawX, drawY + sLen);
        ctx.stroke();
      }
    }
  }
  
  drawShootingStars() {
    const ctx = this.ctx;
    
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.life++;
      
      if (ss.life > ss.maxLife) {
        this.shootingStars.splice(i, 1);
        continue;
      }
      
      // Move
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      
      // Fade
      if (ss.life > ss.maxLife * 0.6) {
        ss.opacity = Math.max(0, 1 - (ss.life - ss.maxLife * 0.6) / (ss.maxLife * 0.4));
      }
      
      // Trail
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 20) ss.trail.shift();
      
      // Draw trail
      if (ss.trail.length > 1) {
        for (let j = 1; j < ss.trail.length; j++) {
          const t = j / ss.trail.length;
          ctx.strokeStyle = `rgba(255, 255, 255, ${t * ss.opacity * 0.6})`;
          ctx.lineWidth = t * 2;
          ctx.beginPath();
          ctx.moveTo(ss.trail[j - 1].x, ss.trail[j - 1].y);
          ctx.lineTo(ss.trail[j].x, ss.trail[j].y);
          ctx.stroke();
        }
      }
      
      // Head glow
      const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
      headGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawNebulae();
    this.drawStars();
    this.drawShootingStars();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.starfield = new Starfield('starfield');
});
