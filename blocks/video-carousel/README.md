# Video Carousel Block

A responsive carousel block for displaying YouTube videos with navigation controls.

## Features

- Responsive video display
- Previous/Next navigation
- Automatic YouTube URL parsing
- Lazy loading of iframes
- Mobile-friendly design
- Keyboard navigation support

## Usage

Create a table with YouTube video URLs:

| Video Carousel                             |
| ------------------------------------------ |
| https://www.youtube.com/watch?v=VIDEO_ID_1 |
| https://www.youtube.com/watch?v=VIDEO_ID_2 |
| https://youtu.be/VIDEO_ID_3                |

## Configuration

### CSS Variables

- `--carousel-height`: Height of the carousel
- `--carousel-max-height`: Maximum height constraint
- `--carousel-nav-size`: Size of navigation buttons
- `--carousel-nav-color`: Navigation button color
- `--carousel-nav-bg`: Navigation button background

## Accessibility

- ARIA labels on navigation buttons
- Keyboard navigation support
- Proper focus management
- Screen reader friendly structure

## Performance

- Lazy loading of video iframes
- Optimized animations
- Minimal DOM manipulation
