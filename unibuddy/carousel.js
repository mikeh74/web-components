function initUnibuddyCarousel() {

    // set the unibuddy settings on the window object
    window.unibuddySettings = {
        universitySlug: "ucen-manchester",
        ubLang: "en-GB",
        ubCookieConsent: 'necessary',
    };

    // script is not loaded at this point
    let scriptLoaded = false;

    // function to load the unibuddy script
    function loadScript(){
        let script = document.createElement('script');
        script.src = "https://cdn.unibuddy.co/unibuddy-carousel.js";
        script.onload = () => { scriptLoaded = true };
        document.body.appendChild(script);
    }

    // Event callback
    function intersectionCallback(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !scriptLoaded) {
                loadScript();
            };
        });
    };

    // create the observer object
    // 50% relates to the top and bottom margin so when the element gets one
    // third of the screen height from being in the viewport then start the
    // loading process
    const observer = new IntersectionObserver(
        intersectionCallback, {rootMargin: "50% 0px"}
    );

    // wire up to elements to the observer
    document.querySelectorAll('[data-unibuddy-carousel]').forEach(el => {
    observer.observe(el);
    });
};

window.addEventListener("load", initUnibuddyCarousel);