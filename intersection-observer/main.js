
/**
 * This function checks whether an element with a class of 'sticky-top'
 * is at the top of the viewport and if it is then add a class to the 
 * document body to allow to us to react to the sticky element being present
 * 
 * It uses a NodeList of elements to check over each on scroll and
 * requestAnimationFrame which should be performant enough in most situations
 * unless you have a large number of elements with 'sticky-top'.
 */
(function(){

  let ticking = false;

  let se = document.querySelectorAll('.sticky-top');

  function checkHasSticky() {
    let isStuck = false;

    se.forEach(e => {
      let r = e.getBoundingClientRect();
      if(r.y === 0){
        isStuck = true;
      }
    });

    if(isStuck){
      document.body.classList.add('has-sticky');
    } else {
      document.body.classList.remove('has-sticky');
    }
  }

  document.addEventListener("scroll", (event) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkHasSticky();
        ticking = false;
      });

      ticking = true;
    }
  });
})();
