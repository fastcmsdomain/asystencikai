const CAROUSEL_CONFIG = {
  ANIMATION: {
    DURATION: 300,
    TIMING: 'ease-out',
  },
  CLASSES: {
    ACTIVE: 'active',
    DRAGGING: 'dragging',
  },
  TOUCH: {
    THRESHOLD: 50,
  },
  CARD: {
    GAP: 24, // Gap between cards
    VISIBLE: 4, // Number of visible cards
  }
};

export default async function decorate(block) {
  // Create wrapper and container
  const wrapper = document.createElement('div');
  wrapper.className = 'image-carousel-wrapper';
  
  const container = document.createElement('div');
  container.className = 'image-carousel';
  
  // Process images
  const slides = [...block.children].map((slide) => {
    const img = slide.querySelector('img');
    const slideDiv = document.createElement('div');
    slideDiv.className = 'carousel-slide';
    if (img) {
      slideDiv.appendChild(img.cloneNode(true));
    }
    return slideDiv;
  });
  
  // Clone first and last slides for infinite effect
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  slides.unshift(lastClone);
  slides.push(firstClone);
  
  // Add slides to container
  slides.forEach(slide => container.appendChild(slide));
  
  // Create navigation arrows
  const createArrow = (direction) => {
    const arrow = document.createElement('button');
    arrow.className = `carousel-arrow ${direction}`;
    arrow.setAttribute('aria-label', `${direction} slide`);
    return arrow;
  };
  
  const prevArrow = createArrow('prev');
  const nextArrow = createArrow('next');
  
  // Add elements to wrapper
  wrapper.appendChild(prevArrow);
  wrapper.appendChild(container);
  wrapper.appendChild(nextArrow);
  
  // Replace block contents
  block.textContent = '';
  block.appendChild(wrapper);
  
  // Carousel logic
  let currentIndex = 1;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };
  
  const setSlidePosition = (position) => {
    container.style.transform = `translateX(${position}px)`;
  };
  
  const setTransition = (duration) => {
    container.style.transition = duration ? `transform ${duration}ms ${CAROUSEL_CONFIG.ANIMATION.TIMING}` : '';
  };
  
  const moveToSlide = (index) => {
    currentIndex = index;
    currentTranslate = -currentIndex * wrapper.offsetWidth;
    setTransition(CAROUSEL_CONFIG.ANIMATION.DURATION);
    setSlidePosition(currentTranslate);
  };
  
  const checkIndex = () => {
    setTransition(0);
    if (currentIndex === 0) {
      currentIndex = slides.length - 2;
      currentTranslate = -currentIndex * wrapper.offsetWidth;
      setSlidePosition(currentTranslate);
    }
    if (currentIndex === slides.length - 1) {
      currentIndex = 1;
      currentTranslate = -currentIndex * wrapper.offsetWidth;
      setSlidePosition(currentTranslate);
    }
  };
  
  // Event handlers
  const touchStart = (event) => {
    startPos = getPositionX(event);
    isDragging = true;
    container.classList.add(CAROUSEL_CONFIG.CLASSES.DRAGGING);
    setTransition(0);
  };
  
  const touchMove = (event) => {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
    setSlidePosition(currentTranslate);
  };
  
  const touchEnd = () => {
    isDragging = false;
    container.classList.remove(CAROUSEL_CONFIG.CLASSES.DRAGGING);
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > CAROUSEL_CONFIG.TOUCH.THRESHOLD) {
      if (movedBy > 0) {
        currentIndex -= 1;
      } else {
        currentIndex += 1;
      }
    }
    
    moveToSlide(currentIndex);
    prevTranslate = currentTranslate;
    
    setTimeout(checkIndex, CAROUSEL_CONFIG.ANIMATION.DURATION);
  };
  
  // Add event listeners
  prevArrow.addEventListener('click', () => {
    currentIndex -= 1;
    moveToSlide(currentIndex);
    setTimeout(checkIndex, CAROUSEL_CONFIG.ANIMATION.DURATION);
  });
  
  nextArrow.addEventListener('click', () => {
    currentIndex += 1;
    moveToSlide(currentIndex);
    setTimeout(checkIndex, CAROUSEL_CONFIG.ANIMATION.DURATION);
  });
  
  // Touch events
  container.addEventListener('touchstart', touchStart);
  container.addEventListener('touchmove', touchMove);
  container.addEventListener('touchend', touchEnd);
  
  // Mouse events
  container.addEventListener('mousedown', touchStart);
  container.addEventListener('mousemove', touchMove);
  container.addEventListener('mouseup', touchEnd);
  container.addEventListener('mouseleave', touchEnd);
  
  // Prevent context menu on long press
  container.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Initialize position
  moveToSlide(1);
  
  // Add this new function to create card content
  function createCardContent(slide) {
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
    
    return cardDiv;
  }
} 