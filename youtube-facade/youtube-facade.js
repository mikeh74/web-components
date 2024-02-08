/**
 * @fileoverview Implements a facade pattern for loading YouTube videos.
 * This module provides functions for preconnecting to essential domains,
 * loading the YouTube iframe API script, adding a YouTube player iframe to an
 * element, checking if the YouTube API is needed for autoplay, and setting up
 * the YouTube player.
 *
 * This follows the embed facade patterns recommended on the web.dev site
 *
 * It takes a lot of inspiration (and code) from the Paul Irish component:
 * https://github.com/paulirish/lite-youtube-embed/tree/master
 *
 * But due to other requirements we have rewritten this so it is a library that
 * you can attach to exists elements via data attributes
 *
 * @see {@link https://web.dev/embedding-modern-media/}
 * @see {@link https://developer.chrome.com/docs/lighthouse/performance/third-party-facades/}
 * @see {@link https://github.com/paulirish/lite-youtube-embed/tree/master}
 *
 * @module youtube-facade
 */

/**
 * Adds a prefetch link to the document head.
 * Add a <link rel={preload | preconnect} ...> to the head
 * 
 * @param {string} kind - The relationship between the current document and the linked resource.
 * @param {string} url - The URL of the linked resource.
 * @param {string} [as] - The type of the linked resource.
 */

/**
 * Adds a prefetch link to the document head.
 * Add a <link rel={preload | preconnect} ...> to the head
 * 
 * @param {string} kind - The relationship between the current document and the linked resource.
 * @param {string} url - The URL of the linked resource.
 * @param {string} [as] - The type of the linked resource.
 */
const addPrefetch = function (kind, url, as) {
  const linkEl = document.createElement('link');
  linkEl.rel = kind;
  linkEl.href = url;
  if (as) {
    linkEl.as = as;
  }
  document.head.append(linkEl);
}


/**
 * Warms up the connections by preconnecting to essential domains.
 * @returns {Function} - A function that preconnects to essential domains.
 */
const warmConnections = function () {
  let preconnected = false;

  return function () {
    if (preconnected) return;
    addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
    addPrefetch('preconnect', 'https://www.google.com');

    // Not certain if these ad related domains are in the critical path.
    // Could verify with domain-specific throttling.
    addPrefetch('preconnect', 'https://googleads.g.doubleclick.net');
    addPrefetch('preconnect', 'https://static.doubleclick.net');

    preconnected = true;
  }
}();

/**
 * Load the youtube iframe API script.
 * 
 * @returns {Promise} - A promise that resolves when the script is loaded.
 */
const youtubeScriptLoad = function () {
  let awaitingResponse = null;

  return function () {
    // don't load if we already have global YT object
    if (window.YT || (window.YT && window.YT.Player)) {
      return Promise.resolve(console.log('already loaded'));
    }
    // return the current promise if already called and not yet resolved
    if (awaitingResponse) {
      return awaitingResponse;
    };

    const loadScript = new Promise((res, rej) => {
      const el = document.createElement('script');
      el.src = 'https://www.youtube.com/iframe_api';
      el.id = 'youtube-iframe-api';
      el.async = true;
      el.onload = (_) => {
        YT.ready(res);
      };
      el.onerror = rej;
      document.head.append(el);
    });

    // otherwise return the promise
    awaitingResponse = loadScript;
    return loadScript;
  };
}();

/**
 * Add a youtube player iframe to the element.
 * 
 * @param {HTMLElement} el - The element to add the iframe to.
 * @param {URLSearchParams} params - The URLSearchParams object containing the parameters for the iframe.
 * @param {string} youtubeId - The youtube video id.
 * @returns {Promise} - A promise that resolves when the iframe is added.
 */

async function addYTPlayerIframe(el, params, youtubeId) {

  await youtubeScriptLoad();

  const videoPlaceholderEl = document.createElement('div');
  el.append(videoPlaceholderEl);

  const paramsObj = Object.fromEntries(params.entries());

  new YT.Player(videoPlaceholderEl, {
    width: '100%',
    videoId: youtubeId,
    playerVars: paramsObj,
    events: {
      'onReady': event => {
        event.target.playVideo();
      }
    }
  });
};

/**
 * Check if the youtube API is needed for autoplay.
 *  
 * @returns {boolean} - True if the youtube API is needed for autoplay, false otherwise.
 */
const needsYTApiForAutoplay = () => navigator.vendor.includes('Apple') || navigator.userAgent.includes('Mobi')

/**
 * Add an iframe to the element.
 * 
 * @param {HTMLElement} targetEl - The element to add the iframe to.
 * @param {string} youtubeId - The youtube video id.
 * @param {URLSearchParams} initparams - The URLSearchParams object containing the parameters for the iframe.
 * @returns {Promise} - A promise that resolves when the iframe is added.
 */
async function addIframe(targetEl, youtubeId, initparams) {
  if (targetEl.classList.contains('youtube-activated')) return;
  targetEl.classList.add('youtube-activated');

  const params = new URLSearchParams(initparams || []);
  params.append('autoplay', '1');
  params.append('playsinline', '1');

  if (needsYTApiForAutoplay()) {
    targetEl.innerHTML = '';
    return addYTPlayerIframe(targetEl, params, youtubeId);
  }

  const iframeEl = document.createElement('iframe');
  // iframeEl.classList.add('youtube-iframe');

  // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
  // iframeEl.title = .getAttribute('data-youtube-el-title');
  iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframeEl.allowFullscreen = true;

  // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
  // https://stackoverflow.com/q/64959723/89484
  iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?${params.toString()}`;
  targetEl.innerHTML = '';
  targetEl.append(iframeEl);
  // targetEl.classList.add('youtube-activated');

  // Set focus for a11y
  iframeEl.focus();
};

/**
 * Setup the youtube player.
 *
 * @param {string} selector - The selector for the youtube elements.
 * @param {string} [youtubeModalElement] - The selector for the youtube modal element.
 */
export default function youtubeSetup(selector, youtubeModalElement) {

  // if we don't have a selector then set a default
  youtubeModalElement = youtubeModalElement || '.youtube-modal-container'

  // For bootstrap 4 to remove the youtube element when the 
  $(youtubeModalElement).on('hidden.bs.modal', function () {
    document.getElementById('youtube-modal').innerHTML = '';
  });

  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    el.addEventListener('click', function () {
      if (el.getAttribute('data-youtube-id')) {

        if (el.getAttribute('data-youtube-modal')) {
          let target = document.getElementById('youtube-modal');
          $(youtubeModalElement).modal();
          addIframe(target, el.getAttribute('data-youtube-id'));
        } else {
          addIframe(el, el.getAttribute('data-youtube-id'));
        };
      };
    });

    /**
     * Warm connections.
     * We only need to do this if we're loading the full API though?
     */
    el.addEventListener('mouseenter', function () {
      warmConnections();
    }, { once: true });
  });
};
