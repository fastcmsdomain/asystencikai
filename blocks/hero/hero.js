const HERO_CONFIG = {
  ANIMATION: {
    DURATION: 600,
    TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  AUTOPLAY: {
    ENABLED: true,
    INTERVAL: 9000,
  },
  CLASSES: {
    ACTIVE: 'active',
    TRANSITIONING: 'transitioning',
  },
};

/**
 * Creates navigation arrows with golden design
 * @param {HTMLElement} wrapper - Hero wrapper element
 * @returns {Object} Navigation elements
 */
function createNavigation(wrapper) {
  const nav = document.createElement('div');
  nav.className = 'hero-navigation';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'hero-nav-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'hero-nav-btn next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  
  nav.append(prevBtn, nextBtn);
  wrapper.appendChild(nav);
  
  return { prevBtn, nextBtn };
}

/**
 * Creates pagination indicators
 * @param {number} slideCount - Total number of slides
 * @param {HTMLElement} wrapper - Hero wrapper element
 * @returns {HTMLElement} Pagination container
 */
function createPagination(slideCount, wrapper) {
  const pagination = document.createElement('div');
  pagination.className = 'hero-pagination';
  
  for (let i = 0; i < slideCount; i += 1) {
    const indicator = document.createElement('button');
    indicator.className = 'hero-pagination-indicator';
    indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
    pagination.appendChild(indicator);
  }
  
  wrapper.appendChild(pagination);
  return pagination;
}

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';
  
  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-slides';
  
  // Process images and create slides
  const slides = [...block.children].map((row) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide';
    
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    
    // Get the picture element and text content
    const picture = row.querySelector('picture');
    const textContent = row.textContent.trim();
    
    if (picture) {
      // Clone and append the picture element
      overlay.appendChild(picture.cloneNode(true));
      
      // Add overlay text
      const textDiv = document.createElement('div');
      textDiv.className = 'hero-overlay-text';
      textDiv.textContent = textContent;
      overlay.appendChild(textDiv);
    }
    
    slide.appendChild(overlay);
    slidesContainer.appendChild(slide);
    return slide;
  });
  
  wrapper.appendChild(slidesContainer);
  
  // Create navigation and pagination
  const { prevBtn, nextBtn } = createNavigation(wrapper);
  const pagination = createPagination(slides.length, wrapper);
  
  // Replace block contents
  block.textContent = '';
  block.appendChild(wrapper);
  
  // Carousel logic
  let currentSlide = 0;
  let autoplayInterval;
  
  const updateSlides = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle(HERO_CONFIG.CLASSES.ACTIVE, index === currentSlide);
    });
    
    // Update pagination
    const indicators = pagination.children;
    [...indicators].forEach((indicator, index) => {
      indicator.classList.toggle(HERO_CONFIG.CLASSES.ACTIVE, index === currentSlide);
    });
  };
  
  const goToSlide = (index) => {
    currentSlide = index;
    updateSlides();
  };
  
  // Navigation handlers
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  });
  
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  });
  
  // Pagination handlers
  [...pagination.children].forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Autoplay
  if (HERO_CONFIG.AUTOPLAY.ENABLED) {
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
      }, HERO_CONFIG.AUTOPLAY.INTERVAL);
    };
    
    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };
    
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }
  
  // Initialize
  updateSlides();
}
