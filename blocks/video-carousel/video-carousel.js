const VIDEO_CAROUSEL_CONFIG = {
  // Configuration for YouTube embed
  YOUTUBE: {
    EMBED_URL: 'https://www.youtube.com/embed/',
    PARAMS: '?enablejsapi=1&rel=0',
  },
  // DOM element creation config
  ELEMENTS: {
    BUTTON_PREV: 'Previous',
    BUTTON_NEXT: 'Next',
    BUTTON_PLAY: 'Play',
    BUTTON_PAUSE: 'Pause',
  },
  // Animation timing
  TIMING: {
    SLIDE_DURATION: 400,
  },
};

/**
 * Extracts YouTube video ID from various URL formats
 * @param {string} url - YouTube URL
 * @returns {string} Video ID
 */
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match?.[2] || '';
}

/**
 * Creates carousel navigation buttons
 * @param {HTMLElement} wrapper - Carousel wrapper element
 * @returns {Object} Navigation button elements
 */
function createNavigation(wrapper) {
  const nav = document.createElement('div');
  nav.className = 'video-carousel-nav';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-prev';
  prevBtn.setAttribute('aria-label', VIDEO_CAROUSEL_CONFIG.ELEMENTS.BUTTON_PREV);
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-next';
  nextBtn.setAttribute('aria-label', VIDEO_CAROUSEL_CONFIG.ELEMENTS.BUTTON_NEXT);
  
  nav.append(prevBtn, nextBtn);
  wrapper.appendChild(nav);
  
  return { prevBtn, nextBtn };
}

/**
 * Creates video iframe element
 * @param {string} videoId - YouTube video ID
 * @returns {HTMLIFrameElement} Video iframe element
 */
function createVideoFrame(videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `${VIDEO_CAROUSEL_CONFIG.YOUTUBE.EMBED_URL}${videoId}${VIDEO_CAROUSEL_CONFIG.YOUTUBE.PARAMS}`;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  return iframe;
}

export default async function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-carousel-wrapper';
  
  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'video-carousel-slides';
  
  // Process table data into slides
  [...block.children].forEach((row) => {
    const videoUrl = row.textContent.trim();
    if (videoUrl) {
      const videoId = getYouTubeId(videoUrl);
      if (videoId) {
        const slide = document.createElement('div');
        slide.className = 'video-carousel-slide';
        slide.appendChild(createVideoFrame(videoId));
        slidesContainer.appendChild(slide);
      }
    }
  });
  
  wrapper.appendChild(slidesContainer);
  
  // Create navigation
  const { prevBtn, nextBtn } = createNavigation(wrapper);
  
  // Replace block contents
  block.textContent = '';
  block.appendChild(wrapper);
  
  // Current slide tracking
  let currentSlide = 0;
  const slides = slidesContainer.children;
  
  // Navigation handlers
  const updateSlides = () => {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
  };
  
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateSlides();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide += 1;
      updateSlides();
    }
  });
  
  // Initialize state
  updateSlides();
} 