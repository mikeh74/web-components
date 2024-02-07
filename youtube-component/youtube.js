
class YoutubeComponent extends HTMLElement {

  // connect component
  connectedCallback() {
   this.textContent = 'Hello World!';
 }
}

// register component
customElements.define( 'youtube-player', YoutubeComponent);

const youtubeSetup = function (window) {

  /**
   * Youtube player setup
   */
  function loadYoutubeScript() {
    const tag = document.createElement('script');
    tag.id = 'iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = () => {
    addClickListeners();
  };

  /**
   * Play video once it's loaded
   *
   * @param {event} event
   *
   */
  window.onPlayerReady = (event) => {
    event.target.playVideo();
  };

  /**
   * Add event listeners for images which has youtube id
   */
  function addClickListeners() {
    const els = document.querySelectorAll(
      '[data-youtubeid]');
    els.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();

        const t = e.currentTarget;
        const ytId = t.getAttribute('data-youtubeid');

        if (ytId !== '') {
          window['player'] = new YT.Player(el, {
            videoId: ytId,
            events: {
              'onReady': onPlayerReady,
            },
            playerVars: {
              'rel': 0,
            },
          });
        }
      });
    });
  }
  loadYoutubeScript();
}

youtubeSetup(window);

