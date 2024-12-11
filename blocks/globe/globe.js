// Configuration object for the globe block
const GLOBE_CONFIG = {
    IMAGE_SRC: '/path/to/your/image.png', // Path to the globe image
    ROTATION_DURATION: 10000, // Duration for a full rotation in milliseconds
};

// Default export function to decorate the globe block
export default async function decorate(block) {
    // Create the globe container
    const globeContainer = document.createElement('div');
    globeContainer.classList.add('globe');

    // Create the image element
    const globeImage = document.createElement('img');
    globeImage.src = GLOBE_CONFIG.IMAGE_SRC;
    globeImage.alt = 'Rotating Globe';
    globeContainer.appendChild(globeImage);

    // Append the globe container to the block
    block.appendChild(globeContainer);

    // Start the rotation animation
    globeContainer.style.animation = `rotate ${GLOBE_CONFIG.ROTATION_DURATION}ms linear infinite`;
} 