/* ============================================================
   MAIN.JS — Main Controller
   Handles scroll animations, music player, preloader,
   intersection observers, heart effects, and orchestration
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==================== PRELOADER ====================
  const preloader = document.querySelector('.preloader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1000);
      }
    }, 2500);
  });
  
  // Fallback: hide preloader after 5s even if not fully loaded
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000);
    }
  }, 5000);
  
  
  // ==================== SCROLL REVEAL ANIMATIONS ====================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  
  // ==================== LOVE CARD STAGGER ANIMATION ====================
  const loveCards = document.querySelectorAll('.love-card');
  
  const loveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        loveObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  
  loveCards.forEach(card => loveObserver.observe(card));
  
  
  // ==================== TYPEWRITER EFFECT FOR LOVE LETTER ====================
  const letterBody = document.getElementById('letter-body');
  let letterTypewriter = null;
  
  if (letterBody) {
    letterTypewriter = new TypewriterEffect('letter-body', {
      wordMode: true,
      wordSpeed: 60,
      startDelay: 300,
      onComplete: () => {
        // Show signature after letter completes
        const sig = document.querySelector('.letter-signature');
        const hindi = document.querySelector('.letter-hindi');
        if (sig) {
          sig.style.transition = 'opacity 1s, transform 1s';
          sig.style.opacity = '1';
          sig.style.transform = 'translateY(0)';
        }
        if (hindi) {
          setTimeout(() => {
            hindi.style.transition = 'opacity 1s, transform 1s';
            hindi.style.opacity = '1';
            hindi.style.transform = 'translateY(0)';
          }, 500);
        }
      }
    });
    
    // Start typewriter when letter section is visible
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && letterTypewriter && !letterTypewriter.hasStarted) {
          letterTypewriter.start();
          letterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    letterObserver.observe(document.querySelector('.letter-section'));
  }
  
  
  // ==================== LOVE COUNTER ====================
  const counter = new LoveCounter();
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counter.start();
        // Trigger heart burst
        setTimeout(() => createHeartBurst(), 500);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  const finaleSection = document.querySelector('.finale-section');
  if (finaleSection) {
    counterObserver.observe(finaleSection);
  }
  
  
  // ==================== MUSIC PLAYER ====================
  const audio = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const songPlayBtn = document.getElementById('song-play-btn');
  const songCard = document.querySelector('.song-card');
  const vinyl = document.querySelector('.song-vinyl');
  let isPlaying = false;
  
  function toggleMusic() {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (musicToggle) musicToggle.classList.remove('playing');
      if (songCard) songCard.classList.remove('playing');
      if (vinyl) vinyl.classList.remove('spinning');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        if (musicToggle) musicToggle.classList.add('playing');
        if (songCard) songCard.classList.add('playing');
        if (vinyl) vinyl.classList.add('spinning');
      }).catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  }
  
  if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
  }
  
  if (songPlayBtn) {
    songPlayBtn.addEventListener('click', toggleMusic);
  }
  
  // Update play button icon based on state
  if (audio) {
    audio.addEventListener('ended', () => {
      // Loop the song
      audio.currentTime = 0;
      audio.play();
    });
  }
  
  
  // ==================== HEART BURST EFFECT ====================
  function createHeartBurst() {
    const container = document.querySelector('.heart-burst');
    if (!container) return;
    
    const hearts = ['💜', '💕', '✨', '💫', '💖', '🌟', '💗', '💝'];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'burst-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.fontSize = (1 + Math.random() * 2) + 'rem';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 200;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const duration = 1500 + Math.random() * 1500;
        
        heart.animate([
          { opacity: 1, transform: 'translate(0, 0) scale(0)' },
          { opacity: 1, transform: `translate(${dx * 0.5}px, ${dy * 0.5}px) scale(1.2)`, offset: 0.3 },
          { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(0.5)` }
        ], {
          duration: duration,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards'
        });
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), duration);
      }, i * 80);
    }
  }
  
  
  // ==================== CURSOR SPARKLE TRAIL ====================
  let sparkleThrottle = 0;
  
  document.addEventListener('mousemove', (e) => {
    sparkleThrottle++;
    if (sparkleThrottle % 4 !== 0) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.position = 'fixed';
    sparkle.style.zIndex = '9998';
    
    const colors = ['#d4a574', '#e8a0bf', '#a78bfa', '#5eead4', '#f0d6a8'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.width = (2 + Math.random() * 4) + 'px';
    sparkle.style.height = sparkle.style.width;
    sparkle.style.boxShadow = `0 0 6px ${sparkle.style.background}`;
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1500);
  });
  
  
  // ==================== NICKNAME HOVER EFFECTS ====================
  const nicknameTags = document.querySelectorAll('.nickname-tag');
  nicknameTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      const emojis = ['💜', '✨', '🌟', '💫', '🤍', '💕'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      const float = document.createElement('span');
      float.textContent = emoji;
      float.style.position = 'absolute';
      float.style.pointerEvents = 'none';
      float.style.fontSize = '1.2rem';
      float.style.zIndex = '100';
      
      const rect = tag.getBoundingClientRect();
      float.style.left = (rect.left + rect.width / 2) + 'px';
      float.style.top = rect.top + 'px';
      
      float.animate([
        { opacity: 1, transform: 'translateY(0) scale(0.5)' },
        { opacity: 0, transform: 'translateY(-40px) scale(1.2)' }
      ], { duration: 1000, easing: 'ease-out', fill: 'forwards' });
      
      document.body.appendChild(float);
      setTimeout(() => float.remove(), 1000);
    });
  });
  
  
  // ==================== TIMELINE ANIMATION ENHANCER ====================
  const timelineDots = document.querySelectorAll('.timeline-dot');
  timelineDots.forEach(dot => {
    // Pulse animation when visible
    const pulseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dot.style.animation = 'dotPulse 2s ease-in-out';
          pulseObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    pulseObserver.observe(dot);
  });
  
  // Add dot pulse keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dotPulse {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.5); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  
  // ==================== SMOOTH SCROLL FOR SCROLL INDICATOR ====================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const timelineSection = document.querySelector('.timeline-section');
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    scrollIndicator.style.cursor = 'pointer';
  }
  
  
  // ==================== GALLERY AUTO-DUPLICATE FOR INFINITE SCROLL ====================
  const galleryScroll = document.querySelector('.gallery-scroll');
  if (galleryScroll) {
    // Duplicate items for seamless loop
    const items = galleryScroll.innerHTML;
    galleryScroll.innerHTML = items + items;
  }
  
  
  // ==================== PARALLAX ON SCROLL ====================
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        
        // Hero parallax
        const hero = document.querySelector('.hero-constellation');
        if (hero) {
          hero.style.transform = `translateY(${scrollY * 0.3}px)`;
          hero.style.opacity = Math.max(0, 1 - scrollY / 600);
        }
        
        // Fade scroll indicator
        const scrollInd = document.querySelector('.scroll-indicator');
        if (scrollInd) {
          scrollInd.style.opacity = Math.max(0, 1 - scrollY / 300);
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
  
  
  // ==================== EASTER EGG: KONAMI CODE ====================
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        // Secret message!
        konamiIndex = 0;
        const msg = document.createElement('div');
        msg.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: rgba(10,10,26,0.95); border: 2px solid var(--gold);
          padding: 3rem; border-radius: 20px; z-index: 10000;
          font-family: 'Dancing Script', cursive; font-size: 1.5rem;
          color: #e8a0bf; text-align: center; backdrop-filter: blur(20px);
          max-width: 400px; line-height: 1.8;
        `;
        msg.innerHTML = `
          🐼 You found a secret! 🐼<br><br>
          Your <span style="color: #d4a574;">pet panda</span>
          says hi to you, my <span style="color: #d4a574;">Set Dosa Queen!</span><br><br>
          <span style="font-size: 2rem;">🧇🐼♿👵</span><br><br>
          <small style="color: rgba(255,255,255,0.5); cursor: pointer;" onclick="this.parentElement.remove()">click to close</small>
        `;
        document.body.appendChild(msg);
        createHeartBurst();
      }
    } else {
      konamiIndex = 0;
    }
  });
  
  
  // ==================== CONSOLE EASTER EGG ====================
  console.log(
    '%c💜 P & CG — Our Universe 💜',
    'font-size: 24px; font-weight: bold; color: #e8a0bf; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
  );
  console.log(
    '%cBuilt with love, for you, the one who makes every moment infinite.',
    'font-size: 14px; color: #d4a574; font-style: italic;'
  );
  console.log(
    '%c— Water Dispenser Guy 💧',
    'font-size: 12px; color: #a78bfa;'
  );
  
});
