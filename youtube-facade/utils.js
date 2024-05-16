
/**
 * Additional utility functions to make working with youtube facades a bit easier
 *
 */

/**
 * Simple funcriona
 * 
 */
const refocus = function(el) {
    let focusElement = null;
  
    return function(el) {
      if (el) {
        focusElement = el;
      } else if (focusElement && focusElement.focus) {
        focusElement.focus();
      }
    };
  }();
  
  const modal = () => {
    return `
    <div class="modal modal-youtube fade" id="yf-modal" tabindex="-1"
      role="dialog">
      <div class="modal-youtube-inner">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
              <button id="close-youtube-player" type="button" class="close"
                data-dismiss="modal" aria-label="Close">CLOSE ×</button>
            <div class="modal-body modal-body-youtube">
              <div class="embed-responsive embed-responsive-16by9">
                <div id="yf-modal-placeholder" class="embed-responsive-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  };
  
  export const addModal = (modalId, targetElementId) => {
    // if already injected then exit early
    if (document.getElementById(modalId)) return;
  
    // handle the close modal stuff
    document.body.insertAdjacentHTML('beforeend', modal());
    $(`#${modalId}`).on('hidden.bs.modal', function() {
      const targetEl = document.getElementById(targetElementId);
      targetEl.innerHTML = '';
      targetEl.classList.remove('youtube-activated');
      refocus();
    });
  };

  export const addModalTriggers = (els) => {
    els.forEach((el) => {
      el.addEventListener('click', function(e) {
        // eslint-disable-next-line max-len
        if (el.getAttribute('data-youtube-id') && el.getAttribute('data-youtube-modal')) {
          $(`#yf-modal`).modal();
          refocus(el);
        };
      });
    });
  };
  