let currentCarousel = null;
const groupMap = {};

function showCarousel(mediaFiles) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = "";

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  let mediaPromises = [];

  function addMedia(src) {
    const ext = src.split('.').pop().toLowerCase();
    let element;

    if (ext === 'mp4') {
      element = document.createElement("video");
      element.src = src;
      element.controls = true;
      element.loop = true;
      element.muted = true;
      element.autoplay = true;
      element.volume = 0.5;
      element.style.maxHeight = "250px";
    } else {
      element = document.createElement("img");
      element.src = src;
      element.alt = "Carousel Media";
    }

    carousel.appendChild(element);

    return new Promise(resolve => {
      element.onloadeddata = resolve;
      element.onload = resolve;
      element.onerror = resolve;
    });
  }

  mediaFiles.forEach(src => {
    mediaPromises.push(addMedia(src));
  });

  gallery.appendChild(carousel);

  Promise.all(mediaPromises).then(() => {
    const galleryWidth = gallery.offsetWidth;
    const contentWidth = carousel.scrollWidth;

    if (contentWidth > galleryWidth) {
      mediaFiles.forEach(src => {
        addMedia(src);
      });

      const speed = 100; // px/sec
      const scrollableWidth = carousel.scrollWidth / 2;
      const duration = scrollableWidth / speed;
      carousel.style.animationDuration = `${duration}s`;
    } else {
      carousel.style.animation = "none";
      carousel.style.justifyContent = "center";
    }
  });

  currentCarousel = carousel;
}

function drawLinkedCurves() {
  const svg = document.querySelector('.link-svg');
  svg.innerHTML = "";

  const timelineRect = document.querySelector('.timeline').getBoundingClientRect();

  for (const group in groupMap) {
    if (groupMap[group].length >= 2) {
      const dot1 = groupMap[group][0];
      const dot2 = groupMap[group][groupMap[group].length - 1];

      const rect1 = dot1.getBoundingClientRect();
      const rect2 = dot2.getBoundingClientRect();

      const x1 = rect1.left + rect1.width / 2 - timelineRect.left;
      const y1 = rect1.top + rect1.height / 2 - timelineRect.top;
      const x2 = rect2.left + rect2.width / 2 - timelineRect.left;
      const y2 = rect2.top + rect2.height / 2 - timelineRect.top;

      const cx = (x1 + x2) / 2;
      const cy = Math.min(y1, y2) - 50;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", "#C8A2C8");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");

      svg.appendChild(path);
    }
  }
}

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error(`Error loading JSON: ${response.status}`);
    return response.json();
  })
  .then(data => {
    const timeline = document.querySelector('.timeline');
    const descriptionContainer = document.querySelector('.description');
    const timelineStart = new Date(2025, 0, 1);
    const timelineEnd = new Date(2025, 11, 31);

    data.forEach(event => {
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);

      let percentage;
      if (eventDate < timelineStart) percentage = 0;
      else if (eventDate > timelineEnd) percentage = 100;
      else percentage = ((eventDate - timelineStart) / (timelineEnd - timelineStart)) * 100;

      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dot.style.left = percentage + "%";

      dot.addEventListener("mouseover", () => {
        descriptionContainer.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>${eventDate.toDateString()}</strong></p>
          <p>${event.description}</p>
        `;

        let imgs = [];
        if (event.images && event.images.length > 0) {
          imgs = event.images;
        } else if (event.image) {
          imgs = [event.image];
        }
        if (imgs.length > 0) {
          showCarousel(imgs);
        }
      });

      timeline.appendChild(dot);

      if (event.group) {
        if (!groupMap[event.group]) groupMap[event.group] = [];
        groupMap[event.group].push(dot);
      }
    });

    setTimeout(drawLinkedCurves, 100);
  })
  .catch(error => {
    console.error(error);
    document.querySelector('.timeline').innerHTML = "Error loading timeline.";
  });

window.addEventListener("click", () => {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.15;
    bgMusic.play().catch(e => {
      console.log("Autoplay blocked:", e);
    });
  }
}, { once: true });
