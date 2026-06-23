/* ============================================================
   COUNTER.JS — Live Count-Up Timer
   Shows exactly how long P & CG have been connected
   Since June 24, 2022, 12:55 PM IST
   ============================================================ */

class LoveCounter {
  constructor(options = {}) {
    this.startDate = new Date('2022-06-24T12:55:00+05:30');
    this.elements = {
      years: document.getElementById('counter-years'),
      months: document.getElementById('counter-months'),
      days: document.getElementById('counter-days'),
      hours: document.getElementById('counter-hours'),
      minutes: document.getElementById('counter-minutes'),
      seconds: document.getElementById('counter-seconds')
    };
    this.intervalId = null;
    this.onUpdate = options.onUpdate || null;
  }
  
  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }
  
  update() {
    const now = new Date();
    const diff = now - this.startDate;
    
    if (diff < 0) return;
    
    // Calculate years, months, days
    let years = now.getFullYear() - this.startDate.getFullYear();
    let months = now.getMonth() - this.startDate.getMonth();
    let days = now.getDate() - this.startDate.getDate();
    let hours = now.getHours() - this.startDate.getHours();
    let minutes = now.getMinutes() - this.startDate.getMinutes();
    let seconds = now.getSeconds() - this.startDate.getSeconds();
    
    // Borrow from larger units
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }
    
    // Calculate total days for display
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diff / (1000 * 60));
    
    // Update DOM with animation
    this.updateElement('years', years);
    this.updateElement('months', months);
    this.updateElement('days', days);
    this.updateElement('hours', hours);
    this.updateElement('minutes', this.padZero(minutes));
    this.updateElement('seconds', this.padZero(seconds));
    
    if (this.onUpdate) {
      this.onUpdate({ years, months, days, hours, minutes, seconds, totalDays });
    }
  }
  
  updateElement(key, value) {
    const el = this.elements[key];
    if (!el) return;
    
    const strValue = String(value);
    if (el.textContent !== strValue) {
      el.textContent = strValue;
      // Subtle pop animation on change
      el.style.transform = 'scale(1.1)';
      el.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  padZero(num) {
    return String(num).padStart(2, '0');
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  // Get a formatted summary
  getSummary() {
    const now = new Date();
    const diff = now - this.startDate;
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${totalDays} days of love and counting...`;
  }
}

// Export for use in main.js
window.LoveCounter = LoveCounter;
