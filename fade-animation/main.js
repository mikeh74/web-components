document.querySelector('.toggle').addEventListener('click', (event) => {

  let els = document.querySelectorAll('.result');

  els.forEach( (el) => {

    el.classList.toggle('show');

    el.addEventListener('transitionend', (event) => {
      console.log(event);
    });
  });
});