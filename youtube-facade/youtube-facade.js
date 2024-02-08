/**
 * @fileoverview Implements a facade pattern for loading YouTube videos.
 * This module provides functions for preconnecting to essential domains,
 * loading the YouTube iframe API script, adding a YouTube player iframe to an
 * element, checking if the YouTube API is needed for autoplay, and setting up
 * the YouTube player.
 *
 * It takes a lot of inspiration (and code) from the Paul Irish component:
 * https://github.com/paulirish/lite-youtube-embed/tree/master
 *
 * But due to other requirements we have rewritten this so it is a library that
 * you can attach to existing elements via data attributes
 *
 * The following functions are only required if the browser doesn't allow
 * autoplay with the standard iframe:
 *  - addPrefetch
 *  - warmConnections
 *  - youtubeScriptLoaded
 *  - addYTPlayerIframe
 *  - needsYTApiForAutoplay
 *
 * @see {@link https://developer.chrome.com/docs/lighthouse/performance/third-party-facades/}
 * @see {@link https://github.com/paulirish/lite-youtube-embed/tree/master}
 *
 * @module youtube-facade
 */

/**
 * Utility function - Adds a prefetch link to the document head.
 * Add a <link rel={preload | preconnect} ...> to the head
 *
 * @param {string} kind - The relationship between the current document and
 *  the linked resource.
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
};

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
  };
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
 * @param {URLSearchParams} params - The URLSearchParams object containing the
 *  parameters for the iframe.
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
      'onReady': (event) => {
        event.target.playVideo();
      },
    },
  });
};

/**
 * Check if the youtube API is needed for autoplay.
 *
 * @return {boolean} - True if the youtube API is needed for autoplay,
 *  false otherwise.
 */
const needsYTApiForAutoplay = () => navigator.vendor.includes('Apple') || navigator.userAgent.includes('Mobi');

/**
 * Add an iframe to the element.
 *
 * @param {HTMLElement} targetEl - The element to add the iframe to.
 * @param {string} youtubeId - The youtube video id.
 * @param {URLSearchParams} initparams - The URLSearchParams object containing
 *  the parameters for the iframe.
 * @param {string} title
 * @return {Promise} - A promise that resolves when the iframe is added.
 */
async function addYoutubeIframe(targetEl, youtubeId, initparams, title) {
  // if it's already active then we don't need to do anything
  if (targetEl.classList.contains('youtube-activated')) return;
  targetEl.classList.add('youtube-activated');

  const params = new URLSearchParams(initparams || []);
  params.append('autoplay', '1');
  params.append('playsinline', '1');
  params.append('rel', '0');

  if (needsYTApiForAutoplay()) {
    targetEl.innerHTML = '';
    return addYTPlayerIframe(targetEl, params, youtubeId, title);
  }

  const iframeEl = document.createElement('iframe');
  iframeEl.classList.add('youtube-iframe');

  // No encoding necessary as [title] is safe.
  // https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
  if (title) {
    iframeEl.title = title;
  }
  iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframeEl.allowFullscreen = true;

  // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only
  //  because this is a URL
  // https://stackoverflow.com/q/64959723/89484
  iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?${params.toString()}`;
  targetEl.innerHTML = '';
  targetEl.append(iframeEl);
  // targetEl.classList.add('youtube-activated');

  // Set focus for a11y
  iframeEl.focus();
};

/**
 * Setup the youtube player. This is the entry point for using this
 * module.
 *
 * Here is an example of importing and using the script
 *
 * @param {string} selector - The selector for the youtube elements.
 * @param {string} [targetElementId] - The selector for the youtube
 *  modal element.
 */
export default function youtubeSetup(selector, targetElementId) {
  // if we don't have an id string selector then set a default
  targetElementId = targetElementId || 'youtube-modal';

  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
    el.addEventListener('click', function () {
      if (el.getAttribute('data-youtube-id')) {
        if (el.getAttribute('data-youtube-modal')) {
          const target = document.getElementById(targetElementId);
          addYoutubeIframe(target, el.getAttribute('data-youtube-id'));
        } else {
          addYoutubeIframe(el, el.getAttribute('data-youtube-id'));
        };
      };
    });

    /**
     * Warm connections.
     * We only need to do this if we're loading the full API though
     */
    if (needsYTApiForAutoplay()) {
      el.addEventListener('mouseenter', function () {
        warmConnections();
      }, { once: true });
    };
  });
};
