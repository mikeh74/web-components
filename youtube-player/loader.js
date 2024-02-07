// set use strict for this script
'use strict';

// function that returns an object with a promise that resolves when the script is loaded
const loader = (() => {
  let scriptLoaded = false;
  let cachedPromise = null;

  function loadYoutubeApi() {
    if (!cachedPromise) {
      // If no cached promise exists, create a new one
      cachedPromise = new Promise((resolve, reject) => {
        // Perform some asynchronous operation
        if (scriptLoaded === false) {
          const script = document.createElement('script');
          script.id = 'youtube-iframe-api';
          script.src = 'https://www.youtube.com/iframe_apix';
          script.onload = function () {
            scriptLoaded = true;
            // console.log(['script loaded', this.scriptLoaded])
            resolve(scriptLoaded);
          };
          script.onerror = function () {
            reject(new Error('Failed to load Youtube script.'));
          };
          document.head.append(script);
        } else {
          resolve();
        }
      }).finally(() => {
        // Reset the cached promise once it's settled (fulfilled or rejected)
        // scriptLoaded = true;
        cachedPromise = null;
      });
    }

    return cachedPromise;
  }

  return {
    loadYoutubeApi
  };
})();

loader.loadYoutubeApi().then(
  (scriptLoaded) => console.log([41,scriptLoaded]))
  .catch((err) => console.log([42, err]));
loader.loadYoutubeApi().then((scriptLoaded) => console.log([45, scriptLoaded, 'loadedAgain']));
