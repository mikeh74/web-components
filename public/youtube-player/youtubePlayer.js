
/**
 * Found here: https://davidwalsh.name/javascript-once
 *
 * @param {*} fn 
 * @param {*} context 
 * @returns 
 */
function once(fn, context) {
  var result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}

/**
 * 
 * loadScriptPromise - Closure that returns a function and stores the function in a cache.
 * 
 */
const loadScript = (() => {
  let cachedPromise = null;

  return () => {

    if (cachedPromise) return cachedPromise;
    cachedPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onload = () => {
        YT.ready(resolve);
      };
      script.onerror = reject;
      document.head.append(script);
    }).finally(() => {
      // Reset the cached promise after the promise is resolved/ rejected
      cachedPromise = null;
    });

    return cachedPromise;
  };
})();

/**
 * Promise that resolves when the YouTube script is loaded.
 * @type {Promise<void>}
 */
const loadScript = new Promise((resolve, reject) => {
  // check if it's already loaded and resolve promise if it is
  if (window.YT || (window.YT && window.YT.Player)) {
    resolve();
  } else {
    var el = document.createElement('script');
    el.src = 'https://www.youtube.com/iframe_api';
    el.async = true;
    el.onload = () => {
      YT.ready(resolve);
    };
    el.onerror = reject;
    document.head.append(el);
  };
});

/**
 * @param {event} event
 *
 * When a player is ready start playing the video then play it.
 */
window.onYoutubePlayerReady = function (event) {
  event.target.playVideo();
};


/**
 * Creates a YouTube player inside the specified container.
 * @param {string} playerContainer - The ID or DOM element of the container
 *  where the player will be created.
 * @param {string} youtubeId - The YouTube video ID.
 */
const createPlayer = (playerContainer, youtubeId) => {
  window[playerContainer] = new YT.Player(playerContainer, {
    height: '450',
    width: '800',
    videoId: youtubeId,
    host: 'https://www.youtube-nocookie.com',
    events: {
      'onReady': onYoutubePlayerReady,
    },
    playerVars: {
      'rel': 0,
    },
  });
};


/**
 * Returns the HTML markup for a YouTube modal.
 * @returns {string} The HTML markup for the YouTube modal.
 */
const modal = () => {
  return `
  <div class="modal modal-youtube fade" id="youtubeModal" tabindex="-1"
    role="dialog">
    <div class="modal-youtube-inner">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
            <button id="close-youtube-player" type="button" class="close"
              data-dismiss="modal" aria-label="Close">CLOSE</button>
          <div class="modal-body modal-body-youtube">
            <div class="embed-responsive embed-responsive-16by9">
              <div id="ytIframePlayer" class="embed-responsive-item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};


/**
 * Initializes the YouTube elements.
 *
 * @param {HTMLElement} el - The element to attach the click event to.
 */
const addClickEventListeners = (el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();

    const id = el.getAttribute('data-youtube-id');
    const youtubeModal = el.getAttribute('data-youtube-modal');

    // need to decide whether it's a play in place or a modal
    if (youtubeModal !== undefined && youtubeModal === 'true') {
      playInModal(id);
    } else {
      playInline(el, event, id);
    }
  });
};

/**
 * Wrapper function to ensure that the init function is only called once.
 */
const init = once((els) => {
  els.forEach((el) => {
    addClickEventListeners(el);
  });
});

/**
 * Create a modal and play the video inside it.
 * 
 * @param {string} id
 */
function playInModal(id) {
  const modalElement = document.querySelector('#youtubeModal');
  if (modalElement === null) {
    document.body.insertAdjacentHTML('beforeend', modal());
  }

  let playerContainer = 'ytIframePlayer';
  createPlayer(playerContainer, id);
  $('#youtubeModal').modal();

  $('#youtubeModal').on('hidden.bs.modal', function () {
    window['ytIframePlayer'].destroy();
  });
}

/**
 * Plays a YouTube video inline.
 *
 * @param {HTMLElement} el - The element that triggered the play action.
 * @param {Event} event - The event object.
 * @param {string} id - The YouTube video ID.
 */
function playInline(el, event, id) {
  const img = el.querySelector('img');
  let playerContainer = img.id;
  const container = event.currentTarget.closest('.youtube-container');
  container.classList.add('playing');
  createPlayer(playerContainer, id);
}

/**
 * Default function to configure component
 *
 * @param {string} selector
 */
export default function (selector = '[data-youtube-id]') {
  const els = document.querySelectorAll(selector);

  if (typeof els !== 'undefined') {

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadScript().then(() => {
            init(els);
            // We are safe to stop observing now
            els.forEach(el => {
              observer.unobserve(el);
            });
          });
        };
      });
    };

    const createObserver = (els) => {
      let observer;
      let options = {
        root: null,
        rootMargin: "33% 0px",
      };
      observer = new IntersectionObserver(handleIntersect, options);

      els.forEach(el => {
        observer.observe(el);
      });
    };

    createObserver(els);
  }
}
