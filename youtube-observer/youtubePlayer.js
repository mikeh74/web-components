/**
 * Youtube player setup - load script and add event listeners
 *
 * Converted to using a promise wrapper in a closure to avoid loading the script
 * multiple times and the promise gives an opportunity to clean up/ deal with
 * with errors if the script fails to load.
 *
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
    }

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
 * @param {event} event
 *
 * When a player is ready start playing the video
 */
window.onYoutubePlayerReady = function (event) {
  event.target.playVideo();
};

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

let clickHandlersAdded = false;

const addClickHandlers = function(els, selector){
  if(clickHandlersAdded) return;
  clickHandlersAdded = true;
  els.forEach((el) => {
    init(el, selector);
  });
};

// need to decide whether it's a play in place or a modal
const init = (el, selector) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    const chrs = selector.split('');

    let str;

    // remove square brackets from selector if present
    if (chrs[0] === '[') {
      str = selector.substring(1, chrs.length - 1);
    } else {
      str = selector;
    }

    const id = el.getAttribute(str);
    const playInModal = el.getAttribute('data-youtube-modal');

    let playerContainer;

    if (playInModal !== undefined && playInModal === 'true') {
      const mod = document.querySelector('#youtubeModal');
      if (mod === null) {
        document.body.insertAdjacentHTML('beforeend', modal());

        $('#youtubeModal').on('hidden.bs.modal', function () {
          window['ytIframePlayer'].destroy();
        });
      };

      playerContainer = 'ytIframePlayer';
      createPlayer(playerContainer, id);
      $('#youtubeModal').modal();
    } else {
      const img = el.querySelector('img');
      playerContainer = img.id;
      const container = event.currentTarget.closest('.youtube-container');
      container.classList.add('playing');
      createPlayer(playerContainer, id);
    }
  });
};

/**
 * Default function to configure component
 *
 * @param {string} selector
 */
export default function (selector = '[data-youtube-id]') {
  const els = document.querySelectorAll(selector);

  /**
   * Once the script has successfully loaded then we remove all the other
   * observers as they are no longer needed
   *
   * @param {*} els
   * @param {*} observer
   */
  const removeObservers = (els, observer) => {
    els.forEach((el) => {
      observer.unobserve(el);
    });
  };

  if (typeof els !== 'undefined') {
    /**
     *
     * @param {NodeList} entries
     * @param {IntersectionObserver} observer
     */
    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          youtubeScriptLoad().then(() => {
            removeObservers(els, observer);
            addClickHandlers(els, selector);
          }).catch((error) => {
            console.log(error);
          });
        };
      });
    };

    const options = {
      root: null,
      rootMargin: '0px 0px',
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    els.forEach((el) => {
      observer.observe(el);
    });
  };
}
