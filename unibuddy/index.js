
// wrap in a function to avoid polluting the global scope
function unibuddyAppLoader (selector) {

    /**
     * Appends an Unibuddy iframe to the specified element.
     * 
     * @param {HTMLElement} el - The element to which the iframe will be appended.
     */
    const appendUnibuddyIframe = function (el) {
        const iframe = document.createElement('iframe');
        iframe.id = 'unibuddy-iframe';
        iframe.src = 'https://unibuddy.co/embed/ucen-manchester/colour/204c82';
        iframe.width = '100%';
        iframe.title = 'Unibuddy';
        iframe.scrolling = 'no';
        el.appendChild(iframe);
    };

    /**
     * Loads the Unibuddy script if it hasn't been loaded already.
     * This function uses a closure to store the isLoaded variable.
     *
     * @returns {Function} A function that loads the Unibuddy script.
     */
    const loadUnibuddyScript = function () {
        let isLoaded = false;
        let isLoading = false;

        return function () {
            // if the script has already been loaded or is loading
            // then return a promise that resolves immediately
            if (isLoaded || isLoading) return Promise.resolve();

            return new Promise((resolve, reject) => {
                // create a script element and set its src attribute
                const script = document.createElement('script');
                script.src = "https://cdn.unibuddy.co/unibuddy-iframe.js";

                // add a function to the onload event to set isLoaded to true
                script.onload = function () {
                    isLoaded = true;
                    isLoading = false;
                    resolve();
                };

                // add error handling for script loading failures
                script.onerror = function () {
                    isLoading = false;
                    reject(new Error('Failed to load Unibuddy script.'));
                };

                document.body.appendChild(script);
                isLoading = true;
            });
        }
    }();

    /**
     * Handles the intersection of the observed elements.
     * 
     * @param {IntersectionObserverEntry[]} entries - The entries that are intersecting.
     * @param {IntersectionObserver} observer - The observer that is observing the elements.
     * @returns {void}
     */
    function handleIntersect(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                appendUnibuddyIframe(entry.target);
                loadUnibuddyScript();
                observer.unobserve(entry.target);
            };
        });
    }

    /**
     * Creates an IntersectionObserver to observe the specified elements.
     *
     * @param {string} selector - The selector to select the elements to observe.
     * @returns {void}
     */
    function initUnibuddy(selector) {

        let observer = new IntersectionObserver(
            handleIntersect, { rootMargin: "33% 0px" });

        document.querySelectorAll(selector).forEach((el) => {
            observer.observe(el);
        });
    };

    initUnibuddy(selector);
};

// call our function
unibuddyAppLoader('.unibuddy-placeholder');