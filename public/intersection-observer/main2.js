
// need a function with a closure
const stickyObserverCallback = (function () {

  let stickyElement;
  let stickyElements = [];
  let hasSticky = false;

  window.stickyElements = stickyElements;

  return function (entries) {

    let mysticky = false;

    document.querySelectorAll('.sticky-top').forEach(el => {

      let r = el.getBoundingClientRect();

      if(r.y <= 0 && r.y >= 1){
        mysticky = true;
      }
    });

    if(mysticky){
      document.body.classList.add('fooabr');
    } else {
      document.body.classList.add('fooabr');
    }

    // local
    let observeSticky = false;
    let observeStickyElement;

    /**
     * loop through entries and check each to see if it's in a sticky position
     */
    entries.forEach(entry => {
      if (entry.intersectionRatio <= 0){

        stickyElements = stickyElements.filter(el => {
          console.log(el.isEqualNode(entry.target));
          return el.isEqualNode(entry.target);
        });

      };
      const rect = entry.boundingClientRect;

      if (rect.y <= 1) {
        observeStickyElement = entry.target;
        stickyElement = entry.target;

        if(!stickyElements.includes(entry.target)){
          stickyElements.push(entry.target);
        }

        hasSticky = true;
      };
    });

    console.log(stickyElements);

    stickyElements.forEach(el => {
        const rect = el.getBoundingClientRect();

        let offTop = !(rect.top + rect.height < 1);
        let isFixed = (rect.y <= 1 && rect.y >= 0);

        console.log({
          "element": el,
          "rect": rect,
          "top": rect.top,
          "height": rect.height,
          "top-height": rect.top + rect.height,
          "off": offTop,
          "fixed": isFixed});

        // if(rect.y <= 1 && rect.y >= 0){
        //   console.log("Still here");
        // }
    });

    // let stillStuck = stickyElements.filter(el => {

    //   const rect = stickyElement.getBoundingClientRect();

    //   let offTop = !(rect.top + rect.height < 1);
    //   let isFixed = (rect.y <= 1 && rect.y >= 0);

    //   console.log([el, offTop, isFixed]);

    //   // console.log([rect, rect.top, rect.height, rect.top + rect.height]);

    //   // if(rect.y <= 1 && rect.y >= 0){
    //   //   console.log("Still here");
    //   // }
    // });

    // console.log(stillStuck);

    if(hasSticky){
      document.body.classList.add('has-sticky');
    } else {
      document.body.classList.remove('has-sticky');
    }

    // console.log(entries);

    // console.log(entries[0].boundingClientRect);
    // console.log(stickyElement);

    // const rect = entries[0].boundingClientRect;
    // console.log(rect);

    // if (!entries[0].isIntersecting) {
    //   document.body.classList.remove('has-sticky');
    // } else {

    //   if (rect.y <= 1) {
    //     document.body.classList.add('has-sticky');
    //     stickyElement = entries[0].target
    //   }

    //   if (rect.y > 1) {
    //     document.body.classList.remove('has-sticky');
    //   }
    // }

    // If intersectionRatio is 0, the target is out of view
    // and we do not need to do anything.
    // if (entries[0].intersectionRatio <= 0) return;
  }

})();

const intersectionObserver = new IntersectionObserver(
  stickyObserverCallback,
  { "rootMargin": "-1px 0px", "threshold": [0, 0.2, 0.4, 0.6, 0.8, 1] });

// start observing
const els = document.querySelectorAll('.sticky-top');

els.forEach(el => {
  intersectionObserver.observe(el);
});
