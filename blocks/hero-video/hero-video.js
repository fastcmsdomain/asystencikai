const HEROVIDEO_CONFIG = {
  CLASSES: {
    CONTENT: 'herovideo-content',
    PLAYER: 'herovideo-player',
    OVERLAY: 'herovideo-overlay',
    YOUTUBE: 'herovideo-youtube',
  },
  VARIATIONS: {
    AUTOPLAY: 'autoplay',
    MUTED: 'muted',
    LOOP: 'loop',
    CONTROLS: 'controls',
  },
  VIDEO: {
    TYPE: 'video/mp4',
  },
  YOUTUBE: {
    URL_PATTERN: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
    EMBED_URL: 'https://www.youtube.com/embed/',
  },
  ERROR_MESSAGE: 'Error loading video content',
};

/**
 * Extracts YouTube video ID from URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} YouTube video ID or null if invalid
 */
function getYouTubeVideoId(url) {
  const match = url.match(HEROVIDEO_CONFIG.YOUTUBE.URL_PATTERN);
  return match ? match[1] : null;
}

/**
 * Creates an iframe element for YouTube video
 * @param {string} videoId - YouTube video ID
 * @param {HTMLElement} block - The block element to check for variations
 * @returns {HTMLIFrameElement} Configured iframe element
 */
function createYouTubeElement(videoId, block) {
  const iframe = document.createElement('iframe');
  iframe.classList.add(HEROVIDEO_CONFIG.CLASSES.PLAYER, HEROVIDEO_CONFIG.CLASSES.YOUTUBE);
  
  // Build YouTube URL with parameters
  const params = new URLSearchParams({
    enablejsapi: '1',
    rel: '0',
    modestbranding: '1',
  });

  // Add parameters based on variations
  if (block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.AUTOPLAY)) {
    params.append('autoplay', '1');
  }
  if (block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.MUTED)) {
    params.append('mute', '1');
  }
  if (block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.LOOP)) {
    params.append('loop', '1');
    params.append('playlist', videoId);
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.CONTROLS)) {
    params.append('controls', '0');
  }

  iframe.src = `${HEROVIDEO_CONFIG.YOUTUBE.EMBED_URL}${videoId}?${params.toString()}`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;

  return iframe;
}

/**
 * Creates a video element with specified attributes
 * @param {HTMLElement} block - The block element to check for variations
 * @returns {HTMLVideoElement} Configured video element
 */
function createVideoElement(block) {
  const video = document.createElement('video');
  video.classList.add(HEROVIDEO_CONFIG.CLASSES.PLAYER);

  // Set default attributes
  const attributes = {
    muted: true,
    autoplay: true,
    loop: true,
    playsInline: true,
    controls: block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.CONTROLS),
  };

  // Override defaults based on variations
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.AUTOPLAY)) {
    attributes.autoplay = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.MUTED)) {
    attributes.muted = false;
  }
  if (!block.classList.contains(HEROVIDEO_CONFIG.VARIATIONS.LOOP)) {
    attributes.loop = false;
  }

  // Apply attributes to video element
  Object.entries(attributes).forEach(([key, value]) => {
    video[key] = value;
  });

  return video;
}

/**
 * Decorates the hero video block
 * @param {HTMLElement} block - The hero video block element
 */
export default function decorate(block) {
  try {
    const videoRow = block.children[0];
    if (!videoRow) return;

    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add(HEROVIDEO_CONFIG.CLASSES.CONTENT);

    // Add video source
    const videoSource = videoRow.querySelector('a');
    if (videoSource) {
      const youtubeId = getYouTubeVideoId(videoSource.href);
      
      if (youtubeId) {
        // Handle YouTube video
        const youtubeIframe = createYouTubeElement(youtubeId, block);
        videoWrapper.appendChild(youtubeIframe);
      } else {
        // Handle MP4 video
        const video = createVideoElement(block);
        const source = document.createElement('source');
        source.src = videoSource.href;
        source.type = HEROVIDEO_CONFIG.VIDEO.TYPE;
        video.appendChild(source);
        videoWrapper.appendChild(video);
      }
    }

    // Add overlay text if present
    const overlayText = videoRow.children[1];
    if (overlayText) {
      const overlay = document.createElement('div');
      overlay.classList.add(HEROVIDEO_CONFIG.CLASSES.OVERLAY);
      overlay.innerHTML = overlayText.innerHTML;
      videoWrapper.appendChild(overlay);
    }

    block.textContent = '';
    block.appendChild(videoWrapper);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(HEROVIDEO_CONFIG.ERROR_MESSAGE, error);
  }
}
