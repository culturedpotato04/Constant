/* ============================================================
   TYPEWRITER.JS — Love Letter Typewriter Effect
   Reveals the love letter text word by word with a blinking cursor
   ============================================================ */

class TypewriterEffect {
  constructor(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;
    
    this.fullText = this.element.getAttribute('data-text') || this.element.textContent;
    this.options = {
      speed: options.speed || 30,          // ms per character
      wordMode: options.wordMode || false, // type word by word
      wordSpeed: options.wordSpeed || 80,  // ms per word
      startDelay: options.startDelay || 500,
      cursor: options.cursor !== false,
      onComplete: options.onComplete || null
    };
    
    this.isTyping = false;
    this.hasStarted = false;
    this.charIndex = 0;
    this.element.textContent = '';
    
    // Add cursor
    if (this.options.cursor) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'typewriter-cursor';
      this.element.appendChild(this.cursor);
    }
  }
  
  start() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.isTyping = true;
    
    setTimeout(() => {
      if (this.options.wordMode) {
        this.typeWords();
      } else {
        this.typeCharacters();
      }
    }, this.options.startDelay);
  }
  
  typeCharacters() {
    if (this.charIndex < this.fullText.length) {
      // Insert character before cursor
      const textNode = document.createTextNode(this.fullText[this.charIndex]);
      if (this.cursor) {
        this.element.insertBefore(textNode, this.cursor);
      } else {
        this.element.appendChild(textNode);
      }
      this.charIndex++;
      
      // Variable speed for natural feel
      let delay = this.options.speed;
      const char = this.fullText[this.charIndex - 1];
      if (char === '.' || char === '!' || char === '?') {
        delay = this.options.speed * 8;
      } else if (char === ',') {
        delay = this.options.speed * 4;
      } else if (char === '\n') {
        delay = this.options.speed * 6;
      }
      
      setTimeout(() => this.typeCharacters(), delay);
    } else {
      this.complete();
    }
  }
  
  typeWords() {
    const words = this.fullText.split(/(\s+)/);
    let wordIndex = 0;
    
    const typeNextWord = () => {
      if (wordIndex < words.length) {
        const word = words[wordIndex];
        const textNode = document.createTextNode(word);
        if (this.cursor) {
          this.element.insertBefore(textNode, this.cursor);
        } else {
          this.element.appendChild(textNode);
        }
        wordIndex++;
        
        // Variable delay based on punctuation
        let delay = this.options.wordSpeed;
        if (word.match(/[.!?]/)) {
          delay = this.options.wordSpeed * 5;
        } else if (word.match(/[,;:]/)) {
          delay = this.options.wordSpeed * 3;
        } else if (word === '\n' || word.includes('\n')) {
          delay = this.options.wordSpeed * 4;
        }
        
        setTimeout(typeNextWord, delay);
      } else {
        this.complete();
      }
    };
    
    typeNextWord();
  }
  
  complete() {
    this.isTyping = false;
    if (this.cursor) {
      // Keep cursor blinking for a bit, then fade
      setTimeout(() => {
        if (this.cursor) {
          this.cursor.style.transition = 'opacity 1s';
          this.cursor.style.opacity = '0';
          setTimeout(() => {
            if (this.cursor && this.cursor.parentNode) {
              this.cursor.remove();
            }
          }, 1000);
        }
      }, 3000);
    }
    if (this.options.onComplete) {
      this.options.onComplete();
    }
  }
  
  reset() {
    this.charIndex = 0;
    this.hasStarted = false;
    this.isTyping = false;
    this.element.textContent = '';
    if (this.options.cursor) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'typewriter-cursor';
      this.element.appendChild(this.cursor);
    }
  }
}

// Export for use in main.js
window.TypewriterEffect = TypewriterEffect;
