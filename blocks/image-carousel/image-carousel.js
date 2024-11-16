const CAROUSEL_CONFIG = {
  ANIMATION: {
    DURATION: 300,
    TIMING: 'ease-in-out',
  },
  CLASSES: {
    ACTIVE: 'active',
  },
  TOUCH: {
    THRESHOLD: 50,
  },
  AUTO_SCROLL: {
    ENABLED: true,
    INTERVAL: 3000,
    PAUSE_ON_HOVER: true,
  }
};


/**
 * Creates an SVG element for navigation arrows
 * @param {string} direction - 'prev' or 'next'
 * @returns {SVGElement} SVG element
 */
function createArrowSVG(direction) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  
  if (direction === 'prev') {
    path.setAttribute('d', 'M15 18l-6-6 6-6');
  } else {
    path.setAttribute('d', 'M9 18l6-6-6-6');
  }
  
  svg.appendChild(path);
  return svg;
}

/**
 * Calculate number of visible slides based on viewport width
 * @returns {number} Number of visible slides
 */
function getVisibleSlides() {
  const width = window.innerWidth;
  if (width <= 600) return 1;
  if (width <= 900) return 2;
  if (width <= 1200) return 3;
  return 4;
}

/**
 * Initialize carousel functionality
 * @param {HTMLElement} block - The carousel block element
 */
export default function decorate(block) {
  // Create main structure
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'carousel-container';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'carousel-header';
  
  const title = document.createElement('h2');
  title.textContent = 'Latest insights';
  title.className = 'carousel-title';
  
  const viewAll = document.createElement('a');
  viewAll.href = '#';
  viewAll.textContent = 'View all';
  viewAll.className = 'carousel-view-all';
  
  header.appendChild(title);
  header.appendChild(viewAll);
  
  // Create carousel wrapper
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';
  
  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';
  
  // Process slides
  const slides = [...block.children].map((slide) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'carousel-card';
    
    const img = slide.querySelector('img');
    const title = slide.textContent.trim();
    const type = slide.getAttribute('data-type') || 'WHITE PAPER';
    
    if (img) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'card-image';
      imgWrapper.appendChild(img.cloneNode(true));
      cardDiv.appendChild(imgWrapper);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';
    
    const titleDiv = document.createElement('h3');
    titleDiv.className = 'card-title';
    titleDiv.textContent = title;
    
    const typeDiv = document.createElement('div');
    typeDiv.className = 'card-type';
    typeDiv.textContent = type;
    
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(typeDiv);
    cardDiv.appendChild(contentDiv);
    
    slidesContainer.appendChild(cardDiv);
    return cardDiv;
  });
  
  // Create navigation arrows
  const prevArrow = document.createElement('button');
  const nextArrow = document.createElement('button');
  prevArrow.className = 'carousel-arrow prev';
  nextArrow.className = 'carousel-arrow next';
  prevArrow.appendChild(createArrowSVG('prev'));
  nextArrow.appendChild(createArrowSVG('next'));
  
  // Create indicators container
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  
  // Add all elements to the carousel
  carouselWrapper.appendChild(slidesContainer);
  carouselWrapper.appendChild(prevArrow);
  carouselWrapper.appendChild(nextArrow);
  mainWrapper.appendChild(header);
  mainWrapper.appendChild(carouselWrapper);
  mainWrapper.appendChild(indicators);
  
  // Clear original block and append new structure
  block.textContent = '';
  block.appendChild(mainWrapper);
  
  // Initialize carousel state
  let currentSlide = 0;
  let visibleSlides = getVisibleSlides();
  
  let autoScrollInterval;
  
  /**
   * Handles auto-scroll functionality
   */
  function startAutoScroll() {
    if (!CAROUSEL_CONFIG.AUTO_SCROLL.ENABLED) return;
    
    // Clear any existing interval
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
    
    autoScrollInterval = setInterval(() => {
      if (currentSlide >= slides.length - visibleSlides) {
        // Reset to first slide when reaching the end
        goToSlide(0);
      } else {
        goToSlide(currentSlide + 1);
      }
    }, CAROUSEL_CONFIG.AUTO_SCROLL.INTERVAL);
  }
  
  /**
   * Pauses auto-scroll
   */
  function pauseAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
  }
  
  // Create indicators
  function updateIndicators() {
    indicators.innerHTML = '';
    const totalIndicators = Math.ceil(slides.length / visibleSlides);
    
    for (let i = 0; i < totalIndicators; i++) {
      const indicator = document.createElement('button');
      indicator.className = `carousel-indicator${i === currentSlide ? ' active' : ''}`;
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.addEventListener('click', () => {
        goToSlide(i);
      });
      indicators.appendChild(indicator);
    }
  }
  
  // Update carousel state
  function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(slidesContainer).gap, 10);
    const offset = -currentSlide * (slideWidth + gap);
    
    slidesContainer.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    const indicatorButtons = indicators.querySelectorAll('.carousel-indicator');
    indicatorButtons.forEach((button, index) => {
      button.classList.toggle(CAROUSEL_CONFIG.CLASSES.ACTIVE, index === currentSlide);
    });
    
    // Update arrow states
    prevArrow.disabled = currentSlide === 0;
    nextArrow.disabled = currentSlide >= slides.length - visibleSlides;
  }
  
  // Slide navigation
  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, slides.length - visibleSlides));
    updateCarousel();
  }
  
  // Event listeners
  prevArrow.addEventListener('click', () => {
    if (currentSlide > 0) {
      pauseAutoScroll();
      goToSlide(currentSlide - 1);
      startAutoScroll();
    }
  });
  
  nextArrow.addEventListener('click', () => {
    if (currentSlide < slides.length - visibleSlides) {
      pauseAutoScroll();
      goToSlide(currentSlide + 1);
      startAutoScroll();
    }
  });
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  
  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    pauseAutoScroll();
  });
  
  slidesContainer.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
  });
  
  slidesContainer.addEventListener('touchend', () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > CAROUSEL_CONFIG.TOUCH.THRESHOLD) {
      if (diff > 0 && currentSlide < slides.length - visibleSlides) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
    startAutoScroll();
  });
  
  // Window resize handler
  window.addEventListener('resize', () => {
    const newVisibleSlides = getVisibleSlides();
    if (newVisibleSlides !== visibleSlides) {
      visibleSlides = newVisibleSlides;
      currentSlide = Math.min(currentSlide, slides.length - visibleSlides);
      updateIndicators();
      updateCarousel();
      startAutoScroll();
    }
  });
  
  // Initial setup
  updateIndicators();
  updateCarousel();
  startAutoScroll();
}
