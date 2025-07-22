els = document.querySelectorAll('a.b-link-stripe');

els.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
  });

  // listen for hover event to be triggered
  el.addEventListener('mouseover', (e) => {
    console.log(['hovered', e.target]);
  });

  // listen for hover event to end
  el.addEventListener('mouseout', (e) => {
    console.log(['hovered', e.target]);
  });
});
