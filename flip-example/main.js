
window.addEventListener('DOMContentLoaded', () => {
  const videoLink = document.querySelectorAll('.yt-item');

  videoLink.forEach((el) => {
    el.addEventListener('click', (e) => {
      console.log(e);

      // Get the first position.
      const first = el.getBoundingClientRect();

      // Move it to the end.
      el.classList.add('front');

      // Get the last position.
      const last = el.getBoundingClientRect();

      console.log(last);

      // Invert.
      const invertY = first.top - last.top;
      const invertX = first.left - last.left;
      const scale = first.width / last.width;

      // Go from the inverted position to last.
      const player = el.animate([
        {transform: `translateY(${invertY}px) translateX(${invertX}px) scale(${scale})`},
        {transform: `translateY(0) translateX(0) scale(1)`},
      ], {
        duration: 500,
        // easing: 'cubic-bezier(0,0,0.32,1)',
        easing: 'ease-in-out',
      });

      // Do any tidy up at the end
      // of the animation.
      player.addEventListener('finish', (e) => {
        console.log(e);
      });
    });
  });
});
