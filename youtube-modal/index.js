function sendId() {
    window.addEventListener("load", function () {

        function loadYtId() {
            let YtImg = document.querySelector('.ytImg-{{ instance.id }}');
            YtImg.src = "//i.ytimg.com/vi/{{ instance.youtube_id }}/maxresdefault.jpg";
        }

        function handleIntersect(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadYtId();
                    observer.unobserve(entry.target);
                };
            });
        };

        function createObserver() {
            let observer;
            let options = {
                root: null,
                rootMargin: "25% 0px",
            };
            observer = new IntersectionObserver(handleIntersect, options);

            document.querySelectorAll('.youtube-container').forEach((el) => {
                observer.observe(el);
            });
        };

        createObserver()

    });
}
sendId();

export default function (selector = '[data-youtube-id]') {
    const els = document.querySelectorAll(selector);

    if (typeof els !== 'undefined') {

        function handleIntersect(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadScript();
                    els.forEach((el) => {
                        init(el, selector);
                    });
                    observer.unobserve(entry.target)
                };
            });
        };

        let observer;
        let options = {
            root: null,
            rootMargin: "25% 0px",
        };
        observer = new IntersectionObserver(handleIntersect, options);

        els.forEach(el => {
            observer.observe(el);

        });
    }
}
