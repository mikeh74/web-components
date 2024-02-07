/**
 * @file
 * Equalise heights of elements.
 */

/**
 * Debounces a function by delaying its execution until a certain amount of time
 * has passed without any further calls.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // eslint-disable-next-line no-invalid-this
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Returns an array of heights for the given elements with the specified active class.
 * @param {HTMLElement[]} elements - The elements to get heights for.
 * @param {string} activeClass - The class name to use as active.
 * @return {number[]} An array of heights for the given elements.
 */
function getHeightsWithDisplayClass(elements, activeClass) {
  const heights = [];

  elements.forEach((element) => {
    if (element.classList.contains(activeClass)) {
      element.style.height = 'auto';
      heights.push(element.offsetHeight);
    } else {
      element.classList.add(activeClass);
      element.style.height = 'auto';
      heights.push(element.offsetHeight);
      element.classList.remove(activeClass);
    }
  });

  return heights;
}

/**
 * Calculates the heights of the given elements.
 * @param {HTMLElement[]} elements - The elements to calculate heights for.
 * @returns {number[]} - An array of heights for each element.
 */
function getHeights(elements) {
  const heights = [];
  elements.forEach((element) => {
    element.style.height = 'auto';
    heights.push(element.offsetHeight);
  });
  return heights;
}

/**
 * Sets the height of all elements in the given array to the maximum height of the array.
 * @param {Array} elements - The array of elements to set the height of.
 * @param {string} [activeClass] - The class name of the active element.
 */
function eqHeight(elements, activeClass) {
  let heights;

  if (activeClass) {
    heights = getHeightsWithDisplayClass(elements, activeClass);
  } else {
    heights = getHeights(elements);
  }

  const maxHeight = Math.max(...heights);
  elements.forEach((element) => {
    element.style.height = `${maxHeight}px`;
  });
}

/**
 * This is a simple equalise heights function that takes a css style selector
 * and then forces the height of all items to be the same.
 *
 * @param {String} parentSelector This is the parent selector to identify a
 * parent node to equalise children from
 * @param {String} itemSelector This is an optional child selector, if not
 * specified then it will take the immediate child elements
 * @param {String} activeClass Pass in an active class
 */
const equaliseHeights = (
  parentSelector,
  itemSelector = null,
  activeClass = null,
) => {
  const parentEls = document.querySelectorAll(parentSelector);

  parentEls.forEach((parentNode) => {
    let elements;

    if (itemSelector) {
      elements = parentNode.querySelectorAll(itemSelector);
    } else {
      elements = Array.from(parentNode.children);
    }

    window.addEventListener('load', () => {
      eqHeight(elements, activeClass);
    });

    window.addEventListener('resize', () => {
      debouncedEqHeight(elements, activeClass);
    });
  });
  const debouncedEqHeight = debounce(eqHeight, 100);
};

export default equaliseHeights;