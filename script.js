// Global variable to track the current carousel (if needed in the future)
let currentCarousel = null;

function showCarousel(images) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ""; // Clear previous content

  // Create the carousel container
  const carousel = document.createElement("div");
  carousel.className = "carousel";

  // Insert each image into the carousel
  images.forEach(src => {
    const imgEl = document.createElement("img");
    imgEl.src = src;
    imgEl.alt = "Carousel Image";
    carousel.appendChild(imgEl);
  });

  // Duplicate the images for seamless looping
  images.forEach(src => {
    const imgEl = document.createElement("img");
    imgEl.src = src;
    imgEl.alt = "Carousel Image";
    carousel.appendChild(imgEl);
  });

  gallery.appendChild(carousel);

  // After the carousel is rendered, measure widths to set animation duration
  // The effective scroll distance is half of the carousel's total width (the original set)
  const originalWidth = carousel.scrollWidth / 2;
  const galleryWidth = gallery.offsetWidth;
  const speed = 100; // pixels per second

  // Only animate if the content exceeds the gallery width
  if (carousel.scrollWidth > galleryWidth) {
    const duration = originalWidth / speed; // seconds
    carousel.style.animationDuration = `${duration}s`;
  } else {
    // If not overflowing, remove animation so images stay static
    carousel.style.animation = "none";
  }

  currentCarousel = carousel;
}

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Loaded events:", data);
    const timeline = document.querySelector('.timeline');

    // Timeline boundaries for 2025
    const timelineStart = new Date("2025-01-01");
    const timelineEnd = new Date("2025-12-31");

    data.forEach(event => {
      const eventDate = new Date(event.date);
      let percentage;
      if (eventDate < timelineStart) {
        percentage = 0;
      } else if (eventDate > timelineEnd) {
        percentage = 100;
      } else {
        percentage = ((eventDate - timelineStart) / (timelineEnd - timelineStart)) * 100;
      }

      // Create the event dot and position it on the timeline
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dot.style.left = percentage + "%";

      // Create popup with event title, date, and description (no images)
      const popup = document.createElement('div');
      popup.className = 'event-popup';
      popup.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>${new Date(event.date).toDateString()}</strong></p>
        <p>${event.description}</p>
      `;
      dot.appendChild(popup);

      // On hover, update the gallery with event images as a scrolling carousel
      dot.addEventListener("mouseover", () => {
        let imgs = [];
        if (event.images) {
          imgs = event.images;
        } else if (event.image) {
          imgs = [event.image];
        }
        if (imgs.length > 0) {
          showCarousel(imgs);
        }
      });

      timeline.appendChild(dot);
    });
  })
  .catch(error => {
    console.error('Error loading data:', error);
    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = "<p>Error loading events. Check the console for details.</p>";
  });
