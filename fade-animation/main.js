document.querySelector('.toggle').addEventListener('click', (event) => {

  let els = document.querySelectorAll('.result');

  els.forEach( (el) => {

    el.classList.toggle('show');

    // if (el.classList.contains('show')) {
    //   // el.classList.remove('show');
    //   el.classList.add('hide');
    // } else {
    //   el.classList.add('show');
    // }

    el.addEventListener('transitionend', (event) => {
      console.log(event);
    });
  })
});