
//lazy load images using intersection observer
const images = document.querySelectorAll("[data-src]");
const config = {
  rootMargin: "0px 0px 50px 0px",
  threshold: 0
};

let loaded = 0;

// The observer for the images on the page
let observer = new IntersectionObserver(onIntersection, config);
images.forEach(image => {
  observer.observe(image);
});

function onIntersection(entries) {
  // Loop through the entries
  entries.forEach(entry => {
    // Are we in viewport?
    if (entry.intersectionRatio > 0) {
      // Stop watching and load the image
      observer.unobserve(entry.target);
      preloadImage(entry.target);
    }
  });
}

function preloadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {
    return;
  }
  img.src = src;
  loaded++;
  if(loaded === images.length){
    document.body.classList.add('images-loaded');
  }
}
