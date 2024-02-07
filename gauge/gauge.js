
var observer = new IntersectionObserver(function (entries, observer) {

  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var elem = entry.target;

      if (entry.intersectionRatio >= 0.5) {
        console.log(entry.target)
        var raw_pc = entry.target.getAttribute('data-value')
        console.log(raw_pc)
        var calculated_pc = 252 * (raw_pc / 100)
        console.log(calculated_pc)

        var el = entry.target.querySelector('#gauge-animated')
        el.classList.add('gauge-inner-grow')
      }

    }
    if (entry.intersectionRatio < 0.5) {
      var el = entry.target.querySelector('#gauge-animated')
      el.classList.remove('gauge-inner-grow')
    }
  });

}, {
  threshold: 0.5
});

var target = document.querySelector('#gauge');
observer.observe(target);