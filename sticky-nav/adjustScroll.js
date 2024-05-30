
/**
 * This function loops over all links in the page and checks to see if they
 * are links to this current page, if they are then we replace the default
 * functionality with a scrollTo that adds a specified amount of offset to
 * the scroll.
 *
 * @param {String} selector
 * @param {Number} amount
 */
const adjustInPageScrollPosition = (
    selector = '.navSecondary', amount = 55) => {
  document.querySelectorAll(selector).forEach((navEl) => {
    updateLinks(navEl, amount);
  });
};

export default adjustInPageScrollPosition;

/**
 * 
 * @param {HTMLElement} navEl - HTML link element
 * @param {Number} amount - how many pixels to offset the scroll by
 */
function updateLinks(navEl, amount) {
  const links = navEl.querySelectorAll('a');

  links.forEach((link) => {
    const hostmatch = link.hostname === window.location.hostname;
    const pathmatch = link.pathname === window.location.pathname;

    if (hostmatch && pathmatch) {
      link.addEventListener('click', (e) => {
        const elId = link.hash.substring(1);
        const el = document.getElementById(elId);

        if (el) {
          e.preventDefault();

          const rect = el.getBoundingClientRect();
          const elOffset = link.getAttribute('data-scroll-offset');

          let offset = amount;

          if (elOffset) {
            offset = parseInt(elOffset, 10);
          }

          const scrollPosition = (window.scrollY + rect.top) - offset;

          window.scrollTo({
            'top': scrollPosition,
            'behavior': 'smooth',
          });

          if (history.pushState) {
            history.pushState(null, null, link.hash);
          }
        }
      });
    }
  });
}
