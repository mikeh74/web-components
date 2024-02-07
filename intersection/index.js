// intersection observer to lazy load images

const images = document.querySelectorAll('.box');

const options = {
  rootMargin: '0px',
  // threshold: 0.1
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      console.log(entry.target);
      // observer.unobserve(entry.target);
    }
  });
}, options);

images.forEach(image => {
  observer.observe(image);
});

// Path: lazy-load-images/index.js
