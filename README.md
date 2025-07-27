# __Interactive Relationship Timeline__



An interactive, data‑driven timeline built with HTML, CSS, and vanilla JavaScript. Events are defined in a JSON file and rendered as dots on a proportional horizontal date line; hovering an event displays its description and an auto‑scrolling image carousel. Related events share a group identifier and are connected by smooth curves.



## 🔥 Features

Data‑Driven: Reads data.json for event metadata (title, date, description, images, group).

Proportional Positioning: Plots each event at a point between Jan 1 and Dec 31 based on its date.

Hover Interactions:

- Updates a dedicated description pane above the gallery.

- Launches a responsive, continuous-scroll image carousel.

- Linked Events: Draws curved SVG paths between events sharing the same group ID.

No Frameworks: Pure HTML/CSS/JS

## 🎬 Demo

Hover over event dots to see descriptions and image carousel.

## 🚀 Installation

Clone the repository

git clone https://github.com/JuanFVazq/Anniversary.git

cd interactive-timeline

Install a local server:

pip install http-server

Start the server and open in browser:

http-server . -p 8000

Visit http://localhost:8000 in your browser.

## 💡 Usage

Add Events: Edit data.json with your own events. Example entry:
```
{
  "date": "2025-02-14",
  "title": "Event Title",
  "description": "Details about the event.",
  "images": ["images/photo1.jpg", "images/photo2.jpg"],
  "group": "optionalGroupID"
}
```

## ⚙️ Configuration

Accent Color: Modify --accent-color in style.css (default: #C8A2C8).

Date Range: Change timeline bounds in script.js (timelineStart, timelineEnd).

Carousel Speed: Adjust speed variable in script.js (pixels/sec).

## ☁️ Deployment

Push to GitHub:

git add .
git commit -m "Initial commit"
git push origin main

GitHub Pages: Enable Pages in repo settings.

Netlify: Drag & drop folder or connect repo; set custom domain.

Vercel: Import project, deploy.


