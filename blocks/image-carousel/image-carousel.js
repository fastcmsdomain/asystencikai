const CAROUSEL_CONFIG = {
  ANIMATION: {
    DURATION: 300,
    TIMING: 'var(--hover-animation-curve)',
  },
  CLASSES: {
    ACTIVE: 'active',
    DRAGGING: 'dragging',
  },
  TOUCH: {
    THRESHOLD: 50,
  },
  CARD: {
    GAP: 'var(--spacing-s)',
    VISIBLE: 4,
  }
};

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
  [...block.children].forEach((slide) => {
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
  });
  
  // Assemble structure
  carouselWrapper.appendChild(slidesContainer);
  mainWrapper.appendChild(header);
  mainWrapper.appendChild(carouselWrapper);
  block.textContent = '';
  block.appendChild(mainWrapper);
} 