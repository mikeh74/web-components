// Intended to implement a facade patter for loading youtube.
// This follows the embed facade patterns recommended on the web.dev site

// It takes a lot of inspiration from the Paul Irish component:
// https://github.com/paulirish/lite-youtube-embed/tree/master
// 
// But due to other requirements we have rewritten this so it is a library that you can attach to exists elements via data attributes

/**
 * Add a <link rel={preload | preconnect} ...> to the head
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

const warmConnections = function () {
  let preconnected = false;

  return function () {
    if (preconnected) return;
    // The iframe document and most of its subresources come right off youtube.com
    addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
    // The botguard script is fetched off from google.com
    addPrefetch('preconnect', 'https://www.google.com');
    preconnected = true;
  }
}();

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
        console.log("YT loaded");
      };
      el.onerror = rej;
      document.head.append(el);
    });

    // otherwise return the promise
    awaitingResponse = loadScript;
    return loadScript;
  };
}();


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

const needsYTApiForAutoplay = () => navigator.vendor.includes('Apple') || navigator.userAgent.includes('Mobi')

async function addIframe(targetEl, youtubeId, initparams) {
  if (targetEl.classList.contains('youtude-activated')) return;
  targetEl.classList.add('youtube-activated');

  const params = new URLSearchParams(initparams || []);
  params.append('autoplay', '1');
  params.append('playsinline', '1');

  // if (needsYTApiForAutoplay()) {
  //     return addYTPlayerIframe(targetEl, params);
  // }

  const iframeEl = document.createElement('iframe');
  iframeEl.width = 560;
  iframeEl.height = 315;

  // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include

  // iframeEl.title = .getAttribute('data-youtube-el-title');
  iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframeEl.allowFullscreen = true;

  // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
  // https://stackoverflow.com/q/64959723/89484
  iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?${params.toString()}`;
  targetEl.innerHTML = '';
  targetEl.append(iframeEl);

  // Set focus for a11y
  iframeEl.focus();
};

export { addIframe }
export default function youtubeSetup(selector) {
  console.log("We exported it!");

  const els = document.querySelectorAll(selector);
  els.forEach(el => {
    el.addEventListener('click', function () {
      console.log("clicked");

      if (el.getAttribute('data-youtube-id')) {

        if(el.getAttribute('data-youtube-modal')){
          let target = document.getElementById('youtube-modal');
          $('.bd-example-modal-lg').modal();
          addIframe(target, el.getAttribute('data-youtube-id'));
        } else {
          addIframe(el, el.getAttribute('data-youtube-id'));
        };
      };
    });
  });
};
