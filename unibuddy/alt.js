
const appendUnibuddyIframeToHolder = function (el) {

  const iframe = document.createElement('iframe');
  iframe.id = 'unibuddy-iframe';
  iframe.src = 'https://unibuddy.co/embed/ucen-manchester/colour/204c82';
  iframe.width = '100%';
  iframe.title = 'Unibuddy';
  el.appendChild(iframe);
};

const loadUnibuddyIframeScript = function () {

  let isLoaded = false;

  return function () {
    if (isLoaded) return;

    // create script element and append to the body of the page
    const script = document.createElement('script');
    script.src = 'https://cdn.unibuddy.co/unibuddy-iframe.js';
    script.onload = function () {
      isLoaded = true;
    };
    document.body.appendChild(script);
  }
}();

const initUnibuddyIframes = function () {

  const handleIntersect = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadUnibuddyIframeScript();
        appendUnibuddyIframeToHolder(entry.target);
        observer.unobserve(entry.target);
      }
    });
  };

  // create intersection observer to check for when an element with the class
  // 'unibuddy-iframe-holder' is in view and then run the function to append
  // the iframe to the holder
  const observer = new IntersectionObserver(
    handleIntersect, { rootMargin: '0px' });

  document.querySelectorAll('.unibuddy-iframe-holder')
    .forEach(holder => {
      observer.observe(holder);
    });
};

window.addEventListener('load', function () {
  initUnibuddyIframes();
});
